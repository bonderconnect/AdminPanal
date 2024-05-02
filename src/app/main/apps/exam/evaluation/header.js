import React from 'react';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router';

const Header = props => {
	const { learningMaterialId } = props;
	const history = useHistory();
	const handleShowAllAttempts = () => {
		setTimeout(() => {
			history.push(`/apps/material/exam/${learningMaterialId}/attempts`);
		}, 0);
	};

	return (
		<div className="w-full px-24 items-start mx-auto flex">
			<Button
				onClick={handleShowAllAttempts}
				color="primary"
				variant="outlined"
				size="small"
				className="mt-24"
				startIcon={<Icon>arrow_back</Icon>}
			>
				Show all attempts
			</Button>
		</div>
	);
};
export default Header;
