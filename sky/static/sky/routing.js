import { render_feed } from './feed.js';
import { render_teams } from './teams.js';
import { render_notes } from './notes.js';
import { render_account } from './account.js';
import { render_projects } from './projects.js';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#dashboard-feed-button').onclick = () => { render_feed(); }
  document.querySelector('#dashboard-teams-button').onclick = () => { render_teams(); }
  document.querySelector('#dashboard-notes-button').onclick = () => { render_notes(); }
  document.querySelector('#dashboard-account-button').onclick = () => { render_account(); }
  document.querySelector('#dashboard-projects-button').onclick = () => { render_projects(); }
})
