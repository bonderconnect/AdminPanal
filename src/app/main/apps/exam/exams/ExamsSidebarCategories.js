import FuseAnimate from '@fuse/core/FuseAnimate';
import Icon from '@material-ui/core/Icon';
import update from 'immutability-helper';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import React, { useState, memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectCategories } from '../store/categorySlice';

function ExamsSidebarCategories(props) {
	const dispatch = useDispatch();
	const { setCategory } = props;
	const categories = useSelector(selectCategories);
	const [categoryFilters, setCategoryFilters] = useState([]);

	function onFilterChange(ev, filterIndex) {
		// ev.preventDefault();
		const itemValue = ev.target.value;

		setCategoryFilters(state => {
			let updatedState = update(state, {
				[filterIndex]: { selected: { $set: itemValue || null } }
			});

			if (filterIndex < updatedState.length - 1) {
				updatedState = update(updatedState, {
					$splice: [[filterIndex + 1, updatedState.length - filterIndex]]
				});
			}

			const childCategories = categories.filter(item => item.parent_id === itemValue);

			if (childCategories.length) {
				updatedState = update(updatedState, {
					$push: [
						{
							label: childCategories[0].type_text,
							key: `-${childCategories[0].type_value}`,
							categories: childCategories,
							selected: null
						}
					]
				});
			}

			setCategory(itemValue || (updatedState[filterIndex - 1] && updatedState[filterIndex - 1].selected) || null);

			return updatedState;
		});
	}

	useEffect(() => {
		if (categories.length) {
			const topParents = categories.filter(item => !item.parent_id);
			const topParentCategoriesLabel = topParents[0].type_text;
			const topParentKey = `-${topParents[0].type_value}`;
			setCategoryFilters([
				{
					label: topParentCategoriesLabel,
					key: topParentKey,
					categories: topParents,
					selected: null
				}
			]);
		}
	}, [categories]);

	return (
		<div className="flex items-center flex-1 flex-col">
			<FuseAnimate animation="transition.slideUpIn" delay={300}>
				<>
					{categoryFilters.map((categoryFilter, filterIndex) => {
						return (
							<TextField
								key={categoryFilter.key}
								id="account-selection"
								select
								label={categoryFilter.label}
								value={categoryFilter.selected}
								onChange={e => onFilterChange(e, filterIndex)}
								placeholder={categoryFilter}
								margin="normal"
								className="w-full mt-6"
							>
								{filterIndex === 0 && (
									<MenuItem value="">
										<em>All</em>
									</MenuItem>
								)}
								{categoryFilter.categories.map(category => (
									<MenuItem key={`-${category.id}`} value={category.id}>
										{category.title}
									</MenuItem>
								))}
							</TextField>
						);
					})}
				</>
			</FuseAnimate>
		</div>
	);
}

export default memo(ExamsSidebarCategories);
