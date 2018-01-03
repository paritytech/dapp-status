// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label';
import Popup from 'semantic-ui-react/dist/commonjs/modules/Popup';
import SemanticInput from 'semantic-ui-react/dist/commonjs/elements/Input';
import { FormattedMessage } from 'react-intl';

class Input extends Component {
  static propTypes = {
    action: PropTypes.object,
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    onSubmit: PropTypes.func,
    readOnly: PropTypes.bool,
    showCopyButton: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.number
  };

  state = {
    isCopied: false,
    isLoading: false,
    isSaved: false,
    value: null
  };

  componentWillReceiveProps({ value }) {
    // Reset field when new value comes
    if (this.props.value !== value) {
      this.setState({ value: null });
    }
  }

  handleChange = (_, { value }) => this.setState({ value });

  handleCopy = () => {
    // https://stackoverflow.com/questions/39501289/in-reactjs-how-to-copy-text-to-clipboard
    var tmp = document.createElement('textarea');
    tmp.innerText = this.props.value;
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    tmp.remove();
    this.setState({ isCopied: true });
    setTimeout(() => this.setState({ isCopied: false }), 2000);
  };

  handleKeyPress = event => {
    // Submit on enter
    if (event.keyCode || event.charCode === 13) {
      this.handleSubmit();
    }
  };

  handleSubmit = () => {
    if (!this.state.value || this.state.value === this.props.value) {
      this.setState({ value: null });
      return;
    }

    this.setState({ isLoading: true });
    this.props
      .onSubmit(this.state.value)
      .then(() => this.setState({ isLoading: false, isSaved: true }))
      .then(() => new Promise(resolve => setTimeout(resolve, 2000)))
      .then(() => this.setState({ isSaved: false }))
      .catch(() => this.setState({ isLoading: false }));
  };

  renderInput = () => {
    const {
      action,
      error,
      label,
      readOnly,
      showCopyButton,
      value,
      ...rest
    } = this.props;
    return (
      <SemanticInput
        action={
          action ||
          (showCopyButton && {
            icon: 'copy',
            onClick: this.handleCopy
          })
        }
        loading={this.state.isLoading}
        icon={this.state.isSaved ? { name: 'check', color: 'green' } : true}
        onKeyPress={this.handleKeyPress}
        onBlur={this.handleSubmit}
        onChange={this.handleChange}
        readOnly={readOnly || this.state.isLoading} // Don't allow changing when loading
        value={this.state.value === null ? value || '' : this.state.value} // Controlled component
        {...rest}
      />
    );
  };

  render() {
    const { error, label, showCopyButton, width } = this.props;
    return (
      <Form.Field width={width}>
        <label>{label}</label>
        {showCopyButton ? (
          <Popup
            content={
              <FormattedMessage
                id="dapp.status.field.copied"
                defaultMessage="Copied"
              />
            }
            inverted
            open={this.state.isCopied}
            position="top center"
            size="mini"
            trigger={this.renderInput()}
          />
        ) : (
          this.renderInput()
        )}
        {error && (
          <Label basic color="red" pointing>
            {error}
          </Label>
        )}
      </Form.Field>
    );
  }
}

export default Input;
