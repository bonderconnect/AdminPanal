import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import { DialogActions, DialogContent, DialogTitle } from '@fuse/core/Dialog';
import Dialog from '@material-ui/core/Dialog';
import Radio from '@material-ui/core/Radio';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Controller, useForm } from 'react-hook-form';
import {
	closeDialog,
	submitNewLiveEventGoLive,
	submitEditLiveEventGoLive,
	stopLive,
	goLive
} from './store/liveEventGoLiveDialog';

function LiveEventGoLiveDialog() {
	const dispatch = useDispatch();
	const {
		open,
		form,
		type,
		submitting,
		loading,
		data,
		// Server / request errors
		errors: storeErrors
	} = useSelector(({ liveEventApp }) => liveEventApp.liveEventGoLiveDialog);
	const {
		register,
		handleSubmit,
		setError,
		setValue,
		getValues,
		formState: { errors },
		control,
		reset,
		watch
	} = useForm();

	useEffect(() => {
		if (type === 'new' && open) {
			reset();
		} else if (form && type === 'edit' && open) {
			setValue('live_platform', form.live_platform);
			setValue('zoom_meeting_link', form.zoom_meeting_link || '');
			setValue('youtube_video_link', form.youtube_video_link || '');
		}
	}, [form, type, open]);

	const handleClose = () => {
		dispatch(closeDialog());
	};

	const handleStopLive = () => {
		dispatch(showMessage({ message: 'Live has been stopped' }));
		dispatch(closeDialog());
		dispatch(stopLive(data.liveEventId));
	};

	const handleGoLive = (formData, e) => {
		console.log('formData:', formData, e);
		dispatch(submitEditLiveEventGoLive({ form: formData })).then(() => {
			dispatch(goLive());
		});
		dispatch(
			showMessage({
				message:
					"Processing request for changing the Event status to 'live', notifications will send to all participants on success"
			})
		);
	};

	const callback = () => {
		if (type === 'new') {
			dispatch(showMessage({ message: "You're on live" }));
		} else {
			dispatch(showMessage({ message: 'Your live updated' }));
		}
	};

	const onSubmit = (formData, e) => {
		// if (type === 'new') {
		// 	dispatch(submitNewLiveEventGoLive({ form: formData, callback }));
		// } else {
		// 	dispatch(submitEditLiveEventGoLive({ form: formData, callback }));
		// }
		dispatch(submitEditLiveEventGoLive({ form: formData, callback }));
	};

	return (
		<Dialog
			fullWidth
			maxWidth="xs"
			aria-labelledby="live-event-go-live-dialog-title"
			open={open}
			onClose={handleClose}
		>
			<DialogTitle id="live-event-go-live-dialog-title" onClose={handleClose}>
				Update Live / Go Live
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
							<FormControl component="fieldset">
								<FormLabel className="flex-row" component="legend">
									Live platform
								</FormLabel>
								<Controller
									control={control}
									name="live_platform"
									defaultValue={form.live_platform}
									render={({ field: { onChange, value } }) => (
										<RadioGroup
											className="flex-row"
											value={value}
											onChange={onChange}
											aria-label="live_platform"
										>
											<FormControlLabel value="zoom" control={<Radio />} label="Zoom" />
											<FormControlLabel value="youtube" control={<Radio />} label="Youtube" />
										</RadioGroup>
									)}
								/>
							</FormControl>
						</div>
						{watch('live_platform') === 'zoom' ? (
							<div className="flex mt-16">
								<div className="min-w-48 pt-20">
									<Icon color="action">link</Icon>
								</div>
								<TextField
									{...register('zoom_meeting_link', {
										value: form.zoom_meeting_link,
										required: 'This field is required'
									})}
									label="Zoom meeting link *"
									variant="outlined"
									fullWidth
									className="mb-24"
									type="text"
									error={!!errors.zoom_meeting_link}
									helperText={errors.zoom_meeting_link && errors.zoom_meeting_link.message}
								/>
							</div>
						) : null}
						{watch('live_platform') === 'youtube' ? (
							<div className="flex mt-16">
								<div className="min-w-48 pt-20">
									<Icon color="action">link</Icon>
								</div>
								<TextField
									{...register('youtube_video_link', {
										value: form.youtube_video_link,
										required: 'This field is required'
									})}
									label="Youtube video link *"
									variant="outlined"
									fullWidth
									className="mb-24"
									type="text"
									error={!!errors.youtube_video_link}
									helperText={errors.youtube_video_link && errors.youtube_video_link.message}
								/>
							</div>
						) : null}
					</DialogContent>
					<DialogActions>
						<div className="flex flex-1 items-center justify-between">
							<div className="flex-1">
								<div className="flex">
									{data.isOnLiveValue ? (
										<Button
											type="button"
											variant="contained"
											color="primary"
											onClick={handleStopLive}
											startIcon={<Icon>live_tv</Icon>}
										>
											Stop Live
										</Button>
									) : (
										<Button
											type="button"
											variant="contained"
											color="primary"
											onClick={handleSubmit(handleGoLive)}
											startIcon={<Icon>live_tv</Icon>}
										>
											Go Live
										</Button>
									)}
								</div>
							</div>
							{submitting ? (
								<Button autoFocus type="submit" color="primary">
									Please wait ...
									<CircularProgress className="ml-16" size={22} color="inherit" />
								</Button>
							) : null}
							{!submitting ? (
								<Button autoFocus type="submit" color="primary">
									Update Live
								</Button>
							) : null}
						</div>
					</DialogActions>
				</form>
			) : null}
		</Dialog>
	);
}

export default LiveEventGoLiveDialog;
