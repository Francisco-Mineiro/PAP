import { Client, Account,ID, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('695c08c700316c0618d3');

export const account = new Account(client);
export { ID };