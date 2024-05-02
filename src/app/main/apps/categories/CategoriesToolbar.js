import React from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import PaginationActions from 'app/fuse-layouts/shared-components/PaginationActions';
import { useSelector, useDispatch } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import { setParams } from './store/packagesSlice';

const CategoriesToolbar = props => {
	const { limit, count, onChangeRowsPerPage, onChangePage, page, tabValue, setTabValue } = props;

	return (
		<div className="flex flex-1 justify-end px-12">
			<Tabs
				value={tabValue}
				onChange={(event, newValue) => setTabValue(newValue)}
				aria-label="simple tabs example"
			>
				<Tab label="Categories" />
				<Tab label="Types" />
			</Tabs>
		</div>
	);
};
export default CategoriesToolbar;
