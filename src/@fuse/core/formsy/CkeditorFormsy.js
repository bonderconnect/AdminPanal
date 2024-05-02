import _ from '@lodash';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import { withFormsy } from 'formsy-react';
import helpers from 'app/utils/helpers';
import React from 'react';

// ClassicEditor.defaultConfig = {
// 	toolbar: {
// 		items: ['heading', '|', 'bold', 'italic', '|', 'imageUpload']
// 	},
// 	language: 'en'
// };

function CkeditorFormsy(props) {
	const importedProps = _.pick(props, [
		'autoComplete',
		'autoFocus',
		'children',
		'className',
		'defaultValue',
		'disabled',
		'FormHelperTextProps',
		'fullWidth',
		'id',
		'InputLabelProps',
		'inputProps',
		'InputProps',
		'inputRef',
		'label',
		'multiline',
		'name',
		'onBlur',
		'onChange',
		'onFocus',
		'placeholder',
		'required',
		'rows',
		'rowsMax',
		'select',
		'SelectProps',
		'type',
		'variant',
		'editorProps'
	]);

	const { errorMessage } = props;
	const value = props.value || '';

	function changeValue(event, editor) {
		const data = editor.getData();
		props.setValue(data);
		if (props.onChange) {
			const changeEvent = new helpers.CustomEvent('ckeditor', data, props.name);
			// props.onChange();
			props.onChange(changeEvent);
		}
	}

	const imageUploadTools =
		(importedProps.editorProps && importedProps.editorProps.imageUpload && ['|', 'imageUpload']) || [];

	const customConfig = {
		extraPlugins: [MyCustomUploadAdapterPlugin],
		toolbar: {
			items: ['heading', '|', 'bold', 'italic', ...imageUploadTools]
		},
		language: 'en',
		editorProps: importedProps.editorProps
	};

	return (
		<FormControl
			error={Boolean((!props.isPristine && props.showRequired) || errorMessage)}
			className={clsx(props.className, 'flex-1', 'pt-48', 'pb-32')}
		>
			<InputLabel style={{ zIndex: 0 }} className="ml-16" htmlFor="formatted-text-mask-input">
				{props.label}
			</InputLabel>
			<CKEditor editor={ClassicEditor} data={value} config={customConfig} onChange={changeValue} />
			{Boolean(errorMessage) && <FormHelperText>{errorMessage}</FormHelperText>}
		</FormControl>
	);
}

function MyCustomUploadAdapterPlugin(editor) {
	console.log('editor', editor);
	const { editorProps } = editor.config._config;
	editor.plugins.get('FileRepository').createUploadAdapter = loader => {
		return new MyUploadAdapter({ loader, editorProps });
	};
}
class MyUploadAdapter {
	constructor(props) {
		// CKEditor 5's FileLoader instance.
		this.loader = props.loader;
		this.editorProps = props.editorProps;
		// URL where to send files.
		this.url = `${process.env.REACT_APP_API_BASEURL}learning-material/${this.editorProps.learningMaterialId}/exam/image`;
	}

	// Starts the upload process.
	upload() {
		return new Promise((resolve, reject) => {
			this._initRequest();
			this._initListeners(resolve, reject);
			this._sendRequest();
		});
	}

	// Aborts the upload process.
	abort() {
		if (this.xhr) {
			this.xhr.abort();
		}
	}

	// Example implementation using XMLHttpRequest.
	_initRequest() {
		this.xhr = new XMLHttpRequest();
		const { xhr } = this;

		xhr.open('POST', this.url, true);
		xhr.responseType = 'json';
		xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
		// xhr.setRequestHeader('Authorization', getToken());
	}

	// Initializes XMLHttpRequest listeners.
	_initListeners(resolve, reject) {
		const { xhr } = this;
		const { loader } = this;
		const genericErrorText = `Couldn't upload file: ${loader.file.name}.`;

		xhr.addEventListener('error', () => reject(genericErrorText));
		xhr.addEventListener('abort', () => reject());
		// eslint-disable-next-line consistent-return
		xhr.addEventListener('load', () => {
			const { response } = xhr;
			if (!response || response.error) {
				return reject(response && response.error ? response.error.message : genericErrorText);
			}

			// If the upload is successful, resolve the upload promise with an object containing
			// at least the "default" URL, pointing to the image on the server.
			resolve({
				default: response.data && response.data[0] && response.data[0].url
			});
		});

		if (xhr.upload) {
			xhr.upload.addEventListener('progress', evt => {
				if (evt.lengthComputable) {
					loader.uploadTotal = evt.total;
					loader.uploaded = evt.loaded;
				}
			});
		}
	}

	// Prepares the data and sends the request.
	_sendRequest() {
		const data = new FormData();

		this.loader.file.then(result => {
			data.append('file', result);
			this.xhr.send(data);
		});
	}
}

export default React.memo(withFormsy(CkeditorFormsy));
