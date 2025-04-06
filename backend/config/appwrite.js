const sdk = require('node-appwrite');
const { Account } = sdk;

const endPoint = process.env.APPWRITE_ENDPOINT
const projectId = process.env.APPWRITE_PROJECT_ID
const apiKey = process.env.APPWRITE_API_KEY

const client = new sdk.Client();

client.setEndpoint(endPoint).setProject(projectId).setKey(apiKey);

const account = new Account(client);

module.exports = { client, account, sdk };