import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles(theme => ({
	chips: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	chip: {
		margin: 2
	},
	noLabel: {
		marginTop: theme.spacing(3)
	}
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250
		}
	}
};

function getStyles(value, selectedValues, theme) {
	return {
		fontWeight:
			selectedValues.indexOf(value) === -1
				? theme.typography.fontWeightRegular
				: theme.typography.fontWeightMedium
	};
}

const ChipSelect = props => {
	const classes = useStyles();
	const theme = useTheme();
	const [optionsValueLabelMap, setOptionsValueLabelMap] = useState({});
	const { options, value, onChange, className, name, label } = props;

	useEffect(() => {
		const optionsValueLabelMapObj = {};
		options.forEach(element => {
			optionsValueLabelMapObj[element.value] = element.label;
		});
		setOptionsValueLabelMap(optionsValueLabelMapObj);
	}, [options]);

	const handleChange = event => {
		event.persist();
		event.target.name = props.name;
		onChange(event);
	};

	return (
		<div className={clsx('flex flex-1', className)}>
			<FormControl className="flex flex-1">
				<InputLabel id={`form-mutiple-chip-${name}-label`}>{label}</InputLabel>
				<Select
					labelId={`form-mutiple-chip-${name}-label`}
					id={`form-mutiple-chip-${name}`}
					multiple
					value={value}
					onChange={handleChange}
					input={<Input id={`select-mutiple-chip-${name}`} />}
					renderValue={selected => (
						<div className={classes.chips}>
							{selected.map(item => (
								<Chip key={item} label={optionsValueLabelMap[item]} className={classes.chip} />
							))}
						</div>
					)}
					MenuProps={MenuProps}
				>
					{options.map(item => (
						<MenuItem key={item.value} value={item.value} style={getStyles(item.value, value, theme)}>
							{item.label}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
};

export default ChipSelect;
