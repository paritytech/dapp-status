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
import { injectIntl, intlShape } from 'react-intl';

import Field from '../../../components/Field';

const NORMAL = 'NORMAL';
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const ERROR = 'ERROR';

class EnodeField extends Component {
  state = {
    acceptNonReservedPeers: true,
    enode: '',
    error: null,
    phase: NORMAL
  };

  static propTypes = {
    addRemove: PropTypes.oneOf(['ADD', 'REMOVE']),
    intl: intlShape
  };

  handleChange = (_, { value }) =>
    this.setState({ enode: value, phase: NORMAL });

  handleSubmit = () => {
    if (this.state.phase === ERROR) {
      this.setState({ phase: NORMAL, error: null });
      return;
    }
    const { netPeersStore, addRemove } = this.props;
    this.setState({ phase: PENDING });
    const enodePromise =
      addRemove === 'ADD'
        ? netPeersStore.addReservedPeer(this.state.enode)
        : netPeersStore.removeReservedPeer(this.state.enode);

    enodePromise
      .then(() => {
        this.setState({
          phase: FULFILLED,
          enode: ''
        });
        // Show the fulfilled message for 2s
        return new Promise(resolve => setTimeout(resolve, 2000));
      })
      .then(() => this.setState({ phase: NORMAL }))
      .catch(error => {
        this.setState({ phase: ERROR, error: error.toString() });
      });
  };

  render() {
    const { addRemove, intl: { formatMessage } } = this.props;
    const { enode, error, phase } = this.state;

    return (
      <Field
        action={{
          content:
            phase === FULFILLED
              ? formatMessage(messages.reservedPeerFulfilled, {
                  add: addRemove === 'ADD'
                })
              : phase === ERROR
                ? formatMessage(messages.reservedPeerError, {})
                : formatMessage(messages.reservedPeerButton, {
                    add: addRemove === 'ADD'
                  }),
          disabled: !enode || phase === FULFILLED,
          icon:
            phase === FULFILLED
              ? 'check'
              : phase === ERROR
                ? 'remove'
                : addRemove === 'ADD' ? 'plus' : 'minus',
          loading: phase === PENDING,
          onClick: this.handleSubmit,
          positive: phase === FULFILLED,
          primary: phase !== ERROR,
          size: 'tiny'
        }}
        error={phase === ERROR && error}
        onChange={this.handleChange}
        placeholder={formatMessage(messages.reservedPeerPlaceholder, {
          add: addRemove === 'ADD'
        })}
        size="small"
        value={enode}
        width={5}
      />
    );
  }
}

export default injectIntl(inject('netPeersStore')(observer(EnodeField)));

const messages = {
  reservedPeerButton: {
    id: 'dapp.status.peers.enodeField.reservedPeerButton',
    defaultMessage: '{add, select, true {Add} false {Remove}} Reserved Peer'
  },
  reservedPeerError: {
    id: 'dapp.status.peers.enodeField.reservedPeerError',
    defaultMessage: 'Clear Error'
  },
  reservedPeerFulfilled: {
    id: 'dapp.status.peers.enodeField.reservedPeerFulfilled',
    defaultMessage:
      'Enode successfully {add, select, true {added} false {removed}}'
  },
  reservedPeerPlaceholder: {
    id: 'dapp.status.peers.enodeField.reservedPeerPlaceholder',
    defaultMessage: 'Enode address to {add, select, true {add} false {remove}}'
  }
};
