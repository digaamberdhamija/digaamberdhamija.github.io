import * as templates from './auth-handlebars-templates.js';

function removeContent() {
  d3.select('#auth-box')
    .transition()
      .duration(850)
      .style('left', '-580px')
    .remove();
}

function addContent(content) {
  // Choose template on the basis of which content is to be removed
  if (content == 'signup') {
    var template = Handlebars.compile(templates.signup_template);
  }
  else if (content == 'login') {
    var template = Handlebars.compile(templates.login_template);
  }
  else if (content == 'back') {
    var template = Handlebars.compile(templates.auth_template);
  }
  else if (content == 'about') {
    var template = Handlebars.compile(templates.about_template);
  }

  // Add the template
  d3.select('#main-container')
    .html(template());

  // Add listeners
  document.querySelectorAll('button').forEach(button => {
    if (button.dataset.button != 'signup-submit' && button.dataset.button != 'login-submit') {
      button.onclick = () => { pressed(button.dataset.button); };
    }
  });

  // Add transition
  d3.select('#auth-box')
    .transition()
      .duration(850)
      .style('left', '483px');
}

function pressed(button) {
  removeContent();
  setTimeout(() => { addContent(button); }, 850);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('button').forEach(button => {
    button.onclick = () => { pressed(button.dataset.button); };
  });


});
