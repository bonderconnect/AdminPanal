import React, { useEffect, useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';
import { withFormsy } from 'formsy-react';

const customStyles = {
	container: (provided, state) => ({
		...provided,
		width: '100%'
	}),
	control: (provided, state) => ({
		...provided,
		height: 50
	}),
	menu: (provided, state) => ({
		...provided,
		zIndex: 999
	}),
	option: (provided, state) => ({
		...provided,
		zIndex: 999
	})
};

function PackageSelection(props) {
	const persistedValue = useRef(null);

	const [value, setValue] = useState(null);

	useEffect(() => {
		console.log('props', props);
		if (!persistedValue.current && props.value) {
			loadDefaultValue(props.value);
		}
	}, [props.value]);

	const loadOptions = (inputValue, callback) => {
		// console.log('inputValue:', inputValue);
		axios
			.get('/packages', {
				params: {
					search: inputValue,
					page: 1,
					limit: 5
				}
			})
			.then(response => helpers.parseApiResponse(response, { returnArray: true }))
			.then(result => result.data.map(item => ({ label: item.package_title, value: item.package_id })))
			.then(callback);
	};

	const loadDefaultValue = packageId => {
		axios
			.get(`/package/${packageId}`)
			.then(response => helpers.parseApiResponse(response))
			.then(result => ({ label: result.data.title, value: result.data.package_id }))
			.then(setValue);
	};

	const handleInputChange = newValue => {
		setValue(newValue);
		const changeEvent = new helpers.CustomEvent('asyncSelect', newValue.value, props.name);
		props.onChange(changeEvent);
	};

	return (
		<div className="flex flex-1 mb-24">
			<AsyncSelect
				styles={customStyles}
				cacheOptions
				loadOptions={loadOptions}
				defaultOptions
				value={value}
				placeholder="Choose a package *"
				onChange={handleInputChange}
			/>
		</div>
	);
}

export default React.memo(withFormsy(PackageSelection));
