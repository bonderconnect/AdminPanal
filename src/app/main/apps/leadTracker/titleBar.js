import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	firstDividDiv: {
		float: 'left',
		width: '40%'
	},
	firstSpan: {
		fontSize: 'small',
		fontWeight: 'bold',
		float: 'left',
		width: '16%',
		paddingTop: '6px',
		marginLeft: '10px'
	},
	firstBoxDiv: {
		height: '30px',
		width: '150px',
		backgrountColor: 'white',
		borderRedius: '5px',
		float: 'left',
		fontSize: 'small',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	spanAll: {
		color: '#4180c6'
	},
	spanItem: {
		color: '#676b74',
		marginLeft: '12px'
	},
	secondBoxDiv: {
		height: '30px',
		width: '205px',
		backgroundColor: 'white',
		borderRadius: '5px',
		float: 'left',
		marginLeft: '8px',
		fontSize: 'small',
		display: 'flex',
		alignItems: 'center',
		color: '#676b74'
	},
	spanItem1: {
		color: '#000000',
		marginLeft: '12px',
		fontSize: '8px'
	}
});

const Title = () => {
	const classes = useStyles();

	return (
		<>
			<div className={classes.firstDividDiv}>
				<div className={classes.firstSpan}>My Leads</div>
				<div className={classes.firstBoxDiv}>
					<span className={classes.spanAll}>All</span>
					<span className={classes.spanItem}>7d</span>
					<span className={classes.spanItem}>1m</span>
					<span className={classes.spanItem}>6m </span>
					<span className={classes.spanItem}>1y</span>
				</div>
				<div className={classes.secondBoxDiv}>
					<span className={classes.spanItem}>20 April 2019</span>
					<span className={classes.spanItem1}>
						<i className="fas fa-angle-right" />
					</span>
					<span className={classes.spanItem}>05 May,2019</span>
				</div>
			</div>
		</>
	);
};
export default Title;
