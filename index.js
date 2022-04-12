const absinthe = require('@absinthe/socket');
const phoenix = require('phoenix-channels');
const _ = require('lodash');

const ENDPOINT = 'wss://api.mortgagebroker.tools/socket/websocket';
const VSN = '1.0.0';

/**
 * Creates a new API object.
 * 
 * @param token The token to be used for the API authorization.
 */
function MortgageBrokerToolsAPI(token) {
  this.token = token;
};

MortgageBrokerToolsAPI.prototype._makeURL = function (endpoint) {
  return `${endpoint}?token=${this.token}&vsn=${VSN}`;
};

/**
 * Connects to the API.
 */
MortgageBrokerToolsAPI.prototype.connect = function (endpoint) {
  const url = this._makeURL(endpoint || ENDPOINT);

  this.phoenixSocket = new phoenix.Socket(url);
  this.absintheSocket = absinthe.create(this.phoenixSocket);
};

/**
 * Checks whether the API is connected or not.
 * 
 * @returns A boolean value indicating whether the API is connected or not.
 */
MortgageBrokerToolsAPI.prototype.isConnected = function () {
  return !_.isNil(this.phoenixSocket) & !_.isNil(this.absintheSocket);
};

MortgageBrokerToolsAPI.prototype.listenToCaseResults = function (uuid, receiveCallback, errorCallback) {
  if (!this.isConnected()) {
    throw new Error('Client not connected.');
  }

  if (!_.isFunction(receiveCallback)) {
    throw new Error('Receive callback not provided.');
  }

  //  inject-language: gql
  const operation = `
  subscription Client_Op($uuid: String!) { 
    caseResults(uuid: $uuid) {
      additionalInformation
      amount
      exclusionReasons
      screenshotPdfUrl 
      status
    } 
  }
  `;

  const notifier = absinthe.send(this.absintheSocket, { operation, variables: { uuid } });

  absinthe.observe(this.absintheSocket, notifier, {
    onStart: () => {
      console.log('start!');
    },
    onResult: ({ data: { caseResults } }) => {
      receiveCallback(caseResults);
    },
    onAbort: args => {
      console.log(args);
      const err = new Error('Aborted.');

      if (_.isNil(errorCallback)) {
        throw err;
      }

      errorCallback(err);
    },
    onError: err => {
      if (_.isNil(errorCallback)) {
        throw err;
      }

      errorCallback(err);
    },
  });
};

module.exports = MortgageBrokerToolsAPI;
