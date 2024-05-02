import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LabelOutlinedIcon from '@material-ui/icons/LabelOutlined';
import * as Icons from '@material-ui/icons';
import update from 'immutability-helper';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
	root1: {
		width: '100%'
	},
	sidebarStyle: {
		borderRadius: '0px 30px 30px 0px'
	},
	onclickSidebar: {
		backgroundColor: '#61dafb',
		color: 'rgba(0, 0, 0, 0.87) !important',
		'&:hover': {
			background: '#61dafb'
		}
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
	activeFilterItem: {
		backgroundColor: '#61dafb',
		color: 'rgba(0, 0, 0, 0.87) !important',
		'&:hover': {
			background: '#61dafb'
		}
	}
}));
export const Labels1 = {
	21: {
		title: 'Fee Collection',
		icon: 'LabelOutlined',
		name: 'feeCollection',
		iconColor: 'ic1',
		color: 'rgb(56, 142, 60)'
	},
	22: {
		title: 'Admission',
		icon: 'LabelOutlined',
		name: 'backend',
		iconColor: 'ic2',
		color: 'rgb(244, 67, 54)'
	},
	23: {
		title: 'Exam',
		icon: 'LabelOutlined',
		name: 'exam',
		iconColor: 'ic3',
		color: 'rgb(0, 145, 234)'
	}
};

const Labels = () => {
	const classes = useStyles();
	const [selectedLabel, setSelectedLabel] = useState([]);

	function selectedItemUpdate(filterLabelName) {
		const inSelectedLabelIndex = selectedLabel.indexOf(filterLabelName);
		// console.log(inSelectedLabelIndex);
		const updatedSelectedLabel =
			inSelectedLabelIndex === -1
				? update(selectedLabel, { $push: [filterLabelName] })
				: update(selectedLabel, {
						$splice: [[inSelectedLabelIndex, 1]]
				  });

		setSelectedLabel(updatedSelectedLabel);
	}

	return (
		<List
			component="nav"
			aria-labelledby="nested-list-subheader"
			subheader={
				<ListSubheader component="div" id="nested-list-subheader">
					LABELS
				</ListSubheader>
			}
			className={classes.root1}
		>
			{Object.values(Labels1).map(filterItem => {
				// console.log(filterItem);
				const IconComponent = Icons[filterItem.icon];

				const classColor = filterItem.iconColor;
				const textInput = filterItem.title;
				// console.log(textInput);
				const applyClass = selectedLabel.indexOf(filterItem.name) !== -1;

				return (
					<ListItem
						onClick={() => {
							selectedItemUpdate(filterItem.name);
						}}
						className={clsx(classes.sidebarStyle, applyClass ? classes.activeFilterItem : undefined)}
						button
					>
						<ListItemIcon>
							<IconComponent className={clsx(classes[classColor])} />
						</ListItemIcon>
						<ListItemText primary={[textInput]} />
					</ListItem>
				);
			})}
		</List>
	);
};
export default Labels;
