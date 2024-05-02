import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectWidgets } from '../store/widgetsSlice';
import Widget11 from '../widgets/Widget11';

function TeamMembersTab() {
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
		widget11: {
			id: 'widget11',
			title: 'Team Members',
			table: {
				columns: [
					{
						id: 'avatar',
						title: ''
					},
					{
						id: 'name',
						title: 'Name'
					},
					{
						id: 'position',
						title: 'Position'
					},
					{
						id: 'office',
						title: 'Office'
					},
					{
						id: 'email',
						title: 'Email'
					},
					{
						id: 'phone',
						title: 'Phone'
					}
				],
				rows: [
					{
						id: 1,
						cells: [
							{
								id: 'avatar',
								value: 'assets/images/avatars/james.jpg'
							},
							{
								id: 'name',
								value: 'Jack Gilbert'
							},
							{
								id: 'position',
								value: 'Design Manager'
							},
							{
								id: 'office',
								value: 'Johor Bahru'
							},
							{
								id: 'email',
								value: 'jgilbert48@mail.com'
							},
							{
								id: 'phone',
								value: '+16 298 032 7774'
							}
						]
					},
					{
						id: 2,
						cells: [
							{
								id: 'avatar',
								value: 'assets/images/avatars/katherine.jpg'
							},
							{
								id: 'name',
								value: 'Kathy Anderson'
							},
							{
								id: 'position',
								value: 'Recruiting Manager'
							},
							{
								id: 'office',
								value: 'Solţānābād'
							},
							{
								id: 'email',
								value: 'kanderson49@mail.com.br'
							},
							{
								id: 'phone',
								value: '+23 572 311 1136'
							}
						]
					},
					{
						id: 3,
						cells: [
							{
								id: 'avatar',
								value: 'assets/images/avatars/garry.jpg'
							},
							{
								id: 'name',
								value: 'Gary Gonzalez'
							},
							{
								id: 'position',
								value: 'Speech Pathologist'
							},
							{
								id: 'office',
								value: 'Gangkou'
							},
							{
								id: 'email',
								value: 'ggonzalez4r@mail.cc'
							},
							{
								id: 'phone',
								value: '+10 862 046 7916'
							}
						]
					},
					{
						id: 4,
						cells: [
							{
								id: 'avatar',
								value: 'assets/images/avatars/andrew.jpg'
							},
							{
								id: 'name',
								value: 'Mark Turner'
							},
							{
								id: 'position',
								value: 'Recruiting Manager'
							},
							{
								id: 'office',
								value: 'Neftegorsk'
							},
							{
								id: 'email',
								value: 'mturner4a@mail.com'
							},
							{
								id: 'phone',
								value: '+01 139 803 9263'
							}
						]
					},
					{
						id: 5,
						cells: [
							{
								id: 'avatar',
								value: 'assets/images/avatars/jane.jpg'
							},
							{
								id: 'name',
								value: 'Kathryn Martinez'
							},
							{
								id: 'position',
								value: 'Director of Sales'
							},
							{
								id: 'office',
								value: 'Palekastro'
							},
							{
								id: 'email',
								value: 'kmartinez4b@mail.com'
							},
							{
								id: 'phone',
								value: '+25 467 022 5393'
							}
						]
					},
					{
						id: 6,
						cells: [
							{
								id: 'avatar',
								value: 'assets/images/avatars/alice.jpg'
							},
							{
								id: 'name',
								value: 'Annie Gonzales'
							},
							{
								id: 'position',
								value: 'Actuary'
							},
							{
								id: 'office',
								value: 'Candon'
							},
							{
								id: 'email',
								value: 'agonzales4c@mail.edu'
							},
							{
								id: 'phone',
								value: '+99 891 619 7138'
							}
						]
					},
					{
						id: 7,
						cells: [
							{
								id: 'avatar',
								value: 'assets/images/avatars/vincent.jpg'
							},
							{
								id: 'name',
								value: 'Howard King'
							},
							{
								id: 'position',
								value: 'Human Resources'
							},
							{
								id: 'office',
								value: 'Bergen op Zoom'
							},
							{
								id: 'email',
								value: 'hking4d@mail.gov'
							},
							{
								id: 'phone',
								value: '+46 984 348 1409'
							}
						]
					},
					{
						id: 8,
						cells: [
							{
								id: 'avatar',
								value: 'assets/images/avatars/joyce.jpg'
							},
							{
								id: 'name',
								value: 'Elizabeth Dixon'
							},
							{
								id: 'position',
								value: 'Electrical Engineer'
							},
							{
								id: 'office',
								value: 'Písečná'
							},
							{
								id: 'email',
								value: 'edixon4e@mail.gov'
							},
							{
								id: 'phone',
								value: '+33 332 067 9063'
							}
						]
					},
					{
						id: 9,
						cells: [
							{
								id: 'avatar',
								value: 'assets/images/avatars/danielle.jpg'
							},
							{
								id: 'name',
								value: 'Dorothy Morris'
							},
							{
								id: 'position',
								value: 'Office Assistant'
							},
							{
								id: 'office',
								value: 'Magsaysay'
							},
							{
								id: 'email',
								value: 'dmorris4f@mail.com'
							},
							{
								id: 'phone',
								value: '+05 490 958 6120'
							}
						]
					},
					{
						id: 10,
						cells: [
							{
								id: 'avatar',
								value: 'assets/images/avatars/carl.jpg'
							},
							{
								id: 'name',
								value: 'Mark Gonzales'
							},
							{
								id: 'position',
								value: 'Quality Control'
							},
							{
								id: 'office',
								value: 'Matsue-shi'
							},
							{
								id: 'email',
								value: 'mgonzales4g@mail.com'
							},
							{
								id: 'phone',
								value: '+03 168 394 9935'
							}
						]
					},
					{
						id: 11,
						cells: [
							{
								id: 'avatar',
								value: 'assets/images/avatars/profile.jpg'
							},
							{
								id: 'name',
								value: 'Catherine Rogers'
							},
							{
								id: 'position',
								value: 'Programmer Analyst'
							},
							{
								id: 'office',
								value: 'Kangar'
							},
							{
								id: 'email',
								value: 'crogers4h@mail.com'
							},
							{
								id: 'phone',
								value: '+86 235 407 5373'
							}
						]
					},
					{
						id: 12,
						cells: [
							{
								id: 'avatar',
								value: 'assets/images/avatars/garry.jpg'
							},
							{
								id: 'name',
								value: 'Ruth Grant'
							},
							{
								id: 'position',
								value: 'Community Outreach'
							},
							{
								id: 'office',
								value: 'Beaune'
							},
							{
								id: 'email',
								value: 'rgrant4i@mail.pl'
							},
							{
								id: 'phone',
								value: '+36 288 083 8460'
							}
						]
					},
					{
						id: 13,
						cells: [
							{
								id: 'avatar',
								value: 'assets/images/avatars/james.jpg'
							},
							{
								id: 'name',
								value: 'Phyllis Gutierrez'
							},
							{
								id: 'position',
								value: 'Administrative Assistant'
							},
							{
								id: 'office',
								value: 'Shlissel’burg'
							},
							{
								id: 'email',
								value: 'pgutierrez4j@mail.net'
							},
							{
								id: 'phone',
								value: '+52 749 861 9304'
							}
						]
					},
					{
						id: 14,
						cells: [
							{
								id: 'avatar',
								value: 'assets/images/avatars/alice.jpg'
							},
							{
								id: 'name',
								value: 'Lillian Morris'
							},
							{
								id: 'position',
								value: 'Media Planner'
							},
							{
								id: 'office',
								value: 'Berlin'
							},
							{
								id: 'email',
								value: 'lmorris4k@mail.de'
							},
							{
								id: 'phone',
								value: '+59 695 110 3856'
							}
						]
					},
					{
						id: 15,
						cells: [
							{
								id: 'avatar',
								value: 'assets/images/avatars/vincent.jpg'
							},
							{
								id: 'name',
								value: 'Jeremy Anderson'
							},
							{
								id: 'position',
								value: 'Systems Engineer'
							},
							{
								id: 'office',
								value: 'Lũng Hồ'
							},
							{
								id: 'email',
								value: 'janderson4l@mail.uk'
							},
							{
								id: 'phone',
								value: '+40 384 115 1448'
							}
						]
					},
					{
						id: 16,
						cells: [
							{
								id: 'avatar',
								value: 'assets/images/avatars/carl.jpg'
							},
							{
								id: 'name',
								value: 'Arthur Lawrence'
							},
							{
								id: 'position',
								value: 'Nurse Practicioner'
							},
							{
								id: 'office',
								value: 'Sarkanjut'
							},
							{
								id: 'email',
								value: 'alawrence4m@mail.com'
							},
							{
								id: 'phone',
								value: '+36 631 599 7867'
							}
						]
					},
					{
						id: 17,
						cells: [
							{
								id: 'avatar',
								value: 'assets/images/avatars/andrew.jpg'
							},
							{
								id: 'name',
								value: 'David Simmons'
							},
							{
								id: 'position',
								value: 'Social Worker'
							},
							{
								id: 'office',
								value: 'Ushumun'
							},
							{
								id: 'email',
								value: 'dsimmons4n@mail.com'
							},
							{
								id: 'phone',
								value: '+01 189 681 4417'
							}
						]
					},
					{
						id: 18,
						cells: [
							{
								id: 'avatar',
								value: 'assets/images/avatars/danielle.jpg'
							},
							{
								id: 'name',
								value: 'Daniel Johnston'
							},
							{
								id: 'position',
								value: 'Help Desk'
							},
							{
								id: 'office',
								value: 'São Carlos'
							},
							{
								id: 'email',
								value: 'djohnston4o@mail.gov'
							},
							{
								id: 'phone',
								value: '+60 028 943 7919'
							}
						]
					},
					{
						id: 19,
						cells: [
							{
								id: 'avatar',
								value: 'assets/images/avatars/joyce.jpg'
							},
							{
								id: 'name',
								value: 'Ann King'
							},
							{
								id: 'position',
								value: 'Internal Auditor'
							},
							{
								id: 'office',
								value: 'Liren'
							},
							{
								id: 'email',
								value: 'aking4p@mail.com'
							},
							{
								id: 'phone',
								value: '+91 103 932 6545'
							}
						]
					},
					{
						id: 20,
						cells: [
							{
								id: 'avatar',
								value: 'assets/images/avatars/james.jpg'
							},
							{
								id: 'name',
								value: 'Phillip Franklin'
							},
							{
								id: 'position',
								value: 'VP Accounting'
							},
							{
								id: 'office',
								value: 'Soba'
							},
							{
								id: 'email',
								value: 'pfranklin4q@mail.com'
							},
							{
								id: 'phone',
								value: '+25 820 986 7626'
							}
						]
					}
				]
			}
		}
	};

	return (
		<motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">
			<motion.div variants={item} className="widget flex w-full p-12">
				<Widget11 widget={widgets.widget11} />
			</motion.div>
		</motion.div>
	);
}

export default TeamMembersTab;
