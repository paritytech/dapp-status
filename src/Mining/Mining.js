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
import { inject, observer } from 'mobx-react';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Statistic from 'semantic-ui-react/dist/commonjs/views/Statistic';
import { FormattedMessage } from 'react-intl';
import formatNumber from 'format-number';

import decodeExtraData from './decodeExtraData';
import Section from '../Section';
import styles from './Mining.css';

const toNiceNumber = formatNumber();

class Mining extends Component {
  render() {
    console.log(this.props);
    const {
      extraDataStore,
      gasFloorTargetStore,
      minGasPriceStore
    } = this.props;

    return (
      <Section
        title={
          <FormattedMessage
            id="dapp.status.mining.title"
            defaultMessage="Mining &amp; Network Settings"
          />
        }
      >
        <Form>
          <Form.Field>
            <label>
              <FormattedMessage
                id="dapp.status.mining.extraDataLabel"
                defaultMessage="Extra Data"
              />
            </label>
            <Input
              action={{ icon: 'copy' }}
              value={decodeExtraData(extraDataStore.extraData)}
            />
          </Form.Field>
          <Form.Field>
            <label>
              <FormattedMessage
                id="dapp.status.mining.minGasPriceLabel"
                defaultMessage="Minimum Gas Price"
              />
            </label>
            <Input
              action={{ icon: 'copy' }}
              value={toNiceNumber(minGasPriceStore.minGasPrice)}
            />
          </Form.Field>
          <Form.Field>
            <label>
              <FormattedMessage
                id="dapp.status.mining.gasFloorTargetLabel"
                defaultMessage="Gas Floor Target"
              />
            </label>
            <Input
              action={{ icon: 'copy' }}
              value={toNiceNumber(gasFloorTargetStore.gasFloorTarget)}
            />
          </Form.Field>
        </Form>
      </Section>
    );
  }
}

export default inject(
  'extraDataStore',
  'gasFloorTargetStore',
  'minGasPriceStore'
)(observer(Mining));