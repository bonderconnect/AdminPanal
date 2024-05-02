import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectWidgets } from './store/widgetsSlice';
import WidgetNow from './widgets/WidgetNow';

function DashboardAppSidebar() {
	// const widgets = useSelector(selectWidgets);

	const container = {
		hidden: { opacity: 1 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	return null;
}

export default DashboardAppSidebar;
