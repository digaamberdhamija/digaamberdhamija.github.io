import * as templates from './handlebars-templates.js';
import { render_view_project } from './view-project.js';

var selected_teams = {'my_teams': [], 'other_teams': []}

export function render_projects() {
  const main_container = document.querySelector('#main-content-container');

  main_container.innerHTML =
    Handlebars.compile(templates.main_content_title_template)({'title': 'projects', 'text': 'all your planned works'});

  main_container.insertAdjacentHTML('beforeend', Handlebars.compile(
    templates.projects_template
  )());

  get_teams('', false);
  get_all_projects('', false);
}

function get_teams(query, searched) {
  const request = new XMLHttpRequest();
  request.open('GET', `/get_teams?query=${query}`);
  request.send();
  request.onload = () => {
    const response = JSON.parse(request.responseText);
    add_teams(response.my_teams, response.other_teams, searched);
  }
}

function add_teams(my_teams, other_teams, searched) {
  function groups_of_three(teams) {
    var grouped = [];
    for (let i = 0, l = teams.length; i < l; i = i + 3) {
      var group = [];
      for (let j = 0; j < 3; j++) {
        if (teams[i + j]) {
          group.push(teams[i + j]);
        }
      }
      grouped.push(group);
    }
    return grouped;
  }

  for (let i = 0, l = my_teams.length; i < l; i++) {
    get_selected_team('my_teams', my_teams[i].id)
    ? my_teams[i].selected = true
    : my_teams[i].selected = false;
  }

  for (let i = 0, l = other_teams.length; i < l; i++) {
    get_selected_team('other_teams', other_teams[i].id)
    ? other_teams[i].selected = true
    : other_teams[i].selected = false;
  }

  document.querySelector('#new-project-my-teams').innerHTML =
    Handlebars.compile(templates.new_project_my_teams_template)({'teams': groups_of_three(my_teams), 'searched': searched});

  document.querySelector('#new-project-other-teams').innerHTML =
    Handlebars.compile(templates.new_project_other_teams_template)({'teams': groups_of_three(other_teams), 'searched': searched});

  add_project_listeners();
}

function get_selected_team(type, id) {
  if (type == 'my_teams') {
    for (let i = 0, l = selected_teams.my_teams.length; i < l; i++) {
      if (selected_teams.my_teams[i].id == id) {
        return {'team': selected_teams.my_teams[i], 'index': i};
      }
    }
    return false;
  }

  else if (type == 'other_teams') {
    for (let i = 0, l = selected_teams.other_teams.length; i < l; i++) {
      if (selected_teams.other_teams[i].id == id) {
        return {'team': selected_teams.other_teams[i], 'index': i};
      }
    }
    return false;
  }
}

function select_team(button) {
  const selected = get_selected_team(button.dataset.team_type, button.dataset.id);
  var selected_teams_str = '';

  if (button.dataset.team_type == 'my_teams') {

    if (selected) {
      button.classList.remove('active');
      selected_teams.my_teams.splice(selected.index, 1);
    }
    else {
      button.classList.add('active');
      selected_teams.my_teams.push({'id': button.dataset.id, 'name': button.dataset.name});
    }
  }

  else if (button.dataset.team_type == 'other_teams') {

    if (selected) {
      button.classList.remove('active');
      selected_teams.other_teams.splice(selected.index, 1);
    }
    else {
      button.classList.add('active');
      selected_teams.other_teams.push({'id': button.dataset.id, 'name': button.dataset.name});
    }
  }

  for (let i = 0, l = selected_teams.my_teams.length; i < l; i++) {
    selected_teams_str += `, ${selected_teams.my_teams[i].name}`;
  }
  for (let i = 0, l = selected_teams.other_teams.length; i < l; i++) {
    selected_teams_str += `, ${selected_teams.other_teams[i].name}`;
  }

  const selected_teams_display = document.querySelector('#selected-teams-display');
  selected_teams_display.classList.remove('text-danger');
  selected_teams_display.innerHTML = selected_teams_str.substring(2);

}

function start_new_project(event, form) {
  event.preventDefault();
  const selected_teams_display = document.querySelector('#selected-teams-display');
  if (selected_teams.my_teams.length < 1) {
    selected_teams_display.classList.add('text-danger');
    selected_teams_display.innerHTML = 'you must select atleast one team that you are a part of.';
  }
  else {
    const request = new XMLHttpRequest();
    request.open('POST', '/start_new_project');
    request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));
    const data = new FormData();
    data.append('title', document.querySelector('#new-project-name').value);
    data.append('description', document.querySelector('#new-project-description').value);
    data.append('teams', JSON.stringify(selected_teams));
    request.send(data);

    request.onload = () => {
      const response = JSON.parse(request.responseText);
      if (response.status == 'success') {
        selected_teams_display.classList.remove('text-danger');
        selected_teams_display.innerHTML = 'project started successfully. see \'my projects\' for more info';
        selected_teams.my_teams = [];
        selected_teams.other_teams = [];
        get_teams('', false);
        get_all_projects('', false);
        form.reset();
      }
      else if (response.error) {
        selected_teams_display.classList.add('text-danger');
        selected_teams_display.innerHTML = response.error;
      }
    }
  }
}

function get_all_projects(query, searched) {
  const request = new XMLHttpRequest();
  request.open('GET', `/get_all_projects?query=${query}`);
  request.send();
  request.onload = () => {
    const response = JSON.parse(request.responseText);
    add_all_projects(response.my_projects, response.other_projects, searched)
  }
}

function add_all_projects(my_projects, other_projects, searched) {
  for (let i = 0, l = my_projects.length; i < l; i++) {
    var teams_str = '';
    for (let j = 0, m = my_projects[i].teams.length; j < m; j++) {
      teams_str += `, ${my_projects[i].teams[j].name}`;
    }
    my_projects[i].teams_str = teams_str.substring(2);
  }
  for (let i = 0, l = other_projects.length; i < l; i++) {
    var teams_str = '';
    for (let j = 0, m = other_projects[i].teams.length; j < m; j++) {
      teams_str += `, ${other_projects[i].teams[j].name}`;
    }
    other_projects[i].teams_str = teams_str.substring(2);
  }

  document.querySelector('#my-projects-display').innerHTML =
    Handlebars.compile(templates.my_projects_template)({'projects': my_projects, 'searched': searched});

  document.querySelector('#other-projects-display').innerHTML =
    Handlebars.compile(templates.other_projects_template)({'projects': other_projects, 'searched': searched});

  add_project_listeners();
}

function add_project_listeners() {
  document.querySelectorAll('#select-team-button').forEach(button => {
    button.onclick = () => { select_team(button); }
  });
  document.querySelector('#search-teams').onkeyup = function() { get_teams(this.value, true); }
  document.querySelector('#new-project-form').onsubmit = function(e) { start_new_project(e, this); }
  document.querySelector('#search-projects').onkeyup = function() { get_all_projects(this.value, true); }
  document.querySelectorAll('#view-project-button').forEach(button => {
    button.onclick = () => { render_view_project(button.dataset.id); }
  });
}
