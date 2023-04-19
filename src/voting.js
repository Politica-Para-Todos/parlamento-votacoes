import { startDB } from './db.js';
import scan from './scan.js';
import publishOnDiscord from './discord-client.js';

const db = await startDB();

const executeApp = async () => {
  console.log('Requesting Parlamento/Arquivo.pt...');
  
  const unnotifiedPosts = await scan(db);
  
  if (unnotifiedPosts.length === 0) {
    // no new posts
    // publish to Discord execution with no new posts ?
    console.log('There are no new posts.');
    process.exit(0);
  }
  await publishOnDiscord(unnotifiedPosts, db);
}

export default executeApp;
