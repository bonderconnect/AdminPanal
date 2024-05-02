import React from 'react';
import Table from '@material-ui/core/Table';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import clsx from 'clsx';
import PaginationActions from 'app/fuse-layouts/shared-components/PaginationActions';

const useStyles = makeStyles(theme => ({
	bgWhite: {
		backgroundColor: '#fff'
	},
	borderBottomThick: {
		borderBottomWidth: 2
	},
	borderTop: {
		borderWidth: '1px',
		borderColor: '#ddd'
	}
}));

const EnhancedTable = ({ columns, data, count, limit, pageIndex, goToPage, onRowsLimitChange, loading }) => {
	const classes = useStyles();
	const { getTableProps, headerGroups, prepareRow, page } = useTable(
		{
			columns,
			data,
			autoResetPage: true,
			manualPagination: true
		},
		useGlobalFilter,
		useSortBy,
		usePagination,
		useRowSelect,
		hooks => {
			hooks.allColumns.push(_columns => [..._columns]);
		}
	);

	const handleChangePage = (event, nextPageIndex) => {
		goToPage(nextPageIndex);
	};

	const handleChangeRowsPerPage = event => {
		const changedPageSize = Number(event.target.value);
		onRowsLimitChange(changedPageSize);
	};

	// Render the UI for your table
	return (
		<div className={clsx('flex flex-col sm:border-1 overflow-hidden', classes.bgWhite)}>
			{count && (
				<div className="flex items-center justify-end">
					{loading && (
						<Box className="flex flex-1 items-center justify-end pr-24">
							<span className="pr-8">Loading...</span>
							<CircularProgress size={26} />
						</Box>
					)}
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
			)}
			<TableContainer className={clsx('flex', 'flex-1', classes.borderTop)}>
				<Table {...getTableProps()} stickyHeader>
					<TableHead>
						{headerGroups.map(headerGroup => (
							<TableRow {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map(column => (
									<TableCell
										className={clsx(
											'whitespace-no-wrap p-12',
											classes.bgWhite,
											classes.borderBottomThick
										)}
										{...(!column.sortable
											? column.getHeaderProps()
											: column.getHeaderProps(column.getSortByToggleProps()))}
									>
										{column.render('Header')}
										{column.sortable ? (
											<TableSortLabel
												active={column.isSorted}
												// react-table has a unsorted state which is not treated here
												direction={column.isSortedDesc ? 'desc' : 'asc'}
											/>
										) : null}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableHead>
					<TableBody>
						{page.map((row, i) => {
							prepareRow(row);
							return (
								<TableRow {...row.getRowProps()} className="truncate">
									{row.cells.map(cell => {
										return (
											<TableCell
												{...cell.getCellProps()}
												className={clsx('py-8', cell.column.className)}
											>
												{cell.render('Cell')}
											</TableCell>
										);
									})}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

EnhancedTable.propTypes = {
	columns: PropTypes.array.isRequired,
	data: PropTypes.array.isRequired,
	pageIndex: PropTypes.number,
	count: PropTypes.number,
	limit: PropTypes.number,
	goToPage: PropTypes.func,
	onRowsLimitChange: PropTypes.func,
	loading: PropTypes.bool
};

export default EnhancedTable;
