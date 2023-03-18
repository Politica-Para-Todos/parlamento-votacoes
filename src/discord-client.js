import { DISCORD_WEB_HOOK } from './constants.js';

const publishOnDiscord = async (post) => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      content: `[${post.title} ${post.date}](${post.pdfUrl})`
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  fetch(DISCORD_WEB_HOOK, options)
    .then(response => console.log(response));
}

export default publishOnDiscord;
