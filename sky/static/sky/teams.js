import * as templates from './handlebars-templates.js';
import { search } from './chat.js';

var selected_coworkers = [];

export function render_teams() {
  const main_content_container = document.querySelector('#main-content-container');

  main_content_container.innerHTML =
  Handlebars.compile(templates.main_content_title_template)({'title': 'teams', 'text': 'the place where all the magic happens'});

  main_content_container.insertAdjacentHTML('beforeend', Handlebars.compile(templates.teams_buttons_template)());
  main_content_container.insertAdjacentHTML('beforeend', Handlebars.compile(templates.new_team_template)());
  main_content_container.insertAdjacentHTML('beforeend', Handlebars.compile(templates.all_teams_display_template)());
  get_coworkers('');
  get_teams('', false);
  add_team_listeners();
}

function get_teams(query, searched) {
  const request = new XMLHttpRequest();
  request.open('GET', `/get_teams?query=${query}`);
  request.send();
  request.onload = () => { add_teams(JSON.parse(request.responseText), searched); }
}

function add_teams(teams, searched) {
  for (let i = 0, l = teams.my_teams.length; i < l; i++) {
    teams.my_teams[i].member_str = 'you';
    for (let j = 0, m = teams.my_teams[i].members.length; j < m; j++) {
      teams.my_teams[i].member_str += `, ${teams.my_teams[i].members[j]}`
    }
  }

  for (let i = 0, l = teams.other_teams.length; i < l; i++) {
    teams.other_teams[i].member_str = '';
    for (let j = 0, m = teams.other_teams[i].members.length; j < m; j++) {
      teams.other_teams[i].member_str += `, ${teams.other_teams[i].members[j]}`;
    }
    teams.other_teams[i].member_str = teams.other_teams[i].member_str.substring(2);
  }

  const my_teams_display = document.querySelector('#teams-my-teams-display');
  my_teams_display.innerHTML = '';
  my_teams_display.insertAdjacentHTML('beforeend', Handlebars.compile(templates.my_teams_template)({'teams': teams.my_teams, 'searched': searched}));

  const other_teams_display = document.querySelector('#teams-other-teams-display');
  other_teams_display.innerHTML = '';
  other_teams_display.insertAdjacentHTML('beforeend', Handlebars.compile(templates.other_teams_template)({'teams': teams.other_teams, 'searched': searched}));
}

function get_coworkers(query) {
  const request = new XMLHttpRequest();
  request.open('GET', `/get_employees?query=${query}`);
  request.send();
  request.onload = () => {
    return add_coworkers(JSON.parse(request.responseText).employees);
  }
}

function add_coworkers(coworkers) {
  var three_grouped_coworkers = [];
  for (let i = 0, l = coworkers.length; i < l; i = i + 3) {
    var group = [];
    for (let j = 0; j < 3; j++) {
      if (coworkers[i + j]) {
        get_selected_coworker(coworkers[i + j].id)
        ? coworkers[i + j].selected = true
        : coworkers[i + j].selected = false;
        group.push(coworkers[i + j]);
      }
    }
    three_grouped_coworkers.push(group);
  }
  document.querySelector('#new-team-coworkers').innerHTML =
    Handlebars.compile(templates.new_team_coworkers_template)({'coworkers': three_grouped_coworkers});

  return true;
}

function search_coworkers(query) {
  get_coworkers(query);
  add_team_listeners();
}

function get_selected_coworker(id) {
  for (let i = 0, l = selected_coworkers.length; i < l; i++) {
    if (selected_coworkers[i].id == id) {
      return {'coworker': selected_coworkers[i], 'index': i};
    }
  }
  return false;
}

function select_coworker(button) {
  const coworker = get_selected_coworker(button.dataset.id);
  if (coworker) {
    button.classList.remove('active');
    selected_coworkers.splice(parseInt(coworker.index), 1)

  }
  else {
    button.classList.add('active');
    selected_coworkers.push({'username': button.dataset.username, 'id':button.dataset.id });
  }

  var username_str = '';
  for (let i = 0, l = selected_coworkers.length; i < l; i++) {
    username_str += `, ${selected_coworkers[i].username}`;
  }

  const selected_coworkers_display = document.querySelector('#selected-coworkers-display');
  selected_coworkers_display.classList.remove('text-danger');
  selected_coworkers_display.innerHTML = username_str.substring(2);
}

function create_team(e) {
  e.preventDefault();
  var send = true;

  if (selected_coworkers.length < 1) {
    const selected_coworkers_display = document.querySelector('#selected-coworkers-display');
    selected_coworkers_display.classList.add('text-danger');
    selected_coworkers_display.innerHTML = 'you must select atleast 1 coworker.';
    send = false;
  }

  if (document.querySelector('#new-team-name').value.includes(' ')) {
    const selected_coworkers_display = document.querySelector('#selected-coworkers-display');
    selected_coworkers_display.classList.add('text-danger');
    selected_coworkers_display.innerHTML = 'team name cannot consist of any spaces.';
    send = false;
  }

  const new_team_data = {
    'team_name': document.querySelector('#new-team-name').value,
    'employees': selected_coworkers
  };

  if (send) {
    const request = new XMLHttpRequest();
    request.open('POST', '/create_team');
    request.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
    const data = new FormData();
    data.append('team_data', JSON.stringify(new_team_data));
    request.send(data);
    request.onload = () => {
      const response = JSON.parse(request.responseText);
      if (response.status == 'success') {
        created_team();
      }
      else if (response.error) {
        const selected_coworkers_display = document.querySelector('#selected-coworkers-display');
        selected_coworkers_display.classList.add('text-danger');
        selected_coworkers_display.innerHTML = response.error;
      }
    }
  }
}

function created_team() {
  document.querySelector('#new-team-form').reset();
  selected_coworkers = [];
  search_coworkers('');
  search('');
  get_teams('', false);
  document.querySelector('#selected-coworkers-display').classList.remove('text-danger');
  document.querySelector('#selected-coworkers-display').innerHTML = 'team created. see \'my teams\' for more info.';
}

function add_team_listeners() {
  document.querySelector('#search-coworkers').onkeyup = function() { search_coworkers(this.value); }
  setTimeout(() => {
    document.querySelectorAll('#select-coworker-button').forEach(button => {
      button.onclick = () => { select_coworker(button); }
    });
  }, 300);
  document.querySelector('#new-team-form').onsubmit = (e) => { create_team(e); };
  document.querySelector('#search-teams').onkeyup = function() { get_teams(this.value, true); }
}
