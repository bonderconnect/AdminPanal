import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListSubheader from '@material-ui/core/ListSubheader';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { setExamsParams } from '../store/examsSlice';
import { selectPackages } from '../store/packageSlice';
import { openNewExamDialog } from '../store/examDialogueSlice';
import ExamsSidebarCategories from './ExamsSidebarCategories';

const isCRUDisabled = process.env.REACT_APP_DISABLE_EXAM_EDIT;

const useStyles = makeStyles(theme => ({
	listItem: {
		color: 'inherit!important',
		textDecoration: 'none!important',
		height: 40,
		width: 'calc(100% - 16px)',
		borderRadius: '0 20px 20px 0',
		paddingLeft: 24,
		paddingRight: 12,
		'&.active': {
			backgroundColor: theme.palette.secondary.main,
			color: `${theme.palette.secondary.contrastText}!important`,
			pointerEvents: 'none',
			'& .list-item-icon': {
				color: 'inherit'
			}
		},
		'& .list-item-icon': {
			fontSize: 16,
			width: 16,
			height: 16,
			marginRight: 16
		}
	},
	listSubheader: {
		paddingLeft: 0,
		paddingRight: 0
	}
}));

function ExamsSidebarContent(props) {
	const dispatch = useDispatch();
	const { params } = useSelector(({ examApp }) => examApp.exams);
	const packages = useSelector(selectPackages);
	const { t } = useTranslation('examApp');
	const classes = useStyles(props);

	const [statusFilterValue, setStatusFilterValue] = useState('');
	const [packagesFilterValue, setPackagesFilterValue] = useState('');

	const handleCategoryChange = categoryId => {
		setTimeout(() => {
			const updatedParams = { ...params, page: 1 };
			if (categoryId) {
				updatedParams.category_id = categoryId;
			} else {
				delete updatedParams.category_id;
			}
			dispatch(setExamsParams(updatedParams));
		}, 0);
	};

	const statusSelectionoptions = [
		{ value: 1, label: 'Published / Active' },
		{ value: 0, label: 'Unpublished / Inactive' }
	];

	const onStatusFilterChange = ev => {
		setStatusFilterValue(ev.target.value);
		// for non blocking rendering
		setTimeout(() => {
			const updatedParams = { ...params, page: 1 };
			if (ev.target.value !== '') {
				updatedParams.status_value = ev.target.value;
			} else {
				delete updatedParams.status_value;
			}
			dispatch(setExamsParams(updatedParams));
		}, 0);
	};

	const onPackageFilterChange = ev => {
		setPackagesFilterValue(ev.target.value);
		// for non blocking rendering
		setTimeout(() => {
			const updatedParams = { ...params, page: 1 };
			if (ev.target.value !== '') {
				updatedParams.package_id = ev.target.value;
			} else {
				delete updatedParams.package_id;
			}
			dispatch(setExamsParams(updatedParams));
		}, 0);
	};

	return (
		<div className="flex-auto border-l-1">
			{!isCRUDisabled ? (
				<div className="p-24">
					<Button
						endIcon={<Icon>add</Icon>}
						variant="contained"
						color="primary"
						className="w-full"
						onClick={() => dispatch(openNewExamDialog())}
					>
						{t('CREATE_NEW')}
					</Button>
				</div>
			) : null}

			<div className="px-24">
				<List>
					<ListSubheader className={classes.listSubheader} disableSticky>
						{t('FILTERS')}
					</ListSubheader>
				</List>

				<ExamsSidebarCategories setCategory={handleCategoryChange} />

				<List>
					<ListItem className="p-0">
						<FormControl className="flex-1">
							<InputLabel id="usersapp-filter-statuses-label">Statuses</InputLabel>
							<Select
								labelId="usersapp-filter-statuses-label"
								id="usersapp-filter-statuses"
								value={statusFilterValue}
								onChange={onStatusFilterChange}
								label="Statuses"
							>
								<MenuItem value="">
									<em>All</em>
								</MenuItem>
								{statusSelectionoptions.map(item => (
									<MenuItem key={`-${item.value}`} value={item.value}>
										{item.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</ListItem>
				</List>
				{packages && packages.length && (
					<List>
						<ListItem className="p-0">
							<FormControl className="flex-1">
								<InputLabel id="usersapp-filter-statuses-label">Packages</InputLabel>
								<Select
									labelId="usersapp-filter-statuses-label"
									id="usersapp-filter-statuses"
									value={packagesFilterValue}
									onChange={onPackageFilterChange}
									label="Packages"
								>
									<MenuItem value="">
										<em>All</em>
									</MenuItem>
									{packages.map(item => (
										<MenuItem key={`-${item.package_id}`} value={item.package_id}>
											{item.package_title}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</ListItem>
					</List>
				)}
			</div>
		</div>
	);
}

export default ExamsSidebarContent;
