import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import StarIcon from '@material-ui/icons/Star';
import ErrorIcon from '@material-ui/icons/Error';
import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';
import Container from '@material-ui/core/Container';
import TodoChip from './todoChip';
import { Labels1 } from './labels';

const useStyles = makeStyles(theme => ({
	li: {
		borderBottom: '1px solid #ccc',
		'&:hover': {
			'& $deletebtn': {
				display: 'block'
			}
		}
	},
	flex: {
		display: 'flex'
	},
	arrangDiv: {
		display: 'flex',
		flexDirection: 'column',
		flex: '1'
	},
	striking: {
		textDecorationLine: 'line-through',
		textDecorationStyle: 'solid'
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
	left: {
		float: 'left',
		marginRight: '5px'
	},
	size: {
		width: 'auto',
		maxWidth: '11%'
	},
	deletebtn: {
		marginTop: '20px',
		display: 'none'
	},
	deleGrid: {
		display: 'flex',
		justifyContent: 'end',
		alignItems: 'end'
	},
	editBtn: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	dltIcon: {
		marginTop: 0,
		marginBottom: '10px'
	},
	padng: {
		paddingTop: '25px',
		color: '#ccc'
	},
	iconpp: {
		marginLeft: '5px',
		marginRight: '5px'
	},
	starColor: {
		color: 'rgb(255, 193, 7)'
	},
	errorColor: {
		color: 'rgb(244, 67, 54)'
	},
	liCommon: {
		fontSize: '4px',
		fontWeight: '600'
	},
	liStyle: {
		borderBottomRightRadius: '20px',
		borderTopRightRadius: '20px'
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
function ListItemShow(props) {
	const classes = useStyles();

	return (
		<ListItem
			onClick={() => {
				props.checkmarkstatus(props.taskIndex);
			}}
			button
			className={classes.li}
			key={`_${props.taskIndex}`}
		>
			<Grid container spacing={3}>
				<Grid item xs={9} className={classes.flex}>
					<FormControlLabel
						control={
							<GreenCheckbox
								checked={props.isDone}
								inputProps={{ 'aria-label': 'uncontrolled-checkbox' }}
							/>
						}
						inputProps={{ 'aria-label': 'primary checkbox' }}
					/>

					<div className={clsx(classes.arrangDiv)}>
						<div className={clsx(props.isDone ? classes.striking : undefined)}>
							<h4 className={clsx(classes.ph6)}>{props.title}</h4>

							<p className={clsx(classes.pli)}>{props.description}</p>
						</div>
						<div>
							{props.tags.map(filterItemId => {
								const filterItemObj = Labels1[filterItemId];
								console.log(filterItemObj.iconColor);
								return (
									<TodoChip
										title={filterItemObj.title}
										className={clsx(classes.size, classes.left)}
										color={filterItemObj.color}
									/>
								);
							})}
						</div>
					</div>
				</Grid>
				<Grid item xs={1} className={clsx(classes.deleGrid)}>
					<IconButton
						variant="contained"
						className={clsx(classes.deletebtn, classes.dltIcon)}
						onClick={event => {
							event.stopPropagation();
							props.handleClickOpen(props.taskIndex);
						}}
					>
						<Icon>delete</Icon>
					</IconButton>
				</Grid>
				<Grid item xs={1} className={clsx(classes.editBtn)}>
					<Button
						onClick={ev => {
							ev.stopPropagation();
							props.handleEditClick(props.taskIndex);
						}}
						variant="contained"
						size="small"
						color="primary"
						startIcon={<Icon>edit</Icon>}
						className={classes.rowActionButton}
					>
						edit
					</Button>
				</Grid>
				<Grid item xs={1}>
					<div className={clsx(classes.flex, classes.padng)}>
						<StarIcon
							onClick={ev => {
								ev.stopPropagation();
								props.handleStarred(props.taskIndex);
							}}
							className={clsx(classes.iconpp, props.starred ? classes.starColor : undefined)}
						/>
						<ErrorIcon className={clsx(classes.iconpp, props.error ? classes.errorColor : undefined)} />
					</div>
				</Grid>
			</Grid>
		</ListItem>
	);
}

export default ListItemShow;
