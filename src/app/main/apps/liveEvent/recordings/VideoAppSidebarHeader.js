import FuseAnimate from '@fuse/core/FuseAnimate';
import Icon from '@material-ui/core/Icon';
import update from 'immutability-helper';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCategories } from '../store/recordings/categorySlice';

function VideoAppSidebarHeader(props) {
	const dispatch = useDispatch();
	const categories = useSelector(selectCategories);
	const [categoryFilters, setCategoryFilters] = useState([]);
	const [selectedAccount, setSelectedCount] = useState('creapond');

	function handleAccountChange(ev) {
		setSelectedCount(ev.target.value);
	}

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

			// setCategory(itemValue || (updatedState[filterIndex - 1] && updatedState[filterIndex - 1].selected) || null);

			return updatedState;
		});
	}

	React.useEffect(() => {
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
		<div className="flex flex-col justify-center h-full p-24">
			<div className="flex items-center flex-1">
				<FuseAnimate animation="transition.expandIn" delay={300}>
					<Icon className="text-32">videocam</Icon>
				</FuseAnimate>
				<FuseAnimate animation="transition.slideLeftIn" delay={300}>
					<span className="text-24 mx-16">Recordings</span>
				</FuseAnimate>
			</div>
		</div>
	);
}

export default VideoAppSidebarHeader;
