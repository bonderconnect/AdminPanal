import React, { useEffect, useState, useMemo } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'app/utils/axios';

function sleep(delay = 0) {
	return new Promise(resolve => {
		setTimeout(resolve, delay);
	});
}

export default function Asynchronous(props) {
	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState([]);
	const [value, setValue] = useState(null);
	const [defaultValue, setDefaultValue] = useState(null);
	const loading = open && options.length === 0;

	useEffect(() => {
		let active = true;

		if (!loading) {
			return undefined;
		}

		(async () => {
			const response = await axios.get('/faculties', { params: { limit: -1 } });
			let faculties;

			try {
				faculties = response.data.data.faculties;
			} catch (error) {
				faculties = [];
			}
			// await sleep(1e3); // For demo purposes.

			if (active) {
				// setOptions(Object.keys(countries).map(key => countries[key].item[0]));
				setOptions(faculties);
			}
		})();

		return () => {
			active = false;
		};
	}, [loading]);

	useEffect(() => {
		if (!open) {
			setOptions([]);
		}
	}, [open]);

	useEffect(() => {
		console.log('props.value, value', props.value, value);
		if ((props.value && !value) || (props.value && value && props.value !== value.id)) {
			(async () => {
				const response = await axios.get('/faculties', { params: { user_id: props.value } });
				let faculty;

				try {
					[faculty] = response.data.data.faculties;
				} catch (error) {
					faculty = null;
				}

				if (faculty) {
					setDefaultValue(faculty);
				}
			})();
		}
	}, [props.value, value]);

	const onChange = (ev, changed) => {
		setValue(changed);
	};

	useEffect(() => {
		props.onChange(value ? value.id : null);
	}, [value]);

	return useMemo(
		() => (
			<Autocomplete
				id="faculty-autocomplete-select"
				style={{ width: '100%' }}
				open={open}
				onOpen={() => {
					setOpen(true);
				}}
				onClose={() => {
					setOpen(false);
				}}
				getOptionSelected={(option, valueObj) => option.id === valueObj.id}
				getOptionLabel={option => option.name}
				options={options}
				loading={loading}
				onChange={onChange}
				defaultValue={defaultValue}
				renderInput={params => (
					<TextField
						{...params}
						label="Faculty"
						variant="outlined"
						InputProps={{
							...params.InputProps,
							endAdornment: (
								<>
									{loading ? <CircularProgress color="inherit" size={20} /> : null}
									{params.InputProps.endAdornment}
								</>
							)
						}}
					/>
				)}
			/>
		),
		[defaultValue, options, loading, open]
	);
}
