import { bootstrap, closeRedisDatabaseConnection } from './src/config.js';
import executeApp from './src/execution.js';

console.log('---> parlamento-votacoes is starting...');
await bootstrap();
await executeApp();
await closeRedisDatabaseConnection(0);
console.log('App have finished execution.');
