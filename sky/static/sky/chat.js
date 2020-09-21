import * as templates from './handlebars-templates.js';

var private_message_tag = 1;

const sender_id = document.querySelector('body').dataset.id;

var chats_open = {'teams': [], 'private': []};

var chat_card = {'open': false, 'message_type': null, 'id': null, 'name': null, 'button': null};

var messages = {'teams': [], 'private': [], 'private_tags_included': []};

var sockets_open = {'teams': [], 'private': []}

const message_notifier_socket = new WebSocket(
  `
  ws://${window.location.host}/ws/chat/message_notifier/
  `
);

function get_messages(button) {
  const request = new XMLHttpRequest();
  if (button.dataset.message_type == 'team') {
    request.open(`GET`, `/get_messages?message_type=${button.dataset.message_type}&id=${button.dataset.id}`);
    request.send();
    request.onload = () => { JSON.parse(request.responseText).messages.forEach(message => { push_message(message) }); }
  }
  else if (button.dataset.message_type == 'private') {
    request.open(`GET`, `/get_messages?message_type=${button.dataset.message_type}&id1=${sender_id}&id2=${button.dataset.id}`);
    request.send();
    request.onload = () => {
      var message_object = {'id': button.dataset.id, 'messages': []};
      JSON.parse(request.responseText).messages.forEach(message => {
        message_object.messages.push(message);
      });
      messages.private.push(message_object);
    }
  }
}

function notify_new_message(message_dict) {
  document.querySelectorAll('#opened-chat').forEach(button => {
    if (button.dataset.message_type == message_dict.message_type) {
      var display = false;
      if (message_dict.message_type == 'team') {
        display = (button.dataset.id == message_dict.receiver_id);
      }
      else if (message_dict.message_type == 'private') {
        display = (button.dataset.id == message_dict.sender_id && sender_id == message_dict.receiver_id);
      }

      if (display) {
        button.classList.add('chat-btn-new-message');
        return;
      }
    }
  });
}

function show_toasts() {
  $('.toast').toast('show');
}

function remove_messages(button) {
  if (button.dataset.message_type == 'team') {
    for (let i = 0, l = messages.teams.length; i < l; i++) {
      if (messages.teams[i].id == button.dataset.id) {
        messages.teams.splice(i, 1);
      }
    }
  }
  else if (button.dataset.message_type == 'private') {
    for (let i = 0, l = messages.private.length; i < l; i++) {
      if (messages.private[i].id == button.dataset.id) {
        messages.private.splice(i, 1);
      }
    }
  }
}

function push_message(message) {
  if (message.message_type == 'team') {
    for (let i = 0, l = messages.teams.length; i < l; i++) {
      if (messages.teams[i].id == message.receiver_id) {
        messages.teams[i].messages.push(message);
        return;
      }
    }

    messages.teams.push({'id': message.receiver_id, 'messages': [message]});
    return;
  }
  else if (message.message_type == 'private') {
    if (!messages.private_tags_included.includes(message.server_tag)) {
      const receiver_id = (sender_id == message.receiver_id) ? message.sender_id : message.receiver_id;
      for (let i = 0, l = messages.private.length; i < l; i++) {
        if (messages.private[i].id == receiver_id) {
          messages.private[i].messages.push(message);
          messages.private_tags_included.push(message.server_tag);
          return false;
        }
      }
      messages.private_tags_included.push(message.server_tag);
      messages.private.push({'id': receiver_id, 'messages': [message]});
      return false;
    }
    else {
      return true;
    }
  }
}

function new_message(message_dict) {
  var display_message = false;
  if (message_dict.message_type == 'team') {
    display_message = true;
    push_message(message_dict);
  }
  else if (message_dict.message_type == 'private') {
    display_message = !push_message(message_dict);
  }
  if (display_message) {
    if (message_dict.sender_id == sender_id) {
      message_dict.sent = true;
      var template = Handlebars.compile(templates.sent_message_template);
    }
    else {
      message_dict.sent = false;
      var template = Handlebars.compile(templates.received_message_template);
    }

    var display_after_checking = false;
    if (chat_card.open && chat_card.message_type == message_dict.message_type) {
      if (chat_card.message_type == 'team') {
        display_after_checking = (chat_card.id == message_dict.receiver_id)
      }
      else if (chat_card.message_type == 'private') {
        display_after_checking = (chat_card.id == message_dict.sender_id && sender_id == message_dict.receiver_id) || (sender_id == message_dict.sender_id && chat_card.id == message_dict.receiver_id)
      }
    }
    display_after_checking
    ? document.querySelector('#messages').innerHTML += template({
      'sender_name': message_dict.sender_name,
      'message': message_dict.message,
      'datetime': message_dict.datetime
    })
    : notify_new_message(message_dict);
  }
  show_toasts();
}

function send_message(button) {
  const message_input = document.querySelector('#message');
  const socket = get_socket(button);
  const message_dict = {
    'message_type': button.dataset.message_type,
    'sender_id': sender_id,
    'message': message_input.value,
    'receiver_id': button.dataset.id
  };

  if (message_input.value != '') {
    if (button.dataset.message_type == 'team') {
      socket.socket_dict.socket.send(JSON.stringify(message_dict));
    }
    else if (button.dataset.message_type == 'private') {
      message_dict.tag = private_message_tag;
      socket.socket_dict.socket1.send(JSON.stringify(message_dict));
      socket.socket_dict.socket2.send(JSON.stringify(message_dict));
      private_message_tag++;
    }
    message_notifier_socket.send(JSON.stringify({
      'message_type': button.dataset.message_type,
      'sender_id': sender_id,
      'receiver_id': button.dataset.id
    }));
  }
  message_input.value = '';
  document.querySelector('#send-message').classList.add('disabled');
}

function get_socket(button) {
  if (button.dataset.message_type == 'team') {
    for (let i = 0, l = sockets_open.teams.length; i < l; i++) {
      if (sockets_open.teams[i].message_type == button.dataset.message_type && sockets_open.teams[i].sender_id == sender_id && sockets_open.teams[i].receiver_id == button.dataset.id) {
        return {'socket_dict': sockets_open.teams[i], 'index': i};
      }
    }
  }

  else if (button.dataset.message_type == 'private') {
    for (let i = 0, l = sockets_open.private.length; i < l; i++) {
      if (sockets_open.private[i].message_type == button.dataset.message_type && sockets_open.private[i].sender_id == sender_id && sockets_open.private[i].receiver_id == button.dataset.id) {
        return {'socket_dict': sockets_open.private[i], 'index': i};
      }
    }
  }

}

function close_socket(button) {
  const socket_dict = get_socket(button);
  if (button.dataset.message_type == 'team') {
    socket_dict.socket_dict.socket.close();
    sockets_open.teams.splice(socket_dict.index, 1);
  }
  else if (button.dataset.message_type == 'private') {
    socket_dict.socket_dict.socket1.close();
    socket_dict.socket_dict.socket2.close();
    sockets_open.private.splice(socket_dict.index, 1);
  }
}

function open_socket(button) {
  if (button.dataset.message_type == 'team') {
    const chatSocket = new WebSocket(
      `
      ws://${window.location.host}/ws/chat/${button.dataset.message_type}/${button.dataset.id}/
      `
    );
    sockets_open.teams.push({'message_type': button.dataset.message_type, 'sender_id': sender_id, 'receiver_id': button.dataset.id, 'socket': chatSocket});
  }
  else if (button.dataset.message_type == 'private') {
    const chatSocket1 = new WebSocket(
      `
      ws://${window.location.host}/ws/chat/${button.dataset.message_type}/${sender_id}/${button.dataset.id}/
      `
    );
    const chatSocket2 = new WebSocket(
      `
      ws://${window.location.host}/ws/chat/${button.dataset.message_type}/${button.dataset.id}/${sender_id}/
      `
    );
    sockets_open.private.push(
      {
        'message_type': button.dataset.message_type,
        'sender_id': sender_id,
        'receiver_id': button.dataset.id,
        'socket1': chatSocket1,
        'socket2': chatSocket2
      }
    );
  }

  add_socket_listeners(button);
}

function click_close_button(button) {
  document.querySelectorAll('#close-chat').forEach(close_button => {
    if (close_button.dataset.message_type == button.dataset.message_type && close_button.dataset.id == button.dataset.id) {
      close_button.click();
    }
  });
}

function add_socket_listeners(button) {
  const socket_dict = get_socket(button).socket_dict;

  if (button.dataset.message_type == 'team') {
    socket_dict.socket.onclose = () => { click_close_button(button); };
    socket_dict.socket.onmessage = event => { new_message(JSON.parse(event.data)); };
  }
  else if (button.dataset.message_type == 'private') {
    socket_dict.socket1.onclose = () => { click_close_button(button); };
    socket_dict.socket2.onclose = () => { click_close_button(button); };
    socket_dict.socket1.onmessage = event => { new_message(JSON.parse(event.data)); };
    socket_dict.socket2.onmessage = event => { new_message(JSON.parse(event.data)); };
  }
}

function opened_chat(button) {
  if (chat_card.open) {
    chat_card.button.classList.remove('active');

    chat_card.open = false;
    chat_card.message_type = null;
    chat_card.id = null;
    chat_card.name = null;
    chat_card.button == null;

    document.querySelector('.chat-container').style.height = '5%';
    document.querySelector('.chat-card').style.display = 'none';
    document.querySelector('.chat-card-footer').style.display = 'none';

    if (chat_card.button != button) {
      return opened_chat(button);
    }
  }
  else {
    chat_card.open = true;
    chat_card.message_type = button.dataset.message_type;
    chat_card.id = button.dataset.id;
    chat_card.name = button.dataset.name;
    chat_card.button = button;

    const chat_card_template = Handlebars.compile(templates.chat_card_template);
    const chat_card_footer_template = Handlebars.compile(templates.chat_card_footer_template);

    // If not open, check if messages exist
    var new_chat = true
    if (chat_card.message_type == 'team') {
      for (let i = 0, l = messages.teams.length; i < l; i++) {
        if (messages.teams[i].id == chat_card.id) {
          // Previous messages exist
          new_chat = false;
          document.querySelector('.chat-card').innerHTML = chat_card_template({'name': chat_card.name, 'messages': messages.teams[i].messages});
          document.querySelector('.chat-card-footer').innerHTML = chat_card_footer_template({'name': chat_card.name, 'id': chat_card.id, 'message_type': chat_card.message_type});
        }
      }

      if (new_chat) {
        // Get messages from the server
        var new_messages = [];
        messages.teams.push({'id': chat_card.id, 'messages': new_messages});
        document.querySelector('.chat-card').innerHTML = chat_card_template({'name': chat_card.name, 'messages': new_messages});
        document.querySelector('.chat-card-footer').innerHTML = chat_card_footer_template({'name': chat_card.name, 'id': chat_card.id, 'message_type': chat_card.message_type});
      }
    }
    else if (chat_card.message_type == 'private') {
      for (let i = 0, l = messages.private.length; i < l; i++) {
        if (messages.private[i].id == chat_card.id) {
          // Previous messages exist
          new_chat = false;
          document.querySelector('.chat-card').innerHTML = chat_card_template({'name': chat_card.name, 'messages': messages.private[i].messages});
          document.querySelector('.chat-card-footer').innerHTML = chat_card_footer_template({'name': chat_card.name, 'id': chat_card.id, 'message_type': chat_card.message_type});
        }
      }

      if (new_chat) {
        var new_messages = [];
        messages.private.push({'id': chat_card.id, 'messages': new_messages});
        document.querySelector('.chat-card').innerHTML = chat_card_template({'name': chat_card.name, 'messages': new_messages});
        document.querySelector('.chat-card-footer').innerHTML = chat_card_footer_template({'name': chat_card.name, 'id': chat_card.id, 'message_type': chat_card.message_type});
      }
    }
    add_listeners();
    document.querySelector('#send-message').classList.add('disabled');

    button.classList.remove('chat-btn-new-message');
    button.classList.add('active');
    document.querySelector('.chat-container').style.height = '65%';
    document.querySelector('.chat-card').style.display = 'block';
    document.querySelector('.chat-card-footer').style.display = 'block';
    show_toasts();
  }
}

export function search(query) {
  const request = new XMLHttpRequest();
  request.open('GET', `/search?query=${query}`);
  request.send();
  request.onload = () => {
    const data = JSON.parse(request.responseText);
    const teams_template = Handlebars.compile(templates.teams_display_teamplate);
    const coworkers_template = Handlebars.compile(templates.coworkers_display_template);

    document.querySelector('#teams-display').innerHTML = teams_template({'teams': data.teams});
    document.querySelector('#coworkers-display').innerHTML = coworkers_template({'employees': data.employees});
    initiate();
  }
}

function add_listeners() {
  document.querySelectorAll('#close-chat').forEach(button => {
    button.onclick = () => { close_chat(button); };
  });
  document.querySelectorAll('#opened-chat').forEach(button => {
    button.onclick = () => { opened_chat(button); };
  });
  document.querySelector('#send-message').onclick = function() {
    send_message(this);
  }
  document.querySelector('#message').onkeyup = function(e) {
    const send_button = document.querySelector('#send-message');
    if (this.value == '') {
      send_button.classList.add('disabled');
    }
    else {
      send_button.classList.remove('disabled')
      if (e.keyCode === 13) {
        send_button.click();
      }
    }
  }
}

function open_chat(button) {
  const message_type = button.dataset.message_type;
  if (message_type == 'team') {
    if (chats_open.teams.includes(button.dataset.id)) {
      return false;
    }
    else {
      var template = Handlebars.compile(templates.downward_team_chat_button_template);
      chats_open.teams.push(button.dataset.id);
    }
  }
  else if (message_type == 'private') {
    if (chats_open.private.includes(button.dataset.id)) {
      return false;
    }
    else {
      var template = Handlebars.compile(templates.downward_private_chat_button_template);
      chats_open.private.push(button.dataset.id);
    }
  }
  button.classList.remove('chat-btn-new-message');
  open_socket(button);
  get_messages(button);
  document.querySelector('#chat-buttons').innerHTML += template({'id': button.dataset.id, 'name': button.dataset.name});
  return true;
}

function close_chat(button) {
  const message_type = button.dataset.message_type;
  var remove_button = false;
  if (message_type == 'team') {
    if (chats_open.teams.includes(button.dataset.id)) {
      chats_open.teams.splice(chats_open.teams.indexOf(button.dataset.id), 1);
      remove_button = true;
    }
    else {
      return false;
    }
  }
  else if (message_type == 'private') {
    if (chats_open.private.includes(button.dataset.id)) {
      chats_open.private.splice(chats_open.private.indexOf(button.dataset.id), 1);
      remove_button = true;
    }
    else {
      return false;
    }
  }

  if (remove_button) {
    document.querySelectorAll('#opened-chat').forEach(open_chat => {
      if (open_chat.dataset.message_type == message_type && open_chat.dataset.id == button.dataset.id) {
        if (chat_card.open && chat_card.button == open_chat) {
          opened_chat(open_chat);
        }
        open_chat.remove();
        button.remove();
        close_socket(open_chat);
        remove_messages(open_chat);
      }
    });
  }
}

function add_notification_listeners() {
  document.querySelectorAll('#notification-close-button').forEach(button => {
    button.onclick = () => { button.parentNode.parentNode.remove(); }
  });
}

function notify_global_message(data) {
  document.querySelectorAll('#open_chat').forEach(button => {
    if (button.dataset.message_type == data.message_type) {

      var notify = false;

      if (data.message_type == 'team' && button.dataset.id == data.receiver_id) {
        var notification = `${data.sender_name} sent a message in ${data.receiver_name}.`;
        notify = true;
        button.classList.add('chat-btn-new-message');
      }
      else if (data.message_type == 'private' && button.dataset.id == data.sender_id) {
        var notification = `${data.sender_name} sent you a message.`;
        notify = true;
        button.classList.add('chat-btn-new-message');
      }
      if (notify) {
        document.querySelector('#notifications').insertAdjacentHTML('afterbegin',
          Handlebars.compile(templates.notification_toast_template)({'notification': notification})
        );
        show_toasts();
        add_notification_listeners();
      }

    }
  });
}

function add_message_notifier_socket_listeners() {
  message_notifier_socket.onmessage = event => {
    const data = JSON.parse(event.data);
    if (!(data.sender_id == sender_id)) {
      notify_global_message(data)
    }
  }
}

function initiate() {
  document.querySelector('#search-bar').onkeyup = function() { search(this.value); };
  document.querySelectorAll('#open_chat').forEach(button => {
    button.onclick = function() {
      if (open_chat(this)) {
        add_listeners();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initiate();
  add_message_notifier_socket_listeners();
});
