export const downward_team_chat_button_template =
`
<button id="opened-chat" type="button" class="btn btn-outline-light chat-btn" data-id="{{ id }}" data-message_type="team" data-name="{{ name }}">
  {{ name }}
  <button id="close-chat" type="button" class="close chat-btn-close" data-id="{{ id }}" data-message_type="team">
    <span class="">&times;</span>
  </button>
</button>
`

export const downward_private_chat_button_template =
`
<button id="opened-chat" type="button" class="btn btn-outline-light chat-btn" data-id="{{ id }}" data-message_type="private" data-name="{{ name }}">
  {{ name }}
  <button id="close-chat" type="button" class="close chat-btn-close" data-id="{{ id }}" data-message_type="private">
    <span class="">&times;</span>
  </button>
</button>
`

export const chat_card_template =
`
<div class="card-header chat-card-header">
  {{ name }}
</div>
<div id="messages" class="card-body">
<br/><br/>

  {{#each messages}}
      {{#if this.sent }}
        <div class="toast chat-message sent-message" data-autohide="false">
          <div class="toast-header sent-message-header">
            <strong class="mr-auto">You</strong>
            <small>{{ this.datetime }}</small>
          </div>
          <div class="toast-body sent-message-body">
            {{ this.message }}
          </div>
        </div>
      {{ else }}
        <div class="toast chat-message" data-autohide="false">
          <div class="toast-header received-message-header">
            <strong class="mr-auto">{{ this.sender_name }}</strong>
            <small>{{ this.datetime }}</small>
          </div>
          <div class="toast-body received-message-body">
            {{ this.message }}
          </div>
        </div>
      {{/if}}
  {{/each}}
</div>
`

export const chat_card_footer_template =
`
<div class="input-group mb-3">
  <input id="message" type="text" class="form-control" placeholder="Send a message" data-message_type="{{ message_type }}" data-id=="{{ id }}" data-name="{{ name }}">
  <div class="input-group-append">
    <button id="send-message" type="button" class="btn btn-outline-light send-btn" data-message_type="{{ message_type }}" data-id="{{ id }}" data-name="{{ name }}">
      Send
    </button>
  </div>
</div>
`

export const sent_message_template =
`
<div class="container">
  <div class="toast chat-message sent-message" data-autohide="false">
    <div class="toast-header sent-message-header">
      <strong class="mr-auto">You</strong>
      <small>{{ datetime }}</small>
    </div>
    <div class="toast-body sent-message-body">
      {{ message }}
    </div>
  </div>
</div>
`

export const received_message_template =
`
<div class="container">
  <div class="toast chat-message" data-autohide="false">
    <div class="toast-header received-message-header">
      <strong class="mr-auto">{{ sender_name }}</strong>
      <small>{{ datetime }}</small>
    </div>
    <div class="toast-body received-message-body">
      {{ message }}
    </div>
  </div>
</div>
`

export const teams_display_teamplate =
`
{{#each teams}}
  <li class="nav-item chat-navbar-item">
    <button id="open_chat" class="btn btn-block btn-outline-light chat-navbar-btn" data-message_type="team" data-id="{{ this.id }}" data-name="{{ this.name }}">
      {{ this.name }}
    </button>
  </li>
{{ else }}
  <p class="chat-navbar-message">You are not a part of any such team.</p>
{{/each}}
`

export const coworkers_display_template =
`
{{#each employees}}
  <li class="nav-item chat-navbar-item">
    <button id="open_chat" class="btn btn-block btn-outline-light chat-navbar-btn" data-message_type="private" data-id="{{ this.id }}" data-name="{{ this.username }}">
      {{ this.username }}
    </button>
  </li>
{{ else }}
  <p class="chat-navbar-message">You do not have any such coworkers.</p>
{{/each}}
`

export const posts_template =
`
{{#each posts}}
  <div id="post" class="jumbotron main-content-post-jumbotron" data-id="{{ this.id }}">
    <p class="main-content-post-title-text">
      {{ this.title }}
      {{#if this.delete}}
        <button id="delete-post-button" type="button" class="btn btn-outline-dark btn-sm post-delete-btn" data-id="{{ this.id }}">delete</button>
      {{/if}}
    </p>
    {{#each this.text}}
      <p class="main-content-post-text">
        {{ this }}
      </p>
    {{/each}}
    <p class=" main-content-post-information-text">
      posted by
      {{#if this.delete}}
        you
      {{ else}}
        {{ this.uploader }}
      {{/if}}
       on {{ this.datetime }}
    </p>
  </div>
{{ else }}
  {{#if searched}}
    <p class="main-content-text">no such posts found.</p>
  {{ else }}
    <p class="main-content-text">no posts found.</p>
  {{/if}}
{{/each}}
`

export const main_content_title_template =
`
<div class="jumbotron main-content-title-jumbotron">
  <div class="main-content-title">{{ title }}</div>
  <div class="main-content-title-text">{{ text }}</div>
</div>
`

export const feed_template =
`
<form id="new-post-form">
  <div class="form-group">
    <input id="new-post-title" type="text" class="form-control" placeholder="add a title" required>
    <textarea id="new-post-text" class="form-control" placeholder="share something with your coworkers" required></textarea>
  </div>
  <button type="submit" class="btn btn-outline-dark btn-sm btn-block main-content-btn">upload</button>
</form>
<br>
<form>
  <div class="form-group">
    <input type="text" class="form-control" id="search-posts" placeholder="search posts">
  </div>
</form>

<div id="posts"></div>
<br>
`

export const teams_buttons_template =
`
<button type="button" class="btn btn-outline-dark btn-sm btn-block main-content-btn" data-toggle="collapse" data-target="#new-team-collapse">
  create new team
</button>
`

export const new_team_template =
`
<div id="new-team-collapse" class="collapse">
  <div id="select-coworkers-jumbotron" class="jumbotron main-content-post-jumbotron">
    <form id="new-team-form">
      <div class="form-group">
        <div class="teams-selected-coworkers-text" style="text-align: center;"><strong>enter team name: </strong></div>
        <input id="new-team-name" type="text" class="form-control" placeholder="enter team name" required>
      </div>
      <div class="form-group">
        <div class="teams-selected-coworkers-text" style="text-align: center;"><strong>select coworkers: </strong></div>
        <input id="search-coworkers" type="text" class="form-control" placeholder="search for coworkers">
      </div>
      <div class="teams-selected-coworkers-text">
        <strong>selected coworkers: </strong>
        <span id="selected-coworkers-display"></span>
      </div>
      <br>
      <div id="new-team-coworkers" class="container teams-button-container"></div>
      <button type="submit" class="btn btn-outline-dark btn-sm btn-block main-content-btn">create team</button>
    </form>
    <br>
  </div>
</div>
`

export const new_team_coworkers_template =
`
{{#each coworkers}}
  <div class="row">
    {{#each this}}
      <div class="col-md-4">
        {{#if this.selected }}
          <button id="select-coworker-button" type="button" class="btn btn-outline-dark btn-sm btn-block active main-content-btn" data-id="{{ this.id }}" data-username="{{ this.username }}">
            {{ this.username }}
          </button>
        {{else}}
          <button id="select-coworker-button" type="button" class="btn btn-outline-dark btn-sm btn-block main-content-btn" data-id="{{ this.id }}" data-username="{{ this.username }}">
            {{ this.username }}
          </button>
        {{/if}}
      </div>
    {{/each}}
  </div>
  <br>
{{ else }}
  <p class="teams-selected-coworkers-text">No such coworkers found.</p>
{{/each}}
`

export const all_teams_display_template =
`
<br>
<form>
  <div class="form-group">
    <input id="search-teams" type="text" class="form-control" placeholder="search for teams">
  </div>
</form>
<div class="main-content-teams-title">my teams</div>
<div id="teams-my-teams-display"></div>
<br>
<div class="main-content-teams-title">other teams</div>
<div id="teams-other-teams-display"></div>
`

export const my_teams_template =
`
<br>
<div class="accordion" id="my-teams-accordian">
  <div class="list-group">
    {{#each teams}}
      <button class="list-group-item list-group-item-action collapsed main-content-teams-list-group-item" type="button" data-toggle="collapse" data-target="#my-team-{{ this.name }}">
        {{ this.name }}
      </button>

      <div id="my-team-{{ this.name }}" class="collapse" data-parent="#my-teams-accordian">
        <div class="jumbotron main-content-teams-jumbotron">
          <strong>members: </strong>
          {{ this.member_str }}
        </div>
      </div>
    {{else}}
      {{#if searched}}
        <p class="teams-selected-coworkers-text" style="text-align: center;">you are not a part of any such team.</p>
      {{ else }}
        <p class="teams-selected-coworkers-text" style="text-align: center;">you are not a part of any team.</p>
      {{/if}}
    {{/each}}

  </div>
</div>
`

export const other_teams_template =
`
<br>
<div class="accordion" id="other-teams-accordian">
  <div class="list-group">
    {{#each teams }}
      <button class="list-group-item list-group-item-action collapsed main-content-teams-list-group-item" type="button" data-toggle="collapse" data-target="#other-team-{{ this.name }}">
        {{ this.name }}
      </button>

      <div id="other-team-{{ this.name }}" class="collapse" data-parent="#other-teams-accordian">
        <div class="jumbotron main-content-teams-jumbotron">
          <strong>members: </strong>
          {{ this.member_str }}
        </div>
      </div>
    {{else}}
      {{#if searched}}
        <p class="teams-selected-coworkers-text" style="text-align: center;">no such team found.</p>
      {{ else }}
        <p class="teams-selected-coworkers-text" style="text-align: center;">you are a part of every team.</p>
      {{/if}}
    {{/each}}
  </div>
</div>
<br><br><br>
`

export const new_note_template =
`
<form id="new-note-form">
  <div class="form-group">
    <input id="new-note-title" type="text" class="form-control" placeholder="add a title" required>
    <textarea id="new-note-text" class="form-control" placeholder="add text" required></textarea>
  </div>
  <button type="submit" class="btn btn-outline-dark btn-sm btn-block main-content-btn">save note</button>
</form>
<br>
<form>
  <div class="form-group">
    <input id="search-notes" type="text" class="form-control" placeholder="search notes">
  </div>
</form>
<div class="main-content-teams-title">your notes</div>
<br>
<div id="notes-display"></div>
<br><br>
`

export const notes_display_template =
`
<div class="container teams-button-container">
  {{#each notes}}
    <div class="row">
      {{#each this }}
        <div class="col-md-6">
          <div class="jumbotron main-content-post-jumbotron">
            <p class="main-content-post-title-text">
              {{ this.title }}
              <button id="delete-note-button" type="button" class="btn btn-outline-dark btn-sm post-delete-btn" data-id="{{ this.id }}">delete</button>
            </p>
            <p class="main-content-post-text">
              {{ this.text }}
            </p>
            <p class=" main-content-post-information-text">
              saved by you on {{ this.datetime }}
            </p>
          </div>
        </div>
        {{/each}}
    </div>
  {{else}}
    {{#if searched}}
      <p class="teams-selected-coworkers-text" style="text-align: center;">you have not saved any such notes.</p>
    {{ else }}
      <p class="teams-selected-coworkers-text" style="text-align: center;">you have not saved any notes.</p>
    {{/if}}
  {{/each}}
</div>
`

export const profile_display_template =
`
<div class="profile-username-display-text">
  {{ username }}
</div>
<br>
<button type="button" class="btn btn-outline-dark btn-sm btn-block main-content-btn" data-toggle="collapse" data-target="#account-settings">
  account settings
</button>

<div id="account-settings" class="collapse">
  <br>
  <div class="accordion" id="account-settings-accordian">
    <div class="list-group">
        <button class="list-group-item list-group-item-action collapsed main-content-teams-list-group-item" type="button" data-toggle="collapse" data-target="#change-username">
          change username
        </button>

        <div id="change-username" class="collapse" data-parent="#account-settings-accordian">
          <div class="jumbotron main-content-teams-jumbotron">
            <form action="/change_username/" method="post">
              ${Handlebars.compile(document.querySelector('head').dataset.csrf_token)()}
              <div class="form-group">
                <input type="text" class="form-control" id="new-username" placeholder="enter new username" name="new_username" required>
              </div>
              <button type="submit" class="btn btn-outline-dark btn-sm btn-block main-content-btn">change username</button>
            </form>
          </div>
        </div>

        <button class="list-group-item list-group-item-action collapsed main-content-teams-list-group-item" type="button" data-toggle="collapse" data-target="#change-password">
          change password
        </button>

        <div id="change-password" class="collapse" data-parent="#account-settings-accordian">
          <div class="jumbotron main-content-teams-jumbotron">
            <form action="/change_password/" method="post">
              ${Handlebars.compile(document.querySelector('head').dataset.csrf_token)()}
              <div class="form-group">
                <input type="password" class="form-control" id="current-password" placeholder="enter current password" name="current_password" required>
              </div>
              <div class="form-group">
                <input type="password" class="form-control" id="new-password" placeholder="enter new password" name="new_password" required>
              </div>
              <div class="form-group">
                <input type="password" class="form-control" id="confirm-new-password" placeholder="confirm new password" name="confirm_new_password" required>
              </div>
              <button type="submit" class="btn btn-outline-dark btn-sm btn-block main-content-btn">change password</button>
            </form>
          </div>
        </div>
    </div>
  </div>
</div>
<br>
`

export const my_posts_template =
`
<form>
  <div class="form-group">
    <input type="text" class="form-control" id="search-my-posts" placeholder="search your posts">
  </div>
</form>
<div class="main-content-teams-title">your posts</div>
<br>
<div id="my-posts"></div>
<br>
`

export const my_posts_display_template =
`
{{#each posts}}
  <div id="my-post" class="jumbotron main-content-post-jumbotron" data-id="{{ this.id }}">
    <p class="main-content-post-title-text">
      {{ this.title }}
      <button id="delete-my-post-button" type="button" class="btn btn-outline-dark btn-sm post-delete-btn" data-id="{{ this.id }}">delete</button>
    </p>
    {{#each this.text }}
      <p class="main-content-post-text">{{ this }}</p>
    {{/each}}
    <p class=" main-content-post-information-text">
      posted by you on {{ this.datetime }}
    </p>
  </div>
{{ else }}
  {{#if searched}}
    <p class="main-content-text">no such posts found.</p>
  {{ else }}
    <p class="main-content-text">you have not posted anything yet.</p>
  {{/if}}
{{/each}}
`

export const projects_template =
`
<button type="button" class="btn btn-outline-dark btn-sm btn-block main-content-btn" data-toggle="collapse" data-target="#new-project-collapse">
  start new project
</button>

<div id="new-project-collapse" class="collapse">
  <div id="select-coworkers-jumbotron" class="jumbotron main-content-post-jumbotron">

    <form id="new-project-form">

      <div class="form-group">
        <div class="teams-selected-coworkers-text" style="text-align: center;"><strong>enter project name </strong></div>
        <input id="new-project-name" type="text" class="form-control" placeholder="enter project name" required>
      </div>

      <div class="form-group">
        <div class="teams-selected-coworkers-text" style="text-align: center;"><strong>enter project description </strong></div>
        <textarea id="new-project-description" class="form-control" placeholder="enter project description" required></textarea>
      </div>

      <div class="form-group">
        <div class="teams-selected-coworkers-text" style="text-align: center;"><strong>select teams </strong></div>
        <input id="search-teams" type="text" class="form-control" placeholder="search for teams">
      </div>

      <div class="teams-selected-coworkers-text">
        <strong>selected teams: </strong>
        <span id="selected-teams-display"></span>
      </div>

      <div class="teams-selected-coworkers-text" style="text-align: center;"><strong>my teams</strong></div>
      <div id="new-project-my-teams" class="container teams-button-container"></div>

      <div class="teams-selected-coworkers-text" style="text-align: center;"><strong>other teams</strong></div>
      <div id="new-project-other-teams" class="container teams-button-container"></div>

      <button type="submit" class="btn btn-outline-dark btn-sm btn-block main-content-btn">start project</button>

    </form>
    <br>
  </div>
</div>

<br>
<form>
  <div class="form-group">
    <input id="search-projects" type="text" class="form-control" placeholder="search projects">
  </div>
</form>

<div class="main-content-teams-title">my projects</div>
<div id="my-projects-display"></div>

<br>
<div class="main-content-teams-title">other projects</div>
<div id="other-projects-display"></div>
<br><br>
`

export const new_project_my_teams_template =
`
{{#each teams}}
  <div class="row">
    {{#each this}}
      <div class="col-md-4">
        {{#if this.selected }}
          <button id="select-team-button" type="button" class="btn btn-outline-dark btn-sm btn-block active main-content-btn" data-id="{{ this.id }}" data-name="{{ this.name }}" data-team_type="my_teams">
            {{ this.name }}
          </button>
        {{else}}
          <button id="select-team-button" type="button" class="btn btn-outline-dark btn-sm btn-block main-content-btn" data-id="{{ this.id }}" data-name="{{ this.name }}" data-team_type="my_teams">
            {{ this.name }}
          </button>
        {{/if}}
      </div>
    {{/each}}
  </div>
  <br>
{{ else }}
  {{#if searched }}
    <p class="teams-selected-coworkers-text" style="text-align: center;">you are not a part of any such team.</p>
  {{else }}
    <p class="teams-selected-coworkers-text" style="text-align: center;">you are not a part of any team.</p>
  {{/if}}
{{/each}}
`

export const new_project_other_teams_template =
`
{{#each teams}}
  <div class="row">
    {{#each this}}
      <div class="col-md-4">
        {{#if this.selected }}
          <button id="select-team-button" type="button" class="btn btn-outline-dark btn-sm btn-block active main-content-btn" data-id="{{ this.id }}" data-name="{{ this.name }}" data-team_type="other_teams">
            {{ this.name }}
          </button>
        {{else}}
          <button id="select-team-button" type="button" class="btn btn-outline-dark btn-sm btn-block main-content-btn" data-id="{{ this.id }}" data-name="{{ this.name }}" data-team_type="other_teams">
            {{ this.name }}
          </button>
        {{/if}}
      </div>
    {{/each}}
  </div>
  <br>
{{ else }}
  {{#if searched }}
    <p class="teams-selected-coworkers-text" style="text-align: center;">no such teams found.</p>
  {{else }}
    <p class="teams-selected-coworkers-text" style="text-align: center;">you are a part of every team.</p>
  {{/if}}
{{/each}}
`

export const my_projects_template =
`
<br>
<div class="accordion" id="my-projects-accordian">
  <div class="list-group">
    {{#each projects}}
      <button class="list-group-item list-group-item-action collapsed main-content-teams-list-group-item" type="button" data-toggle="collapse" data-target="#my-projects-{{ this.id }}">
        {{ this.title }}
      </button>

      <div id="my-projects-{{ this.id }}" class="collapse" data-parent="#my-projects-accordian">
        <div class="jumbotron main-content-teams-jumbotron">
          <strong>project status: </strong>
          {{ this.status }}
          <br>

          <strong>
            {{#if this.open }}
              teams currently working on this project:
            {{ else }}
              teams who worked on this project:
            {{/if}}
          </strong>

          {{ this.teams_str }}

          <br><br>
          <strong>project description</strong>
          <br>
          {{#each this.description}}
            {{ this }}
            <br>
          {{/each}}

          <br>
          <button id="view-project-button" type="button" class="btn btn-outline-dark btn-sm btn-block main-content-btn" data-id="{{ this.id }}">
            view project
          </button>

        </div>
      </div>
    {{else}}
      {{#if searched}}
        <p class="teams-selected-coworkers-text" style="text-align: center;">no such projects found.</p>
      {{ else }}
        <p class="teams-selected-coworkers-text" style="text-align: center;">no projects found.</p>
      {{/if}}
    {{/each}}

  </div>
</div>
`

export const other_projects_template =
`
<br>
<div class="accordion" id="other-projects-accordian">
  <div class="list-group">
    {{#each projects}}
      <button class="list-group-item list-group-item-action collapsed main-content-teams-list-group-item" type="button" data-toggle="collapse" data-target="#other-projects-{{ this.id }}">
        {{ this.title }}
      </button>

      <div id="other-projects-{{ this.id }}" class="collapse" data-parent="#other-projects-accordian">
        <div class="jumbotron main-content-teams-jumbotron">
          <strong>project status: </strong>
          {{ this.status }}
          <br>

          <strong>
            {{#if this.open }}
              teams currently working on this project:
            {{ else }}
              teams who worked on this project:
            {{/if}}
          </strong>

          {{ this.teams_str }}

          <br><br>
          <strong>project description</strong>
          <br>
          {{#each this.description}}
            {{ this }}
            <br>
          {{/each}}

        </div>
      </div>
    {{else}}
      {{#if searched}}
        <p class="teams-selected-coworkers-text" style="text-align: center;">no such projects found.</p>
      {{ else }}
        <p class="teams-selected-coworkers-text" style="text-align: center;">no projects found.</p>
      {{/if}}
    {{/each}}

  </div>
</div>
`

export const view_project_template =
`
<div class="jumbotron main-content-title-jumbotron">
  <div class="view-project-title">project: {{ title }}</div>
  <div class="view-project-title-text">started by {{ starter }} on {{ datetime }}</div>
</div>

<div id="view-project-info" class="jumbotron main-content-post-jumbotron view-project-info-jumbotron" data-id="{{ id }}">

  <strong>project status: </strong>
  {{ project_status }}
  <br>

  <strong>
    {{#if open }}
      teams currently working on this project:
    {{ else }}
      teams who worked on this project:
    {{/if}}
  </strong>

  {{ teams_str }}

  <br><br>
  <strong>project description</strong>
  <br>
  {{#each description}}
    {{ this }}
    <br>
  {{/each}}
  <br>
</div>

<div class="jumbotron main-content-post-jumbotron">
  <div class="view-project-updates-title">updates</div>
  <br>

  {{#if open}}
    <form id="add-update-form">
      <div class="form-group">
        <input id="view-project-add-update" type="text" class="form-control" placeholder="add an update" required>
      </div>
      <button type="submit" class="btn btn-outline-dark btn-sm btn-block main-content-btn">add update</button>
    </form>
    <br>
  {{/if}}

  <div id="view-project-updates"></div>

</div>
<button id="project-change-status-button" type="button" class="btn btn-outline-dark btn-sm btn-block main-content-btn" data-id="{{ this.id }}">
  {{#if open }}
    close project
  {{else}}
    reopen project
  {{/if}}
</button>
<br><br>
`

export const view_project_updates_template =
`
{{#each updates}}
  <p class="view-project-update-text">- <strong>{{ this.update }}</strong> <br>(added by {{ this.uploader }} on {{ this.datetime }})</p>
{{else}}
  <p class="teams-selected-coworkers-text" style="text-align: center;">there are no updates to show.</p>
{{/each}}
`

export const notification_toast_template =
`
<div class="toast notification-toast" role="alert" data-autohide="false">
  <div class="toast-body notification-toast-body">
    <button id="notification-close-button" type="button" class="ml-2 mb-1 close text-white" data-dismiss="toast">
      <span>&times;</span>
    </button>
    {{ notification }}
  </div>
</div>
`
