import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckboxFormsy } from '@fuse/core/formsy';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Link from '@material-ui/core/Link';
import {
	openUserRestrictionDialog,
	userRestrictionDialogChangeType,
	userRestrictionDialogSetActiveTab,
	userRestrictionDialogSetActiveStep,
	userRestrictionDialogHandleOk,
	userRestrictionDialogHandleCancel
} from '../../store/videoDialogueSlice';
import TabAddUsers from './tabAddUsers';
import TabViewUsers from './tabViewUsers';

const UserRestriction = props => {
	const dispatch = useDispatch();
	const { form, onChange } = props;

	// User restriction dialogue
	const { userRestrictionDialogue } = useSelector(({ videoApp }) => videoApp.videoDialogue);
	const {
		addUsersList,
		activeTabIndex,
		previousSelectionUserIds,
		unsavedSelectionUserIds,
		type
	} = userRestrictionDialogue;
	const { selectionUserIds, activeStepIndex } = addUsersList;

	const handleChangeUserRestrcitionType = event => dispatch(userRestrictionDialogChangeType(event.target.value));

	const handleCancel = () => dispatch(userRestrictionDialogHandleCancel());
	const handleOk = () => dispatch(userRestrictionDialogHandleOk());

	const handleAddUserView = () => {
		dispatch(openUserRestrictionDialog());
		dispatch(userRestrictionDialogSetActiveTab(1));
	};

	const handleSelectedUserView = e => {
		e.preventDefault();
		dispatch(openUserRestrictionDialog());
		dispatch(userRestrictionDialogSetActiveTab(0));
	};

	return (
		<>
			<div className="flex flex-col">
				<div>
					<CheckboxFormsy
						className="mb-12 mt-10"
						name="user_restriction"
						label="User Restriction"
						value={form.user_restriction}
						onChange={onChange}
					/>
				</div>
				{form.user_restriction && (
					<>
						<div className="flex flex-col">
							<FormControl component="fieldset">
								<FormLabel component="legend">Restriction type</FormLabel>
								<RadioGroup
									aria-label="gender"
									className="flex flex-row"
									name="user_restriction_type_value"
									value={type}
									onChange={handleChangeUserRestrcitionType}
								>
									<FormControlLabel value="whitelist" control={<Radio />} label="Whitelist" />
									<FormControlLabel value="blacklist" control={<Radio />} label="Blacklist" />
								</RadioGroup>
							</FormControl>
							<div className="flex mt-12 flex-col">
								<div className="flex-1 flex">
									{previousSelectionUserIds.length || unsavedSelectionUserIds.length ? (
										<em className="flex flex-col flex-1 items-start">
											{[
												previousSelectionUserIds.length ? (
													<span className="my-2">
														{previousSelectionUserIds.length} users selected
													</span>
												) : null,
												unsavedSelectionUserIds.length ? (
													<span className="my-2">
														{unsavedSelectionUserIds.length} new users selected (unsaved)
													</span>
												) : null,
												// eslint-disable-next-line jsx-a11y/anchor-is-valid
												<Link
													component="button"
													variant="body2"
													className="underline mt-4"
													onClick={handleSelectedUserView}
												>
													View users
												</Link>
											].map(element => element)}
										</em>
									) : (
										<em className="text-grey">- No users selected -</em>
									)}
								</div>
								<Button
									onClick={handleAddUserView}
									variant="contained"
									startIcon={<AddIcon />}
									size="small"
									className="self-start my-20"
								>
									Add Users
								</Button>
							</div>
						</div>
						<Dialog
							aria-labelledby="confirmation-dialog-title"
							open={userRestrictionDialogue.open}
							fullWidth
							maxWidth="xs"
						>
							<DialogTitle className="p-0" id="user-restriction-dialogue">
								<Paper square>
									<Tabs
										value={activeTabIndex}
										indicatorColor="primary"
										textColor="primary"
										// onChange={ev => console.log(ev)}
										aria-label="disabled tabs example"
										centered
									>
										<Tab className="py-16" label="View / Remove Users" />
										<Tab className="py-16" label="Search &amp; Add Users" />
									</Tabs>
								</Paper>
							</DialogTitle>
							<DialogContent dividers>
								{activeTabIndex === 0 ? <TabViewUsers /> : <TabAddUsers />}
							</DialogContent>
							<DialogActions>
								<Button autoFocus onClick={handleCancel} color="primary">
									{activeTabIndex === 0 ? 'Close' : 'Cancel'}
								</Button>
								{(activeTabIndex !== 0 && activeStepIndex === 0 && (
									<Button
										disabled={!selectionUserIds.length}
										onClick={() => dispatch(userRestrictionDialogSetActiveStep(1))}
										color="primary"
									>
										Next
									</Button>
								)) ||
									null}

								{(activeTabIndex === 1 && activeStepIndex !== 0 && (
									<>
										<Button
											onClick={() => dispatch(userRestrictionDialogSetActiveStep(0))}
											color="primary"
											className="ml-6"
										>
											Back
										</Button>
										<Button onClick={handleOk} color="primary">
											Ok
										</Button>
									</>
								)) ||
									null}
							</DialogActions>
						</Dialog>
					</>
				)}
			</div>
		</>
	);
};

export default UserRestriction;
