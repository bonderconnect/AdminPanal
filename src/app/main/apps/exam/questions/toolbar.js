import React from 'react';
import Typography from '@material-ui/core/Typography';

const Toolbar = props => {
	const { exam } = props;
	return (
		<div className="w-full px-24 pb-8 flex flex-col md:flex-row flex-1 items-center">
			<div className="flex flex-col md:flex-row flex-1 items-center justify-between p-8">
				<Typography
					className="md:px-16 text-24 md:text-32 font-semibold tracking-tight"
					variant="h4"
					color="inherit"
				>
					{exam.title}
				</Typography>
			</div>
		</div>
	);
};
export default Toolbar;
