'use strict';

var React = require('react');
var className = require('classnames');
var debounce = require('lodash.debounce');

var CodeMirror = React.createClass({
	displayName: 'CodeMirror',

	propTypes: {
        onKeyUp: React.PropTypes.func,
		onChange: React.PropTypes.func,
		onFocusChange: React.PropTypes.func,
		options: React.PropTypes.object,
		path: React.PropTypes.string,
		value: React.PropTypes.string,
		className: React.PropTypes.any,
		codeMirrorInstance: React.PropTypes.object
	},
	getCodeMirrorInstance: function getCodeMirrorInstance() {
		return this.props.codeMirrorInstance || require('codemirror');
	},
	getInitialState: function getInitialState() {
		return {
			isFocused: false
		};
	},
	componentDidMount: function componentDidMount() {
		var textareaNode = this.refs.textarea;
		var codeMirrorInstance = this.getCodeMirrorInstance();
		this.codeMirror = codeMirrorInstance.fromTextArea(textareaNode, this.props.options);
		this.codeMirror.on('change', this.codemirrorValueChanged);
		this.codeMirror.on('focus', this.focusChanged.bind(this, true));
		this.codeMirror.on('blur', this.focusChanged.bind(this, false));
        // add keyup events
        this.codeMirror.on('keyup', this.keyUp.bind(this, true));

		this.codeMirror.setValue(this.props.defaultValue || this.props.value || '');
	},
	componentWillUnmount: function componentWillUnmount() {
		// is there a lighter-weight way to remove the cm instance?
		if (this.codeMirror) {
			this.codeMirror.toTextArea();
		}
	},
	componentWillReceiveProps: debounce(function (nextProps) {
		if (this.codeMirror && nextProps.value !== undefined && this.codeMirror.getValue() != nextProps.value) {
			this.codeMirror.setValue(nextProps.value);
		}
		if (typeof nextProps.options === 'object') {
			for (var optionName in nextProps.options) {
				if (nextProps.options.hasOwnProperty(optionName)) {
					this.codeMirror.setOption(optionName, nextProps.options[optionName]);
				}
			}
		}
	}, 0),
	getCodeMirror: function getCodeMirror() {
		return this.codeMirror;
	},
    keyUp: function (state, codeMirror, keyEvent) {
        let key = keyEvent.keyCode;
        switch(key)
     　 {
   　 　 //屏蔽了退格、制表、回车、空格、方向键、删除键
   　 　 case 8: case 9:case 13:case 32:case 37:case 38:case 39:case 40:case 46:break;
   　 　 default:
            this.props.onKeyUp();
            break;
     　 }

    },
	focus: function focus() {
		if (this.codeMirror) {
			this.codeMirror.focus();
		}
	},
	focusChanged: function focusChanged(focused) {
		this.setState({
			isFocused: focused
		});
		this.props.onFocusChange && this.props.onFocusChange(focused);
	},
	codemirrorValueChanged: function codemirrorValueChanged(doc, change) {
		if (this.props.onChange && change.origin != 'setValue') {
			this.props.onChange(doc.getValue());
		}
	},
	render: function render() {
		var editorClassName = className('ReactCodeMirror', this.state.isFocused ? 'ReactCodeMirror--focused' : null, this.props.className);
		return React.createElement(
			'div',
			{ className: editorClassName },
			React.createElement('textarea', { ref: 'textarea', name: this.props.path, defaultValue: this.props.value, autoComplete: 'off' })
		);
	}
});

module.exports = CodeMirror;
