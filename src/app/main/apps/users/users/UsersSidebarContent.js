import FuseAnimate from '@fuse/core/FuseAnimate';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUsersParams } from '../store/usersSlice';
import { getFilterPackages } from '../store/filtersSlice';

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
			marginRight: 16
		}
	}
}));

function UsersSidebarContent(props) {
	const classes = useStyles(props);
	const dispatch = useDispatch();

	const { statuses, packages } = useSelector(({ usersApp }) => usersApp.filters);
	const { params } = useSelector(({ usersApp }) => usersApp.users);
	const [statusFilterValue, setStatusFilterValue] = useState('');
	const [packagesFilterValue, setPackagesFilterValue] = useState('');

	React.useEffect(() => {
		dispatch(getFilterPackages());
	}, []);

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
			dispatch(setUsersParams(updatedParams));
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
			dispatch(setUsersParams(updatedParams));
		}, 0);
	};

	return (
		<div className="p-0 lg:p-24 lg:ltr:pr-4 lg:rtl:pl-4">
			<Card className="w-full rounded-8">
				<AppBar position="static" elevation={0}>
					<Toolbar className="px-8">
						<Icon color="action">filter_list</Icon>
						<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
							Filters
						</Typography>
						{/* <Button color="inherit" size="small">
								See All
							</Button> */}
					</Toolbar>
				</AppBar>
				<CardContent className="p-0">
					<List>
						<ListItem className="px-12">
							<FormControl variant="outlined" className="flex-1">
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
									{statuses.items.map(item => (
										<MenuItem key={`-${item.value}`} value={item.value}>
											{item.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</ListItem>
					</List>
					{packages.items && packages.items.length && (
						<List>
							<ListItem className="px-12">
								<FormControl variant="outlined" className="flex-1">
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
										{packages.items.map(item => (
											<MenuItem key={`-${item.package_id}`} value={item.package_id}>
												{item.package_title}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</ListItem>
						</List>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export default UsersSidebarContent;
