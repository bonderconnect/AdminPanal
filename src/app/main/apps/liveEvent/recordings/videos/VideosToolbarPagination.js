import React, { useState } from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import PaginationActions from 'app/fuse-layouts/shared-components/PaginationActions';

function VideosToolbarPagination({ goToPage, onRowsLimitChange, count, pageIndex, limit }) {
	const handleChangePage = (event, nextPageIndex) => {
		goToPage(nextPageIndex);
	};

	const handleChangeRowsPerPage = event => {
		const changedPageSize = Number(event.target.value);
		onRowsLimitChange(changedPageSize);
	};

	return (
		<div className="flex justify-end flex-1">
			<TablePagination
				component="div"
				classes={{
					root: 'overflow-hidden flex-shrink-0 border-0',
					spacer: 'w-0 max-w-0'
				}}
				colSpan={5}
				count={count}
				rowsPerPage={limit}
				page={pageIndex}
				SelectProps={{
					inputProps: { 'aria-label': 'rows per page' },
					native: false
				}}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
				ActionsComponent={PaginationActions}
			/>
		</div>
	);
}

export default VideosToolbarPagination;
