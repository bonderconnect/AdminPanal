import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import { showMessage } from 'app/store/fuse/messageSlice';
import { DialogActions, DialogContent, DialogTitle } from '@fuse/core/Dialog';
import ChipSelect from '@fuse/core/miscellaneous/ChipSelect';
import FacultySelect from '@fuse/core/miscellaneous/FacultySelect';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { DateTimePicker } from '@material-ui/pickers';
import { Controller, useForm } from 'react-hook-form';
import { closeDialog, createLiveEvent, deleteLiveEvent, updateLiveEvent } from './store/liveEventDialog';
import { openNewLiveEventGoLiveDialog, openEditLiveEventGoLiveDialog } from './store/liveEventGoLiveDialog';
import { getSchedules } from './store/schedule/calendar';

function LiveEventDialog(props) {
	const dispatch = useDispatch();
	const {
		open,
		type,
		form,
		submitting,
		loading,
		deleting,
		data,
		// Server / request errors
		errors: storeErrors
	} = useSelector(({ liveEventApp }) => liveEventApp.liveEventDialog);
	const handleClose = () => dispatch(closeDialog());
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
		control,
		getValues,
		reset
	} = useForm();

	const validateStartTime = startTime => {
		const endTime = getValues('end_time');
		if (!startTime) {
			return 'Start time seems not be valid';
		}
		if (endTime && new Date(endTime).getTime() < new Date(startTime).getTime()) {
			return 'Start time should not pass end time';
		}
		if (new Date(startTime).getTime() < new Date().getTime()) {
			return 'Start time should be after the current time';
		}
		return true;
	};

	const validateEndTime = endTime => {
		const startTime = getValues('start_time');
		console.log('end time:', endTime);
		if (!endTime) {
			return 'End time seems not be valid';
		}
		if (startTime && new Date(startTime).getTime() > new Date(endTime).getTime()) {
			return 'End time should be after the start time';
		}
		return true;
	};

	const callback = () => {
		if (type === 'new') {
			dispatch(showMessage({ message: 'Event created successfully' }));
		} else {
			dispatch(showMessage({ message: 'Event updated successfully' }));
		}
		dispatch(getSchedules());
	};

	const onSubmit = (formData, e) => {
		if (type === 'new') {
			dispatch(createLiveEvent({ form: formData, callback }));
		} else {
			dispatch(updateLiveEvent({ form: formData, callback }));
		}
	};

	const handleGoLive = () => {
		dispatch(closeDialog());
		dispatch(openNewLiveEventGoLiveDialog(data.liveEventId));
	};

	const handleUpdateLive = () => {
		dispatch(closeDialog());
		dispatch(openEditLiveEventGoLiveDialog(data.liveEventId));
	};

	const deleteCallback = () => {
		dispatch(showMessage({ message: 'Event deleted' }));
		dispatch(closeDialog());
		dispatch(getSchedules());
	};

	const handleDeleteLive = () => {
		dispatch(deleteLiveEvent({ eventId: data.liveEventId, callback: deleteCallback }));
	};

	useEffect(() => {
		if (open) {
			reset();
		}
	}, [open]);

	useEffect(() => {
		if (storeErrors) {
			Object.keys(storeErrors).forEach(errorField => {
				setError(errorField, {
					type: 'manual',
					message: storeErrors[errorField].message
				});
			});
		}
	}, [storeErrors]);

	return (
		<Dialog fullWidth maxWidth="xs" aria-labelledby="new-student-dialog-title" open={open} onClose={handleClose}>
			<DialogTitle id="new-live-event-dialog-title" onClose={handleClose}>
				{type === 'new' ? 'New' : 'Edit'} Live Event
			</DialogTitle>
			{loading ? (
				<DialogContent classes={{ root: 'p-24' }} dividers>
					<div className="flex">
						<Typography variant="subtitle1">Please wait ...</Typography>
						<CircularProgress className="ml-16" size={26} color="inherit" />
					</div>
				</DialogContent>
			) : null}
			{!loading ? (
				<form onSubmit={handleSubmit(onSubmit)} noValidate>
					<DialogContent classes={{ root: 'p-24' }} dividers>
						<div className="flex">
							<div className="min-w-48 pt-20">
								<Icon color="action">title</Icon>
							</div>
							<TextField
								{...register('title', {
									value: form.title,
									required: 'This field is required',
									maxLength: {
										value: 128,
										message: 'Maximum characters allowed is 128'
									}
								})}
								label="Title *"
								variant="outlined"
								fullWidth
								className="mb-24"
								type="text"
								name="title"
								error={!!errors.title}
								helperText={errors.title && errors.title.message}
							/>
						</div>
						<div className="flex">
							<div className="min-w-48 pt-20">
								<Icon color="action">description</Icon>
							</div>
							<TextField
								{...register('description', {
									value: form.description,
									maxLength: {
										value: 1200,
										message: 'Maximum characters allowed is 1200'
									}
								})}
								multiline
								rows={4}
								label="Description"
								variant="outlined"
								fullWidth
								className="mb-24"
								type="text"
								name="description"
								error={!!errors.description}
								helperText={errors.description && errors.description.message}
							/>
						</div>
						<div className="flex">
							<div className="min-w-48 pt-20">
								<Icon color="action">schedule</Icon>
							</div>
							<Controller
								name="start_time"
								control={control}
								defaultValue={form.start_time}
								rules={{
									validate: validateStartTime
								}}
								render={({ field }) => (
									<DateTimePicker
										{...field}
										label="Start:  Date &amp; time"
										inputVariant="outlined"
										error={!!errors.start_time}
										helperText={errors.start_time && errors.start_time.message}
										className="mt-8 mb-16 w-full"
										onChange={momentValue => field.onChange(momentValue.toISOString())}
									/>
								)}
							/>
						</div>
						<div className="flex">
							<div className="min-w-48 pt-20">
								<Icon color="action">schedule</Icon>
							</div>
							<Controller
								name="end_time"
								control={control}
								defaultValue={form.end_time}
								rules={{
									validate: validateEndTime
								}}
								render={({ field }) => (
									<DateTimePicker
										{...field}
										label="End:  Date &amp; time"
										inputVariant="outlined"
										error={!!errors.end_time}
										helperText={errors.end_time && errors.end_time.message}
										className="mt-8 mb-16 w-full"
										onChange={momentValue => field.onChange(momentValue.toISOString())}
									/>
								)}
							/>
						</div>

						<div className="flex">
							<div className="min-w-48 pt-20">
								<Icon color="action">local_mall</Icon>
							</div>

							<Controller
								name="faculty_user_id"
								control={control}
								defaultValue={form.faculty_user_id}
								render={({ field }) => <FacultySelect {...field} onChange={field.onChange} />}
							/>
						</div>

						<div className="flex">
							<div className="min-w-48 pt-20">
								<Icon color="action">local_mall</Icon>
							</div>

							<Controller
								name="package_ids"
								control={control}
								defaultValue={form.package_ids || []}
								render={({ field }) => (
									<ChipSelect
										{...field}
										options={
											data && data.packages
												? data.packages.map(item => ({
														label: item.package_title,
														value: item.package_id
												  }))
												: []
										}
										label="Packages"
										className="mb-36"
									/>
								)}
							/>
						</div>
					</DialogContent>
					<DialogActions>
						<div className="flex flex-1 items-center justify-between">
							<div className="flex-1">
								{type === 'edit' ? (
									<div className="flex">
										{/* {!data.isOnLiveValue ? (
											<Button
												type="button"
												variant="contained"
												color="primary"
												onClick={handleGoLive}
												startIcon={<Icon>live_tv</Icon>}
											>
												Go Live
											</Button>
										) : null} */}
										{/* {data.isOnLiveValue ? (
											<div className="flex">
												<Button
													type="button"
													variant="contained"
													color="primary"
													onClick={handleUpdateLive}
													startIcon={<Icon>live_tv</Icon>}
												>
													Update / Go Live
												</Button>
											</div>
										) : null} */}

										<div className="flex">
											<Button
												type="button"
												variant="contained"
												color="primary"
												onClick={handleUpdateLive}
												startIcon={<Icon>live_tv</Icon>}
											>
												Update / {data.isOnLiveValue ? 'Stop' : 'Go'} Live
											</Button>
										</div>
										{deleting ? (
											<Button className="mx-4" type="button" color="primary">
												Please wait ...
												<CircularProgress className="ml-16" size={22} color="inherit" />
											</Button>
										) : null}
										{!deleting ? (
											<Button
												type="button"
												variant="contained"
												className="mx-4"
												color="primary"
												onClick={handleDeleteLive}
												startIcon={<Icon>delete</Icon>}
											>
												Delete
											</Button>
										) : null}
									</div>
								) : null}
							</div>
							{submitting ? (
								<Button autoFocus type="submit" color="primary">
									Please wait ...
									<CircularProgress className="ml-16" size={22} color="inherit" />
								</Button>
							) : null}
							{!submitting ? (
								<Button autoFocus type="submit" color="primary">
									Save
								</Button>
							) : null}
						</div>
					</DialogActions>
				</form>
			) : null}
		</Dialog>
	);
}

export default LiveEventDialog;
