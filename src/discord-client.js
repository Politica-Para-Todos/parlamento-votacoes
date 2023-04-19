const publishOnDiscord = async (unnotifiedPosts, db) => {
  unnotifiedPosts.forEach(async (post, index) => {
    const formattedPost = {
      date: `${post.date.slice(0, 2)}-${post.date.slice(2, 4)}-${post.date.slice(4)}`,
      title: post.title,
      pdfUrl: post.pdfUrl
    };
    console.log(`Post: ${formattedPost} sent to be published.`);

    setTimeout(async () => {
      await postMessage(formattedPost);
    }, 5000 * (index + 1));

    if (index == 0) {
      db.data.lastPost = post;
      await db.write();
      console.log('Last post was written to db.json.');
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
  if (typeof content === 'string') {
    return JSON.stringify({
      content: message
    });
  }
  return JSON.stringify({
    content: `[${message.title} na data ${message.date}](${message.pdfUrl})`
  });
}

export default publishOnDiscord;
