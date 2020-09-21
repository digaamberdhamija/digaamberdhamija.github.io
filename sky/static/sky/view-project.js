import * as templates from './handlebars-templates.js';

export function render_view_project(id) {
  get_project(id);
}

function get_project(id) {
  const request = new XMLHttpRequest();
  request.open('GET', `/get_project_info?id=${id}`);
  request.send();
  request.onload = () => {
    const response = JSON.parse(request.responseText);
    if (response.status == 'success') {
      add_project(response, id);
    }
  }
}

function add_project(project, id) {
  var teams_str = '';
  for (let i = 0, l = project.teams.length; i < l; i++) {
    teams_str += `, ${project.teams[i]}`
  }
  project.teams_str = teams_str.substring(2);
  project.id = id;
  document.querySelector('#main-content-container').innerHTML = Handlebars.compile(templates.view_project_template)(project);

  get_project_updates(id);
  add_view_project_listeners(project.open);
}

function get_project_updates(id) {
  const request = new XMLHttpRequest();
  request.open('GET', `/get_project_updates?id=${id}`);
  request.send();
  request.onload = () => {
    const response = JSON.parse(request.responseText);
    if (response.status == 'success') {
      add_project_updates(response.updates);
    }
  }
}

function add_project_updates(updates) {
  document.querySelector('#view-project-updates').innerHTML = Handlebars.compile(templates.view_project_updates_template)({'updates': updates});
}

function send_add_update(event, form) {
  event.preventDefault();
  const id = document.querySelector('#view-project-info').dataset.id;
  const request = new XMLHttpRequest();
  request.open('POST', '/add_project_update');
  request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));
  const data = new FormData();
  data.append('id', id);
  data.append('update', document.querySelector('#view-project-add-update').value);
  request.send(data);
  request.onload = () => {
    if (JSON.parse(request.responseText).status == 'success') {
      get_project_updates(id);
      form.reset();
    }
  }
}

function change_project_status(button) {
  const id = button.dataset.id;
  const request = new XMLHttpRequest();
  request.open('POST', '/change_project_status');
  request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));
  const data = new FormData();
  data.append('id', id);
  request.send(data);
  request.onload = () => {
    if (JSON.parse(request.responseText).status == 'success') {
      get_project(id);
    }
  }
}

function add_view_project_listeners(open) {
  if (open) {
    document.querySelector('#add-update-form').onsubmit = function(e) { send_add_update(e, this); }
  }
  document.querySelector('#project-change-status-button').onclick = function() { change_project_status(this); }
}
