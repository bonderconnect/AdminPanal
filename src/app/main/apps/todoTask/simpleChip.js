import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
		marginLeft: 0
	},
	selectEmpty: {
		marginTop: theme.spacing(2)
	}
}));
const SimpleSelect = props => {
	const classes = useStyles();

	const handleChange = event => {
		props.setAddedTag(event.target.value);
		console.log(event.target.value);
	};

	const simpleChipItem = [
		{
			title: 'None',
			value: 20,
			name: 'none'
		},
		{
			title: 'Fee collection',
			value: 21,
			name: 'feeCollection'
		},
		{
			title: 'Admission',
			value: 22,
			name: 'admission'
		},
		{
			title: 'Exam',
			value: 23,
			name: 'exam'
		}
	];
	return (
		<div>
			<FormControl variant="outlined" className={classes.formControl} size="small">
				<InputLabel id="demo-simple-select-outlined-label">Labels</InputLabel>
				<Select
					labelId="demo-simple-select-outlined-label"
					id="demo-simple-select-outlined"
					value={props.addedTag}
					onChange={handleChange}
					label="Labels"
				>
					{/* <MenuItem value="">
						<em>None</em>
					</MenuItem> */}
					{simpleChipItem.map(nwSimpleChipItem => {
						const chipTitle = nwSimpleChipItem.title;
						const chipValue = nwSimpleChipItem.value;
						return <MenuItem value={chipValue}>{chipTitle}</MenuItem>;
					})}
				</Select>
			</FormControl>
		</div>
	);
};
export default SimpleSelect;
