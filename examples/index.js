const MortgageBrokerToolsAPI = require("../index.js");

const TOKEN = "YOUR_TOKEN";
const CASE_UUID = "YOUR_CASE_UUID";

const api = new MortgageBrokerToolsAPI(TOKEN);

api.connect();

api.listenToCaseResults(
  CASE_UUID,
  (result) => console.log(result),
  (err) => console.error(err)
);
