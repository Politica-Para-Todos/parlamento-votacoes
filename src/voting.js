import { areObjectsEqual, convertToDate, isOdd } from './utils.js';
import HTMLParser from 'node-html-parser';
import publishOnDiscord from './discord-client.js';
import { PARLIAMENT_VOTING_ARCHIVE_URL, WEBSITE_VOTING_ELEMENT_ID } from './constants.js';
import { startDB } from './db.js';

const db = await startDB();

const executeApp = async () => {
  console.log('Requesting Parlamento/Arquivo.pt...')

  return fetch(PARLIAMENT_VOTING_ARCHIVE_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${PARLIAMENT_VOTING_ARCHIVE_URL} respondend with code: ${response.status} - ${response.statusText}.`);
      }
      console.log(`...Response was ${response.statusText} - ${response.status}.`);
      return response.text();
    })
    .then(async html => {
      const parser = HTMLParser.parse(html);
      const publications = [];

      const docsVotingSection = parser.getElementById(WEBSITE_VOTING_ELEMENT_ID);

      docsVotingSection.childNodes.forEach((votingElement, index) => {
        if (isOdd(index)) {
          let date = '';
          let title = '';
          let pdfUrl = '';

          votingElement.childNodes.forEach((innerSection, index) => {
            if (isOdd(index)) {
              if (index == 1) {
                date = convertToDate(innerSection.innerText);
              }
              else if (index == 3) {
                title = innerSection.innerText.trim();
                pdfUrl = innerSection.getElementsByTagName('a')[0].attributes.href;

                const currentPublication = {
                  date,
                  title,
                  pdfUrl
                }

                if (areObjectsEqual(currentPublication, db.data.lastPost)) {
                  console.log('No new voting result available.');
                  return;
                } else {
                  publications.push({
                    date,
                    title,
                    pdfUrl
                  })
                }
              }
            }
          })
        }
      });
      console.log(`Pending publications: ${publications.length}`);

      const orderedPublications = publications.sort((pubA, pubB) => pubA.date - pubB.date);

      orderedPublications.forEach(async (post, index) => {
        // Testing - call just once
        if (index == 0) {
          await publishOnDiscord(post);
        }
        console.log(`Voting result ${JSON.stringify(post)} was sent to Discogs.`);

        if (index == orderedPublications.length - 1) {
          db.data.lastPost = post;
          await db.write();
          console.log('Last post was written to db.json.');
        }
        console.log('All new posts were published.');
      })
    })
    .catch(error => {
      console.log('Something went wrong:');
      console.error(error)
    });
}

export default executeApp;
