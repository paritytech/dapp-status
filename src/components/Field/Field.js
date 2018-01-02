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
import SemanticInput from 'semantic-ui-react/dist/commonjs/elements/Input';

import styles from './Field.css';

class Input extends Component {
  static propTypes = {
    showCopyButton: PropTypes.bool
  };

  state = {
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

  handleKeyPress = event => {
    // Submit on enter
    if (event.keyCode || event.charCode === 13) {
      this.handleSubmit();
    }
  };

  handleRef = ref => (this.ref = ref);

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

  render() {
    const {
      action,
      error,
      label,
      onSubmit,
      readOnly,
      showCopyButton,
      value,
      width,
      ...rest
    } = this.props;
    return (
      <Form.Field width={width}>
        {error && (
          <Label basic color="red" pointing="below">
            {error}
          </Label>
        )}
        <label>{label}</label>
        <SemanticInput
          action={action || (showCopyButton && { icon: 'copy' })}
          loading={this.state.isLoading}
          icon={this.state.isSaved ? { name: 'check', color: 'green' } : true}
          onKeyPress={this.handleKeyPress}
          onBlur={this.handleSubmit}
          onChange={this.handleChange}
          readOnly={readOnly}
          ref={this.handleRef}
          value={this.state.value === null ? value || '' : this.state.value} // Controlled component
          {...rest}
        />
      </Form.Field>
    );
  }
}

export default Input;
