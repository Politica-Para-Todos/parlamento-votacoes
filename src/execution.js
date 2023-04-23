import scan from './scan.js';
import postOnDiscord from './discord-client.js';
import { currentDateTime } from './utils.js';

const executeApp = async () => {
  console.log('Requesting Parlamento/Arquivo.pt...');

  const unnotifiedPosts = await scan();

  if (unnotifiedPosts.length === 0) {
    console.log('There are no new posts.');
    await postOnDiscord(`Olá :wave: \nHoje, ${ currentDateTime() }, confirmei e não existem novos resultados de votações. \nAmanhã procuro novamente, até lá !`);
  }
  await postOnDiscord(unnotifiedPosts);
}

export default executeApp;
