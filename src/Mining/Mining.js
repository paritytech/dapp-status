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
import IdentityIcon from '@parity/ui/lib/IdentityIcon';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import formatNumber from 'format-number';

import Field from '../components/Field';
import Section from '../components/Section';
import decodeExtraData from './utils/decodeExtraData';
import numberFromString from './utils/numberFromString';
import styles from './Mining.css';

const toNiceNumber = formatNumber();

class Mining extends Component {
  static propTypes = {
    intl: intlShape
  };

  handleCoinbaseChange = (_, { value }) =>
    this.props.coinbaseStore.setAuthor(value);

  handleGasFloorTargetChange = value =>
    this.props.gasFloorTargetStore.saveGasFloorTarget(numberFromString(value));

  handleExtraDataChange = value =>
    this.props.extraDataStore.saveExtraData(value);

  handleMinGasPriceChange = value =>
    this.props.minGasPriceStore.saveMinGasPrice(numberFromString(value));

  render() {
    const {
      accountsStore: { accounts },
      coinbaseStore: { coinbase },
      extraDataStore: { extraData },
      gasFloorTargetStore: { gasFloorTarget },
      hashrateStore: { hashrate },
      latestBlockStore: { latestBlock },
      intl: { formatMessage },
      minGasPriceStore
    } = this.props;

    return (
      <Section
        title={
          <FormattedMessage
            id="dapp.status.mining.title"
            defaultMessage="Mining Settings"
          />
        }
      >
        <Form>
          <Form.Select
            icon={
              coinbase && (
                <IdentityIcon
                  address={coinbase}
                  alt={coinbase}
                  className={styles.coinbaseAvatar}
                />
              )
            }
            label={formatMessage(messages.coinbaseLabel)}
            onChange={this.handleCoinbaseChange}
            options={accounts.map(account => ({
              image: <IdentityIcon address={account} alt={account} />,
              key: account,
              value: account,
              text: account
            }))}
            value={coinbase}
          />
          <Field
            label={
              <FormattedMessage
                id="dapp.status.mining.extraDataLabel"
                defaultMessage="Extra Data"
              />
            }
            onSubmit={this.handleExtraDataChange}
            value={decodeExtraData(extraData)}
          />
          <Field
            label={
              <FormattedMessage
                id="dapp.status.mining.minGasPriceLabel"
                defaultMessage="Minimum Gas Price"
              />
            }
            onSubmit={this.handleMinGasPriceChange}
            value={toNiceNumber(minGasPriceStore.minGasPrice)}
          />
          <Field
            label={
              <FormattedMessage
                id="dapp.status.mining.gasFloorTargetLabel"
                defaultMessage="Gas Floor Target"
              />
            }
            onSubmit={this.handleGasFloorTargetChange}
            value={toNiceNumber(gasFloorTarget)}
          />
        </Form>
        <Statistic.Group
          size="tiny"
          widths={2}
          className={styles.smallStatistic}
        >
          <Statistic>
            <Statistic.Value>{`#${toNiceNumber(
              latestBlock.number || ' -'
            )}`}</Statistic.Value>
            <Statistic.Label className={styles.lowerCaseLabel}>
              <FormattedMessage
                id="dapp.status.mining.bestBlockLabel"
                defaultMessage="Best Block, at {time}"
                values={{
                  time: new Date(latestBlock.timestamp)
                    .toTimeString()
                    .split(' ')[0]
                }}
              />
            </Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value className={styles.lowerCaseLabel}>{`${hashrate ||
              0} H/s`}</Statistic.Value>
            <Statistic.Label className={styles.lowerCaseLabel}>
              <FormattedMessage
                id="dapp.status.mining.hashrateLabel"
                defaultMessage="Hash Rate"
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
    'accountsStore',
    'coinbaseStore',
    'extraDataStore',
    'gasFloorTargetStore',
    'hashrateStore',
    'latestBlockStore',
    'minGasPriceStore'
  )(observer(Mining))
);

const messages = {
  coinbaseLabel: {
    id: 'dapp.status.mining.coinbaseLabel',
    defaultMessage: 'Mining Author'
  }
};
