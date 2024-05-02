import React from 'react';
import { motion } from 'framer-motion';
// import { useSelector } from 'react-redux';
// import { selectWidgets } from '../store/widgetsSlice';
import Widget10 from '../widgets/Widget10';
// import Widget8 from '../widgets/Widget8';
// import Widget9 from '../widgets/Widget9';

function BudgetSummaryTab() {
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
		widget10: {
			id: 'widget10',
			title: 'Budget Details',
			table: {
				columns: [
					{
						id: 'budget_type',
						title: 'Budget Type'
					},
					{
						id: 'total_budget',
						title: 'Total Budget'
					},
					{
						id: 'spent_usd',
						title: 'Spent ($)'
					},
					{
						id: 'spent_perc',
						title: 'Spent (%)'
					},
					{
						id: 'remaining_usd',
						title: 'Remaining ($)'
					},
					{
						id: 'remaining_perc',
						title: 'Remaining (%)'
					}
				],
				rows: [
					{
						id: 1,
						cells: [
							{
								id: 'budget_type',
								value: 'Wireframing',
								classes: 'bg-blue text-white',
								icon: ''
							},
							{
								id: 'total_budget',
								value: '$14,880.00',
								classes: 'font-semibold',
								icon: ''
							},
							{
								id: 'spent_usd',
								value: '$14,000.00',
								classes: '',
								icon: ''
							},
							{
								id: 'spent_perc',
								value: '%94.08',
								classes: 'text-green',
								icon: 'trending_up'
							},
							{
								id: 'remaining_usd',
								value: '$880.00',
								classes: '',
								icon: ''
							},
							{
								id: 'remaining_perc',
								value: '%5.92',
								classes: '',
								icon: ''
							}
						]
					},
					{
						id: 2,
						cells: [
							{
								id: 'budget_type',
								value: 'Design',
								classes: 'bg-green text-white',
								icon: ''
							},
							{
								id: 'total_budget',
								value: '$21,080.00',
								classes: 'font-semibold',
								icon: ''
							},
							{
								id: 'spent_usd',
								value: '$17,240.34',
								classes: '',
								icon: ''
							},
							{
								id: 'spent_perc',
								value: '%81.78',
								classes: 'text-green',
								icon: 'trending_up'
							},
							{
								id: 'remaining_usd',
								value: '$3,839.66',
								classes: '',
								icon: ''
							},
							{
								id: 'remaining_perc',
								value: '%18.22',
								classes: '',
								icon: ''
							}
						]
					},
					{
						id: 3,
						cells: [
							{
								id: 'budget_type',
								value: 'Coding',
								classes: 'bg-red text-white',
								icon: ''
							},
							{
								id: 'total_budget',
								value: '$34,720.00',
								classes: 'font-semibold',
								icon: ''
							},
							{
								id: 'spent_usd',
								value: '$3,518.00',
								classes: '',
								icon: ''
							},
							{
								id: 'spent_perc',
								value: '%10.13',
								classes: 'text-red',
								icon: 'trending_down'
							},
							{
								id: 'remaining_usd',
								value: '$31,202.00',
								classes: '',
								icon: ''
							},
							{
								id: 'remaining_perc',
								value: '%89.87',
								classes: '',
								icon: ''
							}
						]
					},
					{
						id: 4,
						cells: [
							{
								id: 'budget_type',
								value: 'Marketing',
								classes: 'bg-pink text-white',
								icon: ''
							},
							{
								id: 'total_budget',
								value: '$34,720.00',
								classes: 'font-semibold',
								icon: ''
							},
							{
								id: 'spent_usd',
								value: '$0.00',
								classes: '',
								icon: ''
							},
							{
								id: 'spent_perc',
								value: '%0.00',
								classes: 'text-blue',
								icon: 'trending_flat'
							},
							{
								id: 'remaining_usd',
								value: '$34,720.00',
								classes: '',
								icon: ''
							},
							{
								id: 'remaining_perc',
								value: '%100.00',
								classes: '',
								icon: ''
							}
						]
					},
					{
						id: 5,
						cells: [
							{
								id: 'budget_type',
								value: 'Extra',
								classes: 'bg-orange text-white',
								icon: ''
							},
							{
								id: 'total_budget',
								value: '$18,600.00',
								classes: 'font-semibold',
								icon: ''
							},
							{
								id: 'spent_usd',
								value: '$0.00',
								classes: '',
								icon: ''
							},
							{
								id: 'spent_perc',
								value: '%0.00',
								classes: 'text-blue',
								icon: 'trending_flat'
							},
							{
								id: 'remaining_usd',
								value: '$34,720.00',
								classes: '',
								icon: ''
							},
							{
								id: 'remaining_perc',
								value: '%100.00',
								classes: '',
								icon: ''
							}
						]
					}
				]
			}
		}
	};

	return (
		<motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">
			{/* <motion.div variants={item} className="widget flex w-full sm:w-1/2 p-12">
				<Widget8 widget={widgets.widget8} />
			</motion.div>
			<motion.div variants={item} className="widget flex w-full sm:w-1/2 p-12">
				<Widget9 widget={widgets.widget9} />
			</motion.div> */}
			<motion.div variants={item} className="widget flex w-full p-12">
				<Widget10 widget={widgets.widget10} />
			</motion.div>
		</motion.div>
	);
}

export default BudgetSummaryTab;
