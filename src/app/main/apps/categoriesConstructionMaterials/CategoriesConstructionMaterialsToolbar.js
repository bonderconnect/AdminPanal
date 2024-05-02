import React from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import PaginationActions from 'app/fuse-layouts/shared-components/PaginationActions';

const CategoriesConstructionMaterialsToolbar = props => {
	const { limit, count, onChangeRowsPerPage, onChangePage, page } = props;

	return (
		<div className="flex flex-1 justify-end px-12">
			<TablePagination
				component="div"
				classes={{
					root: 'overflow-hidden flex-shrink-0 border-0',
					spacer: 'w-0 max-w-0'
				}}
				colSpan={5}
				count={count}
				rowsPerPage={limit}
				page={page - 1}
				SelectProps={{
					inputProps: { 'aria-label': 'rows per page' },
					native: false
				}}
				onChangePage={onChangePage}
				onChangeRowsPerPage={onChangeRowsPerPage}
				ActionsComponent={PaginationActions}
			/>
		</div>
	);
};
export default CategoriesConstructionMaterialsToolbar;
