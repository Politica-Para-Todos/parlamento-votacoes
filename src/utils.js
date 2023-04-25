import { VOTING_SCRIPT_TITLE } from './constants.js';

export const isOdd = (value) => value % 2 != 0;

export const convertToDate = (text) => text.trim().replace(/[.\s]/g, '');

export const areTheSamePosts = (currentPost, lastSavedPost) =>
  JSON.stringify(currentPost) === JSON.stringify(lastSavedPost);

export const isVotingScript = (title) => title.includes(VOTING_SCRIPT_TITLE);

export const currentDateTime = () => new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' });
