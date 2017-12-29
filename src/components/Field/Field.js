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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Form from 'semantic-ui-react/dist/commonjs/collections/Form';
import SemanticInput from 'semantic-ui-react/dist/commonjs/elements/Input';

import styles from './Field.css';

class Input extends PureComponent {
  render() {
    const { label, value, ...rest } = this.props;
    return (
      <Form.Field>
        <label>{label}</label>
        <SemanticInput
          action={{ icon: 'copy' }}
          value={value || ''} // Controlled component
          {...rest}
        />
      </Form.Field>
    );
  }
}

export default Input;
