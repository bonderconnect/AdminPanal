import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import update from 'immutability-helper';
import Icon from '@material-ui/core/Icon';
import EventIcon from '@material-ui/icons/Event';
import InstagramIcon from '@material-ui/icons/Instagram';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
	dialogBox: {
		textAlign: 'center',
		borderRadius: '50%'
	},
	textBoxdiv: {
		paddingBottom: '10px',
		display: 'flex'
	},
	textBoxdiv1: {
		paddingBottom: '10px',
		paddingLeft: '47px'
	},
	newclass: {
		width: '350px'
	},
	dateBoxdiv: {
		paddingBottom: '3px',
		marginTop: '-20px',
		paddingTop: '5px',
		display: 'flex'
	},
	dateBoxwidth: {
		width: '350px'
	},
	taxtArea: {
		width: '350px'
	},
	formControl: {
		minWidth: 350,
		textAlign: 'initial'
	},
	titleDiv: {
		backgroundColor: '#192d3e',
		height: '65px',
		marginBottom: '5px'
	},
	dialogSpan: {
		color: 'white',
		fontSize: '20px',
		display: 'flex',
		paddingLeft: '30px',
		paddingTop: '20px',
		float: 'left'
	},
	dateIcon: {
		color: ' rgb(0 0 0 / 54%)'
	},
	iconStyle: {
		float: 'left',
		paddingTop: '15px',
		paddingRight: '22px'
	},
	closeIcons: {
		margin: '10px',
		color: 'gray',
		float: 'right'
	},
	textFieldDiv: {
		display: 'flex'
	}
}));

function Dialogs(props) {
	const classes = useStyles();

	const [name, setname] = React.useState('');
	const [phone, setphone] = React.useState('');
	const [leadSourceOther, setleadSourceOther] = React.useState('');
	const [leadSource, setLeadSource] = React.useState('');
	const [selectedDate, setSelectedDate] = React.useState(new Date());
	const [status, setStatus] = React.useState('');

	useEffect(() => {
		// console.log('props.editableTask', props.editableTask);
		if (props.editableTask) {
			setname(props.editableTask.name);
			setphone(props.editableTask.phone);

			setLeadSource(props.editableTask.leadSource);
			setleadSourceOther(props.editableTask.leadSourceOther);

			const dates = props.editableTask.date;
			const splitedDate = dates.split(' ');
			const newDate = new Date();
			newDate.setDate(splitedDate[0]);
			newDate.setMonth(splitedDate[1] - 1);
			newDate.setFullYear(splitedDate[2]);

			setSelectedDate(newDate);
			setStatus(props.editableTask.status);
		}
		// console.log(props.editableTask);
	}, [props.editableTask]);

	const handleClose = () => {
		// if (props.editableTask === 0 || props.editableTask) {
		// 	props.setOpen(false);
		// } else {
		props.setOpen(false);
		setname('');
		setphone('');
		setleadSourceOther('');
		setLeadSource('');
		setStatus('');
		props.setEditableTask(null);
		setSelectedDate(new Date());
		// }
	};
	const handleChange = event => {
		setLeadSource(event.target.value);
	};
	const handleDateChange = date => {
		// date=new Date();
		// const fulldate=date.toISOString();
		// console.log('date:', date);
		setSelectedDate(date);
	};
	const submitButtonClick = () => {
		const dateString = `${selectedDate.getDate()} ${selectedDate.getMonth() + 1} ${selectedDate.getFullYear()}`;

		const newValuesUpdate = {
			id: new Date().getTime(),
			name,
			phone,
			leadSource: leadSource === 'Other' ? leadSourceOther : leadSource,
			date: dateString,
			last_activity: '27 April 2019',
			status
		};
		if (props.editableTask === 0 || props.editableTask) {
			const editingarray = update(props.values, { [props.editableTaskIntex]: { $set: newValuesUpdate } });
			props.setValues(editingarray);
			console.log(editingarray);
			props.setOpen(false);
			setname('');
			setphone('');
			setleadSourceOther('');
			setLeadSource('');
			setStatus('');
			props.setEditableTask(null);
			setSelectedDate(new Date());
		} else {
			const updatedTaskArr = update(props.values, { $push: [newValuesUpdate] });
			props.setValues(updatedTaskArr);
			// const updatedId = update(props.checkedItems, { $push: [newValuesUpdate.id] });
			// props.setCheckedItems(updatedId);
			// console.log(updatedId);
			props.setOpen(false);
			setname('');
			setphone('');
			setleadSourceOther('');
			setLeadSource('');
			setStatus('');
			setSelectedDate(new Date());
		}
	};
	// const buttonDisabling1=((name!=='') && (phone!=='') && (lead_source1!==''));
	// const buttonDisabling2=((name!=='') && (phone!=='') && (lead_source!=='' && lead_source!=='other'))
	// const buttonDisabling =(buttonDisabling1 || buttonDisabling2)?false:true

	const isButtonEnabled = !(
		name &&
		phone &&
		leadSource &&
		status &&
		(leadSource === 'Other' ? leadSourceOther : true)
	);

	return (
		<>
			<Dialog
				maxWidth="xs"
				fullWidth
				open={props.open}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
				className={classes.dialogBox}
			>
				<div className={classes.titleDiv}>
					<div>
						<span className={classes.dialogSpan}>Lead Tracker</span>
					</div>
					<IconButton
						onClick={handleClose}
						aria-label="upload picture"
						component="span"
						className={classes.closeIcons}
					>
						<CloseIcon />
					</IconButton>
				</div>

				<DialogContent>
					<div className={classes.textBoxdiv}>
						<div className={classes.iconStyle}>
							<Icon color="action">account_circle</Icon>
						</div>
						<TextField
							className={classes.newclass}
							label="Name"
							variant="outlined"
							value={name}
							onChange={ev => setname(ev.target.value)}
						/>
					</div>
					<div className={classes.textBoxdiv}>
						<div className={classes.iconStyle}>
							<Icon color="action">phone</Icon>
						</div>
						<TextField
							className={classes.newclass}
							label="phone"
							variant="outlined"
							value={phone}
							onChange={ev => setphone(ev.target.value)}
						/>
					</div>
					<div className={classes.iconStyle}>
						<InstagramIcon className={classes.dateIcon} />
					</div>
					<div className={classes.textBoxdiv}>
						<FormControl variant="outlined" className={classes.formControl}>
							<InputLabel id="demo-simple-select-outlined-label">Lead-source</InputLabel>

							<Select
								labelId="demo-simple-select-outlined-label"
								value={leadSource}
								onChange={handleChange}
								label="Lead-source"
							>
								<MenuItem value="">
									<em>None</em>
								</MenuItem>
								<MenuItem value="Facebook">Facebook</MenuItem>
								<MenuItem value="Instagram">Instagram</MenuItem>
								<MenuItem value="Other">Other</MenuItem>
							</Select>
						</FormControl>
					</div>
					{leadSource === 'Other' ? (
						<div className={classes.textBoxdiv1}>
							<TextField
								className={classes.newclass}
								label="Lead-source"
								variant="outlined"
								value={leadSourceOther}
								onChange={ev => setleadSourceOther(ev.target.value)}
							/>
						</div>
					) : null}
					<div className={classes.iconStyle}>
						<EventIcon className={classes.dateIcon} />
					</div>
					<div className={classes.dateBoxdiv}>
						<div>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<KeyboardDatePicker
									className={classes.dateBoxwidth}
									inputVariant="outlined"
									margin="normal"
									label="Date"
									format="MM/dd/yyyy"
									value={selectedDate}
									onChange={handleDateChange}
									KeyboardButtonProps={{
										'aria-label': 'change date'
									}}
								/>
							</MuiPickersUtilsProvider>
						</div>
					</div>
					<div className={classes.textBoxdiv}>
						<div className={classes.iconStyle}>
							<Icon color="action">perm_identity</Icon>
						</div>
						<FormControl variant="outlined" className={classes.formControl}>
							<InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>

							<Select
								labelId="demo-simple-select-outlined-label"
								value={status}
								onChange={ev => setStatus(ev.target.value)}
								label="Status"
							>
								<MenuItem value="">
									<em>None</em>
								</MenuItem>
								<MenuItem value="Working / Progressing">Working / Progressing</MenuItem>
								<MenuItem value="Not Responding">Not Responding</MenuItem>
								<MenuItem value="Qualified / Closed">Qualified / Closed</MenuItem>
								<MenuItem value="Nurture">Nurture</MenuItem>
								<MenuItem value="Unqualified">Unqualified</MenuItem>
							</Select>
						</FormControl>
					</div>
					<div className={classes.textFieldDiv}>
						<div className={classes.iconStyle}>
							<Icon color="action">description</Icon>
						</div>
						<TextField
							className={classes.taxtArea}
							id="outlined-multiline-static"
							label="Notes"
							multiline
							rows={4}
							variant="outlined"
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button disabled={isButtonEnabled} onClick={submitButtonClick} color="primary">
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
export default Dialogs;
