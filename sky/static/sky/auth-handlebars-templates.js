export const auth_template =
`
<div class="jumbotron auth-jumbotron signup-jumbotron" id="auth-box">
  <h2 class="sky-logo">Sky</h2>
  <br/><br/><br/><br/><br/><br/><br/><br/><br/>
  <p align="center">
    <button class="btn btn-outline-light btn-block btn-sm auth-btn" data-button="login">Login</button>
  </p>
  <p align="center">
    Don't have an account?<br/>
    <button class="btn btn-outline-light btn-block btn-sm auth-btn" data-button="signup">Signup</button>
  </p>
  <p align="center">
    Wanna know more?<br/>
    <button class="btn btn-outline-light btn-block btn-sm auth-btn" data-button="about">About Sky</button>
  </p>
</div>
`


export const signup_template =
`
<div class="jumbotron auth-jumbotron signup-jumbotron" id="auth-box">
  <h2 class="sky-logo">Sky</h2>

  <h5>Signup</h5>
  <form action="${document.querySelector('head').dataset.signup_url}", method="post">
    ${Handlebars.compile(document.querySelector('head').dataset.csrf_token)()}
    <div class="form-group">
      <input type="email" class="form-control" placeholder="Email" name="email" required>
      <small class="form-text">We'll never share your email with anyone else.</small>
    </div>
    <div class="form-group">
      <input type="text" class="form-control" placeholder="Full name" name="name" required>
    </div>
    <div class="form-group">
      <input type="text" class="form-control" placeholder="Username" name="username" required>
      <small class="form-text">Your username will be required when you login.</small>
    </div>
    <div class="form-group">
      <input type="password" class="form-control" placeholder="Password" name="password" required>
    </div>
    <div class="form-group">
      <input type="password" class="form-control" placeholder="Confirm password" name="confirm_password" required>
    </div>

    <br/>
    <button type="submit" class="btn btn-outline-light btn-block auth-btn" data-button="signup-submit">Signup</button>
    <button type="button" class="btn btn-outline-light btn-block auth-btn" data-button="back">Go back</button>
  </form>
</div>
`

export const login_template =
`
<div class="jumbotron auth-jumbotron signup-jumbotron" id="auth-box">
  <h2 class="sky-logo">Sky</h2>

  <h5>Login</h5>
  <form action="${document.querySelector('head').dataset.login_url}" method="post">
    ${Handlebars.compile(document.querySelector('head').dataset.csrf_token)()}
    <div class="form-group">
      <input type="text" class="form-control" placeholder="Username" name="username" required>
    </div>
    <div class="form-group">
      <input type="password" class="form-control" placeholder="Password" name="password" required>
    </div>

    <br/>
    <button type="submit" class="btn btn-outline-light btn-block auth-btn" data-button="login-submit">Login</button>
    <button type="button" class="btn btn-outline-light btn-block auth-btn" data-button="back">Go back</button>
  </form>
</div>
`

export const about_template =
`
<div class="jumbotron auth-jumbotron signup-jumbotron" id="auth-box">
  <h2 class="sky-logo">Sky</h2>

  <h5>About</h5>
  <p style="text-align: justify;">
    This website is a coworking website for a company called Sky only built
    as the final project for the edX course: CS50's Web Development with Python and JavaScript by Digaamber Dhamija.
  </p>
  <br><br>
  <p style="text-align: center;">
    Details<br>
    Name: Digaamber Dhamija<br>
    edX username: Digaamber<br>
    GitHub username: digaamberdhamija<br>
    Country: India<br>
  </p>
  <br>
  <button type="button" class="btn btn-outline-light btn-block auth-btn" data-button="back">Go back</button>
</div>
`
