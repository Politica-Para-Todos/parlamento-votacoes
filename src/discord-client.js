import { DISCORD_WEB_HOOK } from "./constants.js";

const publishOnDiscord = async (publication) => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      // content: `
      // Título: ${publication.title}
      // Data: ${publication.date}
      // PDF Votação: ${publication.pdfUrl}
      // `,
      content: "This is a test message",
      components: [
        {
          type: 1,
          components: [
            {
              style: 5,
              label: "publication.title",
              url: "publication.pdfUrl"
            }
          ]
        }
      ],
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  fetch(DISCORD_WEB_HOOK, options)
    .then(response => console.log(response));
}

export default publishOnDiscord;
