import 'date-fns';
import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import update from 'immutability-helper';
import AddIcon from '@material-ui/icons/Add';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Dialogs from './leadTrackerDialog';

const useStyles = makeStyles(theme => ({
	formControl: {
		minWidth: 285,
		textAlign: 'initial'
	},
	selectEmpty: {
		marginTop: theme.spacing(2)
	},

	ButtonMargin: {
		float: 'right'
	},
	tableDiv: {
		marginTop: '10px'
	},
	tableDiv1: {
		display: 'flex',
		width: 'max-content'
	},
	tableStatus: {
		display: 'flex',
		alignItems: 'center'
	},
	MainWrapDiv: {
		marginLeft: '96px',
		marginRight: '105px',
		fontFamily: "'Roboto', 'sans-serif'"
	},
	firstDivStyle: {
		paddingTop: '20px'
	},
	secondMaindiv: {
		clear: 'both',
		paddingTop: '30px',
		width: '100%',
		display: 'inline-block'
	},
	secondDividDiv: {
		width: '100%'
	},
	circle: {
		height: '5px',
		width: '5px',
		backgroundColor: 'white',
		borderRadius: '50%',
		border: '5px solid #4ea169',
		float: 'left',
		marginRight: '5px'
	},
	dialogBox: {
		textAlign: 'center'
	},
	textBoxdiv: {
		paddingBottom: '10px'
	},
	newclass: {
		width: '287px'
	},
	dateBoxdiv: {
		paddingBottom: '3px',
		marginTop: '-20px',
		paddingTop: '5px'
	},
	dateBoxwidth: {
		width: '287px'
	},
	taxtArea: {
		width: '285px'
	},
	tableCellDiv: {
		width: 'max-content'
	}
}));

function Main() {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const [deletableTaskIndex, setDeletableTaskIndex] = React.useState(null);
	const [editableTask, setEditableTask] = React.useState(null);
	const [editableTaskIntex, setEditableTaskIntex] = React.useState(null);
	const [listItemId, setListItemId] = React.useState([]);
	// const [mainChecked, setMainChecked] = React.useState();
	const [values, setValues] = React.useState([
		{
			id: 1,
			name: 'Emily dofollow',
			phone: '+1 - 202 - 555 - 0170',
			leadSource: 'Facebook',
			date: '27 12 2019',
			last_activity: '27 April 2019',
			status: 'Nurture'
		}
	]);
	const handleClose = () => {
		setDeletableTaskIndex(null);
	};
	const deleteTodo = () => {
		const deleteIndexTodo = update(values, { $splice: [[deletableTaskIndex, 1]] });
		console.log(deleteIndexTodo);
		setValues(deleteIndexTodo);
		handleClose();
	};

	const handleClickOpen = () => {
		setOpen(true);
		// console.log(open);
	};
	const deletebuttonClick = index => {
		setDeletableTaskIndex(index);
	};
	const editButtonOpen = indexOfTaskOnEdit => {
		setOpen(true);
		const editingTask = values[indexOfTaskOnEdit];
		setEditableTask(editingTask);
		setEditableTaskIntex(indexOfTaskOnEdit);
		// editingTask.name;
	};
	const onHandileChange = index => {
		// console.log(values[index].id);
		const listId = values[index].id;
		const indexOfid = listItemId.indexOf(listId);
		const updateIdStatus =
			indexOfid > -1
				? update(listItemId, { $splice: [[indexOfid, 1]] })
				: update(listItemId, { $push: [listId] });
		setListItemId(updateIdStatus);
		console.log(updateIdStatus);
	};
	const allSelectChange = () => {
		const allIdListing = values.map(newIdElements => newIdElements.id);
		const mainCheckStatus = allSelectCheck ? [] : allIdListing;
		setListItemId(mainCheckStatus);
	};
	const allSelectCheck = values.length === listItemId.length;
	// console.log('values:', values);
	return (
		<>
			<>
				<div className={classes.MainWrapDiv}>
					<div className={classes.secondMaindiv}>
						<div className={classes.secondDividDiv}>
							<Button
								variant="contained"
								color="primary"
								className={classes.ButtonMargin}
								endIcon={<AddIcon />}
								onClick={handleClickOpen}
							>
								Add a new lead
							</Button>
						</div>
					</div>
					<div className={classes.tableDiv}>
						<TableContainer component={Paper}>
							<Table className={classes.table} aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell>
											{' '}
											<Checkbox
												onChange={allSelectChange}
												checked={allSelectCheck}
												color="primary"
											/>{' '}
										</TableCell>
										<TableCell>
											<div className={classes.tableDiv1}>
												<span>NAME</span>
												<ExpandMoreIcon />
											</div>
										</TableCell>
										<TableCell>
											<div className={classes.tableDiv1}>
												<span>PHONE</span>
												<ExpandMoreIcon />
											</div>
										</TableCell>
										<TableCell>
											<div className={classes.tableDiv1}>
												<span>LEAD SOURCE</span>
												<ExpandMoreIcon />
											</div>
										</TableCell>
										<TableCell>
											<div className={classes.tableDiv1}>
												<span>STATUS</span>
												<ExpandMoreIcon />
											</div>
										</TableCell>
										<TableCell>
											<div className={classes.tableDiv1}>
												<span>DATE</span>
												<ExpandMoreIcon />
											</div>
										</TableCell>
										<TableCell>
											<div className={classes.tableDiv1}>
												<span>LAST ACTIVITY</span>
												<ExpandMoreIcon />
											</div>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{values.map((row, index) => {
										return (
											<TableRow key={row.name}>
												<TableCell>
													{' '}
													<Checkbox
														onChange={() => {
															onHandileChange(index);
														}}
														checked={listItemId.indexOf(row.id) > -1}
														color="primary"
													/>
												</TableCell>
												<TableCell>
													<div className={classes.tableCellDiv}>{row.name}</div>
												</TableCell>
												<TableCell>
													<div className={classes.tableCellDiv}>{row.phone}</div>
												</TableCell>
												<TableCell>
													<div className={classes.tableCellDiv}>{row.leadSource}</div>
												</TableCell>
												<TableCell>
													<div className={classes.tableStatus}>
														<div className={classes.circle} />
														<span>
															<div className={classes.tableCellDiv}>{row.status}</div>
														</span>
													</div>
												</TableCell>
												<TableCell>
													<div className={classes.tableCellDiv}>{row.date}</div>
												</TableCell>
												<TableCell>
													<div className={classes.tableCellDiv}>{row.last_activity}</div>
												</TableCell>
												<TableCell>
													<Button
														onClick={() => editButtonOpen(index)}
														variant="contained"
														size="small"
														color="primary"
														startIcon={<Icon>edit</Icon>}
														className={classes.rowActionButton}
													>
														edit
													</Button>
												</TableCell>
												<TableCell>
													<IconButton onClick={() => deletebuttonClick(index)}>
														<Icon>delete</Icon>
													</IconButton>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</TableContainer>
						<Dialog
							open={deletableTaskIndex !== null}
							onClose={handleClose}
							aria-labelledby="alert-dialog-title"
							aria-describedby="alert-dialog-description"
						>
							<DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
							<DialogContent>
								<DialogContentText id="alert-dialog-description">
									Are you sure you want to delete this lead?
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button onClick={handleClose} color="primary" autoFocus>
									CANCEL
								</Button>
								<Button onClick={deleteTodo} color="primary">
									DELETE
								</Button>
							</DialogActions>
						</Dialog>
					</div>
				</div>
				<Dialogs
					values={values}
					setValues={setValues}
					handleClickOpen={handleClickOpen}
					open={open}
					setOpen={setOpen}
					editableTask={editableTask}
					editableTaskIntex={editableTaskIntex}
					setEditableTask={setEditableTask}
				/>
			</>
		</>
	);
}
export default Main;
