import React, { forwardRef, useRef, useEffect } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import clsx from 'clsx';
import PaginationActions from 'app/fuse-layouts/shared-components/PaginationActions';

const useStyles = makeStyles(theme => ({
	bgWhite: {
		backgroundColor: '#fff'
	}
}));

const ExamQuestionsTable = ({ columns, data, count, limit, pageIndex, goToPage, onRowsLimitChange }) => {
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
			hooks.allColumns.push(_columns => [
				// Let's make a column for selection
				..._columns
			]);
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
		<div className={clsx('flex flex-col min-h-full sm:border-1 sm:rounded-16 overflow-hidden', classes.bgWhite)}>
			<TableContainer className="flex flex-1">
				<Table {...getTableProps()} stickyHeader>
					<TableHead>
						{headerGroups.map(headerGroup => (
							<TableRow {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map(column => (
									<TableCell
										className={clsx('whitespace-no-wrap p-12', classes.bgWhite)}
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
								<TableRow
									{...row.getRowProps()}
									// onClick={ev => onRowClick(ev, row)}
									className="truncate"
								>
									{row.cells.map(cell => {
										return (
											<TableCell
												{...cell.getCellProps()}
												className={clsx('p-12', cell.column.className)}
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
			{count && (
				<div className="flex items-center">
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
		</div>
	);
};

ExamQuestionsTable.propTypes = {
	columns: PropTypes.array.isRequired,
	data: PropTypes.array.isRequired,
	pageIndex: PropTypes.number,
	count: PropTypes.number,
	limit: PropTypes.number,
	onRowClick: PropTypes.func,
	goToPage: PropTypes.func,
	onRowsLimitChange: PropTypes.func
};

export default ExamQuestionsTable;
