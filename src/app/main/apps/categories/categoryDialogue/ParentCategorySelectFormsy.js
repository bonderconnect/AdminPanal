import Icon from '@material-ui/core/Icon';
import update from 'immutability-helper';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { withFormsy } from 'formsy-react';
import helpers from 'app/utils/helpers';

function ParentCategorySelectFormsy(props) {
	const { defaultCategoryId } = props;

	const { categories } = props;
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

			changeValue(itemValue || (updatedState[filterIndex - 1] && updatedState[filterIndex - 1].selected) || null);

			return updatedState;
		});
	}

	useEffect(() => {
		if (categories && categories.length) {
			if (defaultCategoryId) {
				let parentCategoryId = defaultCategoryId;
				setCategoryFilters([]);
				while (parentCategoryId) {
					// eslint-disable-next-line no-loop-func
					const parentCategory = categories.filter(item => item.category_id === parentCategoryId)[0];

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
								selected: parentCategory.category_id
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

	function changeValue(value) {
		props.setValue(value);
		if (props.onChange) {
			const changeEvent = new helpers.CustomEvent('parentCategorySelect', value, props.name);
			props.onChange(changeEvent);
		}
	}

	return (
		<>
			<div className="min-w-48 pt-20">
				<Icon color="action">category</Icon>
			</div>

			<div className="flex flex-1 mb-24 flex-col">
				<Typography className="mb-16 pl-16" variant="caption" display="block" gutterBottom>
					Parent Category
				</Typography>
				{categoryFilters.map((categoryFilter, filterIndex) => {
					return (
						<TextField
							key={categoryFilter.key}
							variant="outlined"
							select
							label={`Parent - ${categoryFilter.label}`}
							value={categoryFilter.selected || ''}
							onChange={e => onFilterChange(e, filterIndex)}
							placeholder={categoryFilter}
							margin="normal"
							className={clsx(' w-full my-0', filterIndex && 'mt-24')}
						>
							{filterIndex === 0 && (
								<MenuItem value="">
									<em>None</em>
								</MenuItem>
							)}
							{categoryFilter.categories.map(category => (
								<MenuItem key={`-${category.id}`} value={category.category_id}>
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

export default React.memo(withFormsy(ParentCategorySelectFormsy));
