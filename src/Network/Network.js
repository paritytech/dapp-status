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
import Statistic from 'semantic-ui-react/dist/commonjs/views/Statistic';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import formatNumber from 'format-number';

import Field from '../components/Field';
import Section from '../components/Section';
import styles from './Network.css';

const toNiceNumber = formatNumber();

class Network extends Component {
  static propTypes = {
    intl: intlShape
  };

  render() {
    const {
      chainStore: { chain },
      enodeStore: { enode },
      netPeersStore: { netPeers },
      netPortStore: { netPort },
      rpcSettingsStore: { rpcSettings },
      intl: { formatMessage }
    } = this.props;

    return (
      <Section
        title={
          <FormattedMessage
            id="dapp.status.network.title"
            defaultMessage="Network Settings"
          />
        }
      >
        <Form>
          <Field
            label={
              <FormattedMessage
                id="dapp.status.network.chainLabel"
                defaultMessage="Chain"
              />
            }
            readOnly
            value={chain}
          />
          <Form.Group widths={2}>
            <Field
              label={
                <FormattedMessage
                  id="dapp.status.network.rpcEnabled"
                  defaultMessage="RPC Enabled"
                />
              }
              readOnly
              value={
                rpcSettings && rpcSettings.enabled
                  ? formatMessage(messages.rpcEnabledYes)
                  : formatMessage(messages.rpcEnabledNo)
              }
            />
            <Field
              label={
                <FormattedMessage
                  id="dapp.status.network.netPort"
                  defaultMessage="Network Port"
                />
              }
              readOnly
              value={netPort}
            />
          </Form.Group>
          <Form.Group widths={2}>
            <Field
              label={
                <FormattedMessage
                  id="dapp.status.network.rpcInterface"
                  defaultMessage="RPC Interface"
                />
              }
              readOnly
              value={rpcSettings && rpcSettings.interface}
            />
            <Field
              label={
                <FormattedMessage
                  id="dapp.status.network.rpcPort"
                  defaultMessage="RPC Port"
                />
              }
              readOnly
              value={rpcSettings && rpcSettings.port}
            />
          </Form.Group>
          <Field
            label={
              <FormattedMessage
                id="dapp.status.network.enode"
                defaultMessage="Enode"
              />
            }
            readOnly
            showCopyButton
            value={enode}
          />
        </Form>
        <Statistic.Group
          size="tiny"
          widths={1}
          className={styles.smallStatistic}
        >
          <Statistic>
            <Statistic.Value>{`${toNiceNumber(netPeers.active) ||
              0}/${toNiceNumber(netPeers.connected) || 0}/${toNiceNumber(
              netPeers.max
            ) || 0}`}</Statistic.Value>
            <Statistic.Label className={styles.lowerCaseLabel}>
              <FormattedMessage
                id="dapp.status.mining.netPeersLabel"
                defaultMessage="Active/Connected/Max Peers"
              />
            </Statistic.Label>
          </Statistic>
        </Statistic.Group>
      </Section>
    );
  }
}

export default injectIntl(
  inject(
    'chainStore',
    'enodeStore',
    'netPeersStore',
    'netPortStore',
    'rpcSettingsStore'
  )(observer(Network))
);

const messages = {
  rpcEnabledYes: {
    id: 'dapp.status.network.rpcEnabledYes',
    defaultMessage: 'Yes'
  },
  rpcEnabledNo: {
    id: 'dapp.status.network.rpcEnabledNo',
    defaultMessage: 'No'
  }
};
