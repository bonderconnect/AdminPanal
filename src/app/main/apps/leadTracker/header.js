import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	root: {
		width: '124px',
		height: '100px',
		textAlign: 'center',
		float: 'left',
		marginRight: '10px',
		backgroundColor: '#536378'
	},
	pos: {
		fontSize: '12px'
	},
	fontSize: {
		fontWeight: '600',
		fontSize: '5rem'
	},
	firstDivStyle: {
		paddingTop: '20px',
		marginRight: '10px',
		marginLeft: '10px'
	}
});

const Header = () => {
	const classes = useStyles();
	return (
		<>
			<div className={classes.firstDivStyle}>Lead Statuses</div>
			<Card className={classes.root}>
				<CardContent>
					<Typography variant="h2" className={classes.fontSize}>
						4
					</Typography>
					<Typography className={classes.pos} color="textSecondary">
						Working/Progress
					</Typography>
				</CardContent>
			</Card>
			<Card className={classes.root}>
				<CardContent>
					<Typography variant="h2" className={classes.fontSize}>
						10
					</Typography>
					<Typography className={classes.pos} color="textSecondary">
						Not Responding
					</Typography>
				</CardContent>
			</Card>
			<Card className={classes.root}>
				<CardContent>
					<Typography variant="h2" className={classes.fontSize}>
						12
					</Typography>
					<Typography className={classes.pos} color="textSecondary">
						Qualified/Closed
					</Typography>
				</CardContent>
			</Card>
			<Card className={classes.root}>
				<CardContent>
					<Typography variant="h2" className={classes.fontSize}>
						8
					</Typography>
					<Typography className={classes.pos} color="textSecondary">
						Nurture
					</Typography>
				</CardContent>
			</Card>
		</>
	);
};

export default Header;
