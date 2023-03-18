import { appConfiguration } from './src/utils.js';
import executeApp from './src/voting.js';

console.log('Start cnfiguration...')
appConfiguration();
console.log('Configuration completed.');

console.log('App is starting...');
await executeApp();
console.log('App have finished execution.');