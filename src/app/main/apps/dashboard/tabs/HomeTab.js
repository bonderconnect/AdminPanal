import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
// import { selectWidgets } from '../store/widgetsSlice';
import Widget1 from '../widgets/Widget1';
import Widget2 from '../widgets/Widget2';
import Widget3 from '../widgets/Widget3';
import Widget4 from '../widgets/Widget4';
// import Widget5 from '../widgets/Widget5';
// import Widget6 from '../widgets/Widget6';
// import Widget7 from '../widgets/Widget7';

function HomeTab() {
	// const widgets = useSelector(selectWidgets);

	const container = {
		show: {
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	const widgets = {
		widget1: {
			id: 'widget1',
			ranges: {
				DY: 'Yesterday',
				DT: 'Today',
				DTM: 'Tomorrow'
			},
			currentRange: 'DT',
			data: {
				name: 'Due Tasks',
				count: {
					DY: 21,
					DT: 25,
					DTM: 19
				},
				extra: {
					name: 'Completed',
					count: {
						DY: 6,
						DT: 7,
						DTM: '-'
					}
				}
			},
			detail: 'You can show some detailed information about this widget in here.'
		},
		widget2: {
			id: 'widget2',
			title: 'Overdue',
			data: {
				name: 'Tasks',
				count: 4,
				extra: {
					name: `Yesterday's overdue`,
					count: 2
				}
			},
			detail: 'You can show some detailed information about this widget in here.'
		},
		widget3: {
			id: 'widget3',
			title: 'Issues',
			data: {
				name: 'Open',
				count: 32,
				extra: {
					name: 'Closed today',
					count: 0
				}
			},
			detail: 'You can show some detailed information about this widget in here.'
		},
		widget4: {
			id: 'widget4',
			title: 'Features',
			data: {
				name: 'Proposals',
				count: 42,
				extra: {
					name: 'Implemented',
					count: 8
				}
			},
			detail: 'You can show some detailed information about this widget in here.'
		}
	};

	return (
		<motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">
			<motion.div variants={item} className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
				<Widget1 widget={widgets.widget1} />
			</motion.div>
			<motion.div variants={item} className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
				<Widget2 widget={widgets.widget2} />
			</motion.div>
			<motion.div variants={item} className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
				<Widget3 widget={widgets.widget3} />
			</motion.div>
			<motion.div variants={item} className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
				<Widget4 widget={widgets.widget4} />
			</motion.div>
		</motion.div>
	);
}

export default HomeTab;
