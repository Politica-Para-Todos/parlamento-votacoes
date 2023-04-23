import { PARLIAMENT_VOTING_ARCHIVE_URL, WEBSITE_VOTING_ELEMENT_ID } from './constants.js';
import HTMLParser from 'node-html-parser';
import { isOdd, convertToDate, areTheSamePosts, isVotingScript } from './utils.js';
import { redisClient } from './config.js';

const scan = async () => {
  return fetch(PARLIAMENT_VOTING_ARCHIVE_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${PARLIAMENT_VOTING_ARCHIVE_URL} respondend with code: ${response.status} - ${response.statusText}.`);
      }
      console.log(`...Response was ${response.statusText} - ${response.status}.`);
      return response.text();
    })
    .then(async (html) => {
      const parser = HTMLParser.parse(html);
      const publicationResults = [];
      const docsVotingSection = parser.getElementById(WEBSITE_VOTING_ELEMENT_ID);
      const docsVotingSectionSize = docsVotingSection.childNodes.length;
      const redisObject = await redisClient.json.get('lastPost');

      for (let index = 0; index < docsVotingSectionSize; index++) {
        const votingElement = docsVotingSection.childNodes[index];
        if (isOdd(index)) {
          let date = '';
          let title = '';
          let pdfUrl = '';

          for (let index = 0; index < votingElement.childNodes.length; index++) {
            const innerSection = votingElement.childNodes[index];
            if (isOdd(index)) {
              if (index == 1) {
                date = convertToDate(innerSection.innerText);
              }
              else if (index == 3) {
                title = innerSection.innerText.trim();
                pdfUrl = innerSection.getElementsByTagName('a')[0].attributes.href;

                const currentPost = {
                  title,
                  date,
                  pdfUrl
                }

                if (isVotingScript(currentPost.title) || areTheSamePosts(currentPost, redisObject)) {
                  return publicationResults;
                }

                publicationResults.push({
                  title,
                  date,
                  pdfUrl
                });
              }
            }
          }
        }
      }
      // order posts by date asc 
      return publicationResults.sort((pub1, pub2) => new Date(pub1.date) - new Date(pub2.date));
    })
    .catch(error => {
      console.log('Something went wrong:');
      console.error(error)
    });
}

export default scan;
