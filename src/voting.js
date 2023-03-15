import { convertToDate, isOdd } from './src/utils.js';
import HTMLParser from 'node-html-parser';
import publishOnDiscord from './src/discord-client.js';
import { LAST_PUBLICATION, PARLIAMENT_VOTING_ARCHIVE_URL, WEBSITE_VOTING_ELEMENT_ID } from './src/constants.js';

/*
  -- JOURNEY FLOW --
  
  >> currentPublication == LAST_PUBLICATION
    >> exit()
  >> save element { date, title, pdfUrl } (list)

  >> reorder list, so the oldest voting result be on the first position to be published first
  >> publishOnDiscord(publication)
  >> save the last publication as LAST_PUBLICATION
*/

// ENV VARS
console.info(`The last publication was: ${JSON.stringify(LAST_PUBLICATION)}`);

const executeApp = async () => {
  console.log('Requesting Parlamento/Arquivo.pt...')

  return fetch(PARLIAMENT_VOTING_ARCHIVE_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Page is down.');
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

                if (currentPublication == LAST_PUBLICATION) {
                  return;
                } else {
                  publications.push({
                    date, // should be a js Date object ? it is now
                    title, // string
                    pdfUrl // should be a js URL object ?
                  })
                }
              }
            }
          })
        }
      });
      console.log(`Pending publications: ${publications.length}`);

      const orderedPublications = publications.sort((pubA, pubB) => pubA.date - pubB.date);

      orderedPublications.forEach(async (publication, index) => {
        // Testing - call just once
        if (index == 0) {
          await publishOnDiscord(publication);
        }
        console.log(`Voting result ${JSON.stringify(publication)} was sent to Discogs.`);

        if (index == orderedPublications.length - 1) {
          // LAST_PUBLICATION = publication;
          console.log('All pending publications were sent.')
        }
      })

    })
    .catch(error => console.error(error));
}

export default executeApp;
