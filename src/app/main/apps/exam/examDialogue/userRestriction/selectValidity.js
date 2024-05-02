import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import { useDispatch, useSelector } from 'react-redux';
import {
	userRestrictionDialogSetValidFromDate,
	userRestrictionDialogSetValidToDate,
	userRestrictionDialogSetValidFrom,
	userRestrictionDialogSetValidTo
} from '../../store/examDialogueSlice';

const SelectValidity = () => {
	const dispatch = useDispatch();
	const { addUsersList } = useSelector(({ examApp }) => examApp.examDialogue).userRestrictionDialogue;
	const { validFromDate, validToDate, validFrom, validTo } = addUsersList;
	const handleFromDateChange = date => dispatch(userRestrictionDialogSetValidFromDate(date));
	const handleToDateChange = date => dispatch(userRestrictionDialogSetValidToDate(date));
	const handleValidFromChange = () => dispatch(userRestrictionDialogSetValidFrom(!validFrom));
	const handleValidToChange = () => dispatch(userRestrictionDialogSetValidTo(!validTo));

	return (
		<div className="flex flex-col">
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<div className="flex flex-1 flex-col my-24">
					<FormControlLabel
						control={
							<Checkbox checked={validFrom} onChange={handleValidFromChange} name="validFromCheck" />
						}
						label="Valid From"
					/>
					<Grid container justify="space-around flex">
						<KeyboardDatePicker
							disabled={!validFrom}
							className="flex flex-1 mr-4"
							margin="normal"
							id="date-picker-from"
							label="Select date"
							format="MM/dd/yyyy"
							maxDate={(validFrom && validTo && validToDate) || undefined}
							value={validFromDate}
							onChange={handleFromDateChange}
							KeyboardButtonProps={{
								'aria-label': 'change date'
							}}
						/>
						<KeyboardTimePicker
							disabled={!validFrom}
							className="flex flex-1 ml-4"
							margin="normal"
							id="time-picker-from"
							label="Select time"
							value={validFromDate}
							onChange={handleFromDateChange}
							KeyboardButtonProps={{
								'aria-label': 'change time'
							}}
						/>
					</Grid>
				</div>
			</MuiPickersUtilsProvider>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<div className="flex flex-1 flex-col my-24">
					<FormControlLabel
						control={<Checkbox checked={validTo} onChange={handleValidToChange} name="validToCheck" />}
						label="Valid To"
					/>
					<Grid container justify="space-around flex">
						<KeyboardDatePicker
							disabled={!validTo}
							className="flex flex-1 mr-4"
							margin="normal"
							id="date-picker-to"
							label="Select date"
							format="MM/dd/yyyy"
							value={validToDate}
							minDate={(validTo && validFrom && validFromDate) || undefined}
							onChange={handleToDateChange}
							KeyboardButtonProps={{
								'aria-label': 'change date'
							}}
						/>
						<KeyboardTimePicker
							disabled={!validTo}
							className="flex flex-1 ml-4"
							margin="normal"
							id="time-picker-to"
							label="Select time"
							value={validToDate}
							onChange={handleToDateChange}
							KeyboardButtonProps={{
								'aria-label': 'change time'
							}}
						/>
					</Grid>
				</div>
			</MuiPickersUtilsProvider>
		</div>
	);
};

export default SelectValidity;
