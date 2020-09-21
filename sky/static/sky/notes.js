import * as templates from './handlebars-templates.js';

export function render_notes() {
  const main_container = document.querySelector('#main-content-container');

  main_container.innerHTML = Handlebars.compile(templates.main_content_title_template)({'title': 'notes', 'text': 'your personal notebook'});
  main_container.insertAdjacentHTML('beforeend', Handlebars.compile(templates.new_note_template)());
  get_notes('', false);
  add_notes_listeners();
}

function get_notes(query, searched) {
  const request = new XMLHttpRequest();
  request.open('GET', `/get_notes?query=${query}`);
  request.send();
  request.onload = () => {
    add_notes(JSON.parse(request.responseText).notes, searched);
  }
}

function add_notes(notes, searched) {
  var two_grouped_notes = [];
  for (let i = 0, l = notes.length; i < l; i = i + 2) {
    var group = [];
    for (let j = 0; j < 2; j++) {
      if (notes[i + j]) {
        group.push(notes[i + j]);
      }
    }
    two_grouped_notes.push(group);
  }
  document.querySelector('#notes-display').innerHTML =
    Handlebars.compile(templates.notes_display_template)({'notes': two_grouped_notes, 'searched': searched});
  add_notes_listeners();
}

function create_note(e, form) {
  e.preventDefault();
  const request = new XMLHttpRequest();
  request.open('POST', '/create_note');
  request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));
  const data = new FormData();
  data.append('title', document.querySelector('#new-note-title').value);
  data.append('text', document.querySelector('#new-note-text').value);
  request.send(data);
  request.onload = () => {
    if (JSON.parse(request.responseText).status == 'success') {
      form.reset()
      get_notes('', false);
    }
  }
}

function delete_note(button) {
  const request = new XMLHttpRequest();
  request.open('POST', '/delete_note');
  request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));
  const data = new FormData();
  data.append('id', button.dataset.id);
  request.send(data);
  request.onload = () => {
    if (JSON.parse(request.responseText).status == 'success') {
      get_notes('', false);
    }
  }
}

function add_notes_listeners() {
  document.querySelector('#new-note-form').onsubmit = function(e) { create_note(e, this); }
  document.querySelector('#search-notes').onkeyup = function() { get_notes(this.value, true); }
  document.querySelectorAll('#delete-note-button').forEach(button => {
    button.onclick = () => { delete_note(button); }
  });
}
