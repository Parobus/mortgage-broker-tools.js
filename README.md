# MBT - GraphQL Subscription via WebSocket Connection for Node.js

This repo showcases `caseResults` GraphQL subscription via WebSocket connection to MBT WebSocket API.

## Description

The MBT WebSocket API is powered by Phoenix Sockets and Absinthe. Therefore, to integrate seamlessly the API was consumed via Phoenix Sockets client for Node.js [phoenix-channels](https://github.com/mcampa/phoenix-channels) and Absinthe client [@absinthe/socket](https://github.com/absinthe-graphql/absinthe-socket).

## Installation

After cloning the repository run the command:

```sh
yarn add
// or
npm install
```

## Usage

As it can be seen in the given `examples` folder:

- Import `MortgageBrokerToolsAPI`

```
const MortgageBrokerToolsAPI = require("../index.js");
```

- Pass the `Token` and init MortgageBrokerToolsAPI

```
const api = new MortgageBrokerToolsAPI("YOUR_TOKEN");
```

- Init the connection and subscribe to `caseResults` by passing the case uuid

```
api.connect();

api.listenToCaseResults(
  "YOUR_CASE_UUID",
  (result) => console.log(result),
  (err) => console.error(err)
);
```

## Notes

MBT WebSocket API endpoint, API version and GraphQL query are hard-coded in the root index.js file. For any desired implementation, these hard-coded values and the usage of the `phoenix-channels` and `@absinthe/socket` can be changed or used by being inspired from this repo.

For more extensive usage, please refer to [phoenix-channels](https://github.com/mcampa/phoenix-channels) and [@absinthe/socket](https://github.com/absinthe-graphql/absinthe-socket) documentations.
