import FuseAnimate from '@fuse/core/FuseAnimate';
import Icon from '@material-ui/core/Icon';
import update from 'immutability-helper';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import React, { useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { selectCategories } from '../../store/recordings/categorySlice';

function CategorySelect(props) {
	const { categorySelectionRef, defaultCategoryId } = props;

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

			categorySelectionRef.current =
				itemValue || (updatedState[filterIndex - 1] && updatedState[filterIndex - 1].selected) || null;

			return updatedState;
		});
	}

	// React.useEffect(() => {
	// 	if (categories.length) {
	// 		const topParents = categories.filter(item => !item.parent_id);
	// 		const topParentCategoriesLabel = topParents[0].type_text;
	// 		const topParentKey = `-${topParents[0].type_value}`;
	// 		setCategoryFilters([
	// 			{
	// 				label: topParentCategoriesLabel,
	// 				key: topParentKey,
	// 				categories: topParents,
	// 				selected: null
	// 			}
	// 		]);
	// 	}
	// }, [categories]);

	React.useEffect(() => {
		if (categories.length) {
			if (defaultCategoryId) {
				let parentCategoryId = defaultCategoryId;
				setCategoryFilters([]);
				while (parentCategoryId) {
					// eslint-disable-next-line no-loop-func
					const parentCategory = categories.filter(item => item.id === parentCategoryId)[0];

					const parentCategorySiblings = categories.filter(
						item => item.type_value === parentCategory.type_value
					);
					const topParentCategoriesLabel = parentCategory.type_text;
					const topParentKey = `-${parentCategory.type_value}`;
					setCategoryFilters(state => {
						let updatedState = [...state];
						updatedState = [
							{
								label: topParentCategoriesLabel,
								key: topParentKey,
								categories: [...parentCategorySiblings],
								selected: parentCategory.id
							},
							...updatedState
						];

						return updatedState;
					});
					parentCategoryId = parentCategory.parent_id;
				}
			} else {
				setCategoryFilters([]);
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
		}
	}, [defaultCategoryId, categories]);

	return (
		<>
			<div className="min-w-48 pt-20">
				<Icon color="action">category</Icon>
			</div>

			<div className="flex flex-1 mb-24 flex-col">
				{categoryFilters.map((categoryFilter, filterIndex) => {
					return (
						<TextField
							key={categoryFilter.key}
							variant="outlined"
							select
							label={categoryFilter.label}
							value={categoryFilter.selected || ''}
							onChange={e => onFilterChange(e, filterIndex)}
							placeholder={categoryFilter}
							margin="normal"
							className={clsx(' w-full my-0', filterIndex && 'mt-24')}
						>
							<MenuItem value="">
								<em>- None -</em>
							</MenuItem>
							{categoryFilter.categories.map(category => (
								<MenuItem key={`-${category.id}`} value={category.id}>
									{category.title}
								</MenuItem>
							))}
						</TextField>
					);
				})}
			</div>
		</>
	);
}

export default memo(CategorySelect);
