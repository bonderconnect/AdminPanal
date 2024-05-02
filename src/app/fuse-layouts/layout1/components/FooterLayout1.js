import AppBar from '@material-ui/core/AppBar';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectFooterTheme } from 'app/store/fuse/settingsSlice';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
	toolbar: {
		height: '38px',
		minHeight: 'initial'
	}
}));

function FooterLayout1(props) {
	const classes = useStyles();
	const footerTheme = useSelector(selectFooterTheme);

	return (
		<ThemeProvider theme={footerTheme}>
			<AppBar id="fuse-footer" className="relative z-10" color="default">
				<Toolbar className={clsx('px-16 py-0 flex items-center', classes.toolbar)}>
					<Typography>
						{process.env.REACT_APP_PRODUCT_TITLE}- operations app . - Ver {process.env.REACT_APP_VERSION}
					</Typography>
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default React.memo(FooterLayout1);
