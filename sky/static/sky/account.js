import * as templates from './handlebars-templates.js';

export function render_account() {
  const main_container = document.querySelector('#main-content-container');

  main_container.innerHTML = Handlebars.compile(templates.main_content_title_template)({'title': 'profile', 'text': 'your personal record'});

  main_container.insertAdjacentHTML('beforeend', Handlebars.compile(
    templates.profile_display_template
  )({'username': document.querySelector('body').dataset.username}));

  main_container.insertAdjacentHTML('beforeend', Handlebars.compile(
    templates.my_posts_template
  )());

  get_my_posts('', false);
}

function get_my_posts(query, searched) {
  const request = new XMLHttpRequest();
  request.open('GET', `/get_my_posts?query=${query}`);
  request.send();
  request.onload = () => { add_my_posts(JSON.parse(request.responseText).posts, searched) }
}

function add_my_posts(posts, searched) {
  document.querySelector('#my-posts').innerHTML =
    Handlebars.compile(templates.my_posts_display_template)({'posts': posts, 'searched': searched});
  add_profile_listeners();
}

function delete_my_post(button) {
  const request = new XMLHttpRequest();
  request.open('POST', '/delete_post');
  request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));
  const data = new FormData();
  data.append('id', button.dataset.id);
  request.send(data);
  request.onload = () => {
    if (JSON.parse(request.responseText).status == 'success') {
      get_my_posts('', false);
    }
  }
}

function add_profile_listeners() {
  document.querySelector('#search-my-posts').onkeyup = function() { get_my_posts(this.value, true); }
  document.querySelectorAll('#delete-my-post-button').forEach(button => {
    button.onclick = () => { delete_my_post(button); }
  });
}
