import * as templates from './handlebars-templates.js';

function add_all_posts(posts, searched) {
  document.querySelector('#posts').innerHTML = Handlebars.compile(templates.posts_template)({'posts': posts, 'searched': searched});
  add_feed_listeners();
}

function get_all_posts(query, searched) {
  const request = new XMLHttpRequest();
  request.open('GET', `/get_all_posts?query=${query}`);
  request.send();
  request.onload = () => { add_all_posts(JSON.parse(request.responseText).posts, searched); }
}

export function render_feed() {
  const main_content_title_template = Handlebars.compile(templates.main_content_title_template);
  const feed_template = Handlebars.compile(templates.feed_template);
  const main_content_container = document.querySelector('#main-content-container');
  main_content_container.innerHTML = main_content_title_template({'title': 'feed', 'text': 'latest ongoings in the company'});
  main_content_container.insertAdjacentHTML('beforeend', feed_template());
  get_all_posts('', false);
}

function send_new_post(form) {
  const request = new XMLHttpRequest();
  request.open("POST", "/new_post");
  request.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
  const data = new FormData();
  data.append('title', document.querySelector('#new-post-title').value);
  data.append('text', document.querySelector('#new-post-text').value);
  request.send(data);
  form.reset();
  request.onload = () => {
    get_all_posts('', false);
    add_feed_listeners();
  }
}

function send_delete_post(button) {
  const request = new XMLHttpRequest();
  request.open("POST", "/delete_post");
  request.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
  const data = new FormData();
  data.append('id', button.dataset.id);
  request.send(data);
  request.onload = () => {
    if (JSON.parse(request.responseText).status == 'success') {
      get_all_posts('', false);
    }
  }
}

function add_feed_listeners() {
  document.querySelector('#new-post-form').onsubmit = function(event) {
    event.preventDefault();
    send_new_post(this);
  }
  document.querySelectorAll('#delete-post-button').forEach(button => {
    button.onclick = function() { send_delete_post(this); }
  });
  document.querySelector('#search-posts').onkeyup = function() { get_all_posts(this.value, true); }
}

document.addEventListener('DOMContentLoaded', () => {
  add_feed_listeners();
});
