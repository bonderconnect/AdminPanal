import FuseAnimate from '@fuse/core/FuseAnimate';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectPackageById } from './store/packagesSlice';

const useStyles = makeStyles({
	table: {
		'& th': {
			padding: '16px 0'
		}
	},
	typeIcon: {
		'&.folder:before': {
			content: "'folder'",
			color: '#FFB300'
		},
		'&.document:before': {
			content: "'insert_drive_file'",
			color: '#1565C0'
		},
		'&.spreadsheet:before': {
			content: "'insert_chart'",
			color: '#4CAF50'
		}
	}
});

function PackagesRightSidebarContent(props) {
	const { pageLayout } = props;
	const selectedItem = useSelector(state => selectPackageById(state, state.packagesApp.packages.selectedItemId));

	const classes = useStyles();

	useEffect(() => {
		window._ref = pageLayout.current;
		pageLayout.current.toggleRightSidebar();
	}, [selectedItem]);

	if (!selectedItem) {
		return null;
	}

	return (
		<FuseAnimate animation="transition.slideUpIn" delay={200}>
			<div className="file-details p-16 sm:p-24">
				<FormControlLabel
					className="offline-switch"
					control={<Switch checked={selectedItem.status_value === 1} aria-label="Package status" />}
					label="Package status"
				/>

				<Typography variant="subtitle1" className="py-16">
					Info
				</Typography>

				<table className={clsx(classes.table, 'w-full text-justify')}>
					<tbody>
						<tr className="type">
							<th>Title</th>
							<td>{selectedItem.package_title}</td>
						</tr>
						<tr className="type">
							<th>Description</th>
							<td>{selectedItem.package_description}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</FuseAnimate>
	);
}

export default PackagesRightSidebarContent;
