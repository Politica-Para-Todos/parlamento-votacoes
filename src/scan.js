import { PARLIAMENT_VOTING_ARCHIVE_URL, WEBSITE_VOTING_ELEMENT_ID } from './constants.js';
import HTMLParser from 'node-html-parser';
import { isOdd, convertToDate, areTheSamePosts, isVotingScript } from './utils.js';

const scan = async (db) => {
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

      for (let index = 0; index < docsVotingSection.childNodes.length; index++) {
        const votingElement = docsVotingSection.childNodes[index];
        // docsVotingSection.childNodes.forEach((votingElement, index) => {
        if (isOdd(index)) {
          let date = '';
          let title = '';
          let pdfUrl = '';

          // votingElement.childNodes.forEach(async (innerSection, index) => {
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
                  date,
                  title,
                  pdfUrl
                }

                if (!isVotingScript(currentPost.title) && areTheSamePosts(currentPost, db.data.lastPost)) {
                  console.log('No new posts');
                  return publicationResults;
                }

                if (!isVotingScript(currentPost.title) && !areTheSamePosts(currentPost, db.data.lastPost)) {
                  publicationResults.push({
                    date,
                    title,
                    pdfUrl
                  });
                }
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
