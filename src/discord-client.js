import { redisClient } from "./config.js";

const postOnDiscord = async (content) => {

  if (typeof content === 'string') {
    await postMessage(content);
    return;
  } 
  
  content.forEach(async (post, index) => {
    const formattedPost = {
      date: `${post.date.slice(0, 2)}-${post.date.slice(2, 4)}-${post.date.slice(4)}`,
      title: post.title,
      pdfUrl: post.pdfUrl
    };
    
    console.log(`Post: ${JSON.stringify(formattedPost)} on queue to be published.`);

    setTimeout(async () => {
      await postMessage(formattedPost);
    }, 5000 * (index + 1));

    if (index === 0) {
      await redisClient.json.set('lastPost', '.', post);
    }
    console.log('All new posts were published.');
  })
}

const postMessage = async (message) => {
  const options = {
    method: 'POST',
    body: buildRequestBody(message),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  fetch(process.env.DISCORD_WEB_HOOK, options)
    .then(async (response) => {
      if (response.status === 429) {
        console.log('Discord publish has failed. We will retry...');
        await postMessage(message);
      }
      else {
        console.log('Retry successful.');
        return response.json();
      }
    })
    .catch(error => {
      console.log(error);
      return error;
    });
}

const buildRequestBody = (message) => {
  if (typeof message === 'string') {
    return JSON.stringify({
      content: message
    });
  }
  return JSON.stringify({
    content: `[${message.title} na data ${message.date}](${message.pdfUrl})`
  });
}

export default postOnDiscord;
