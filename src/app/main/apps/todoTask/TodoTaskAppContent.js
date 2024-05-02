import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';

import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import update from 'immutability-helper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Pagination from '@material-ui/lab/Pagination';
import Labels from './labels';
import Filter from './filters';
import SimpleSelect from './simpleChip';

import ListItemShow from './TaskItem';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		margin: '20px'
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary
	},
	root1: {
		width: '100%'
	},
	grid3: {
		height: '100%'
	},
	nested: {
		paddingLeft: theme.spacing(4)
	},
	ic1: {
		color: 'rgb(56, 142, 60)'
	},
	ic2: {
		color: 'rgb(244, 67, 54)'
	},
	ic3: {
		color: 'rgb(0, 145, 234)'
	},
	ic4: {
		color: 'rgb(255, 152, 0)'
	},
	ic5: {
		color: 'rgb(156, 39, 176)'
	},
	li: {
		borderBottom: '1px solid #ccc',
		'&:hover': {
			'& $deletebtn': {
				display: 'block'
			}
		}
	},

	addbtnss: {
		paddingLeft: '50px',
		paddingRight: '50px'
	},
	updateBtn: {
		paddingLeft: '26px',
		paddingRight: '26px'
	},
	clearBtn: {
		paddingLeft: '50px',
		paddingRight: '50px',
		marginLeft: '12px'
	},
	size: {
		width: 'auto',
		maxWidth: '11%'
	},
	flex: {
		display: 'flex'
	},
	wh: {
		width: '100%',
		height: '50px',
		marginBottom: '12px'
	},
	inputWrap: {
		border: '1px solid #ccc',
		borderRadius: '10px',
		marginBottom: '10px'
	},
	borderNone: {
		outline: 'none',
		borderColor: 'transparent',
		width: '90%',
		resize: 'none',
		paddingLeft: '15px',
		marginTop: '10px',
		backgroundColor: 'transparent'
	},
	description: {
		outline: 'none',
		borderColor: 'transparent',
		width: '90%',
		resize: 'none',
		paddingLeft: '15px',
		marginTop: '10px',
		height: '60px',
		backgroundColor: 'transparent'
	},
	padng: {
		paddingTop: '25px',
		color: '#ccc'
	},
	pli: {
		fontSize: '13px',
		color: '#0000009c',
		fontWeight: '300',
		paddingTop: '3px',
		paddingBottom: '6px',
		margin: '0px'
	},
	ph6: {
		fontSize: '15px',
		fontWeight: '400',
		padding: '0px',
		margin: '0px'
	},
	iconpp: {
		marginLeft: '5px',
		marginRight: '5px'
	},
	liCommon: {
		fontSize: '4px',
		fontWeight: '600'
	},
	liStyle: {
		borderBottomRightRadius: '20px',
		borderTopRightRadius: '20px'
	},

	sidebarStyle: {
		borderRadius: '0px 30px 30px 0px'
	},
	onclickSidebar: {
		backgroundColor: '#61dafb',
		color: 'rgba(0, 0, 0, 0.87)!important',
		'&:hover': {
			background: '#61dafb'
		}
	},
	striking: {
		textDecorationLine: 'line-through',
		textDecorationStyle: 'solid'
	},
	deletebtn: {
		marginTop: '20px',
		display: 'none'
	},
	arrangDiv: {
		display: 'flex',
		flexDirection: 'column',
		flex: '1'
	},
	noitem: {
		textAlign: 'center',
		fontSize: '10px',
		color: '#0000008a',
		marginTop: '20px'
	},
	btnTop: {
		marginTop: 12,
		marginBottom: 12
	}
}));
const GreenCheckbox = withStyles({
	root: {
		color: '#787777',
		'&$checked': {
			color: '#61dafb'
		}
	},
	checked: {}
})(props => <Checkbox color="default" {...props} />);

export default function CenteredGrid() {
	const classes = useStyles();
	const [deletableTaskIndex, setDeletableTaskIndex] = React.useState(null);

	const handleClickOpen = indexOftaskToDelete => {
		setDeletableTaskIndex(indexOftaskToDelete);
	};

	const handleClose = () => {
		setDeletableTaskIndex(null);
	};
	// end of modal
	const [taskTitle, setTaskTitle] = useState('');
	const [taskIndexUpdate, setTaskIndexUpdate] = useState();
	const [taskDescription, setTaskDesription] = useState('');
	const [editFunctionCheck, setEditFunctionCheck] = useState(false);
	const [addedTag, setAddedTag] = React.useState(20);

	const [tasks, setTasks] = useState([
		{
			isDone: false,
			title: 'Complete the assigned work and update it in the given database as per the guidlines',
			description:
				'phonic victory was an amazing nellore phisiology may leads to causagious checking odf description',
			starred: false,
			error: false,
			tags: [21]
		},
		{
			isDone: false,
			title: 'Jiousiously phonic victory was an amazing nellore phisiology may leads to causagious soverB',
			description:
				'phonic victory was an amazing nellore phisiology may leads to causagious checking odf description',
			starred: false,
			error: false,
			tags: [22]
		},
		{
			isDone: false,
			title: 'Need to schedule the events as per the requirements and check it properly',
			description: 'Events are purely based on the previous chatrs that havebeen presented',
			starred: false,
			error: false,
			tags: [23]
		}
	]);

	const handleEditClick = editingTaskIndex => {
		const editingTask = tasks[editingTaskIndex];
		setTaskIndexUpdate(editingTaskIndex);
		setTaskTitle(editingTask.title);
		console.log(editingTask.tags[0]);
		setAddedTag(editingTask.tags[0]);
		setTaskDesription(editingTask.description);
		setEditFunctionCheck(true);
	};
	const updateClick = () => {
		const updatedTitle = update(tasks, {
			[taskIndexUpdate]: {
				title: { $set: taskTitle },
				description: { $set: taskDescription },
				tags: { $set: [addedTag] }
			}
		});
		// const updatedDescription = update(tasks, { [taskIndexUpdate]: { description: { $set: taskDescription } } });

		setTasks(updatedTitle);

		console.log(editFunctionCheck);
		setEditFunctionCheck(false);
	};
	const clearClick = () => {
		setTaskTitle('');
		setTaskDesription('');
		setAddedTag(20);
		setEditFunctionCheck(false);
	};
	const array = [];
	for (let i = 0; i < tasks.length; i += 1) {
		array.push(
			<>
				<ListItemShow
					isDone={tasks[i].isDone}
					taskIndex={i}
					starred={tasks[i].starred}
					error={tasks[i].error}
					title={tasks[i].title}
					description={tasks[i].description}
					tags={tasks[i].tags}
					checkmarkstatus={checkMarkstatus}
					handleClickOpen={handleClickOpen}
					handleStarred={handleStarred}
					handleEditClick={handleEditClick}
				/>
			</>
		);
	}
	function checkMarkstatus(checkedTodoIndex) {
		const checkstatus = tasks[checkedTodoIndex].isDone;
		const updateStatus = checkstatus === false;
		// console.log(updatecheck
		const updatesTodos = update(tasks, { [checkedTodoIndex]: { isDone: { $set: updateStatus } } });
		console.log(updatesTodos);
		setTasks(updatesTodos);
	}
	function handleStarred(checkedstarIndex) {
		const starStatus = tasks[checkedstarIndex].starred;
		const updateStar = starStatus === false;
		// console.log(updateStar);
		const updateStarTodo = update(tasks, { [checkedstarIndex]: { starred: { $set: updateStar } } });
		console.log(updateStarTodo);
		setTasks(updateStarTodo);
	}

	const deleteTodo = () => {
		const deletecIndexTodo = update(tasks, { $splice: [[deletableTaskIndex, 1]] });
		setTasks(deletecIndexTodo);
		handleClose();
	};

	// const value1Length = taskTitle.length;
	// console.log(value1Length);
	const buttonDisabled = !taskTitle;

	const buttonClick = () => {
		const newlyCreatedTask = {
			isDone: false,
			title: taskTitle,
			description: taskDescription,
			starred: false,
			error: false,
			tags: addedTag === 20 ? [] : [addedTag]
			// tags: []
		};

		const updatedTaskArr = update(tasks, { $push: [newlyCreatedTask] });
		setTasks(updatedTaskArr);
		setTaskTitle('');
		setTaskDesription('');
	};

	return (
		<>
			<CssBaseline />

			<div className={classes.root}>
				<Grid container spacing={3}>
					<Grid item xs={12} className={classes.grid3}>
						<div>
							<Typography variant="h6" gutterBottom>
								{editFunctionCheck ? 'Update todo task' : 'Create todo task'}
							</Typography>
						</div>

						<div className={classes.inputWrap}>
							<form>
								<div>
									<input
										value={taskTitle}
										type="text"
										className={classes.borderNone}
										id="borderNone1"
										placeholder="e.g.Need to change current schedule"
										onChange={ev => setTaskTitle(ev.target.value)}
									/>
								</div>
								<div>
									<textarea
										value={taskDescription}
										className={classes.description}
										id="borderNone2"
										placeholder="Description"
										onChange={ev => setTaskDesription(ev.target.value)}
									/>
								</div>
							</form>
						</div>
						<div>
							<SimpleSelect addedTag={addedTag} setAddedTag={setAddedTag} />
						</div>
						<div className={classes.btnTop}>
							{editFunctionCheck ? (
								<>
									<Button
										onClick={updateClick}
										variant="contained"
										color="primary"
										className={classes.updateBtn}
									>
										UPDATE TASK
									</Button>
									<Button onClick={clearClick} variant="contained" className={classes.clearBtn}>
										CLEAR
									</Button>
								</>
							) : (
								<Button
									disabled={buttonDisabled}
									onClick={buttonClick}
									variant="contained"
									color="primary"
									className={classes.addbtnss}
								>
									ADD TASK
								</Button>
							)}
						</div>
						{tasks.length ? (
							<List component="nav" aria-labelledby="nested-list-subheader" className={classes.root1}>
								{array}
							</List>
						) : (
							<div className={classes.noitem}>
								<Typography variant="h5" gutterBottom>
									No items in the list
								</Typography>
							</div>
						)}
						<Pagination count={10} />
					</Grid>
				</Grid>
			</div>

			<Dialog
				open={deletableTaskIndex !== null}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Are you sure you want to delete this ToDo item?
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
		</>
	);
}
