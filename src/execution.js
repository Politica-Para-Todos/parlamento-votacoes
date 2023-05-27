import scan from './scan.js';
import postOnDiscord from './discord-client.js';

const executeApp = async () => {
  console.log('Requesting Parlamento/Arquivo.pt...');

  const unnotifiedPosts = await scan();

  if (unnotifiedPosts.length === 0) {
    console.log('There are no new posts.');
    process.exit();
  }
  await postOnDiscord(unnotifiedPosts);
}

export default executeApp;
