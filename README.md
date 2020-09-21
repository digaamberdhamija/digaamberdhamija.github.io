# Final Project

Web Programming with Python and JavaScript

This is a co-working website for a company called Sky built only as the finalproject for CS50's Web Development with Python and JavaScript by Digaamber
Dhamija.

The basic structure of the website is as follows:
There are employees, which are basically the accounts registered on the website.
The employees can post text updates which will be visible to every other employee, and can make notes which will only be visible to them.
The employees can also come together to form teams, and the teams can come together and work on projects.

I have also made a chatting feature using which the employees can send messages within their teams, or chat privately with other employees.
This chat is facilitated using the Django Channels 2 Library, which in turn uses Redis as a channel layer(message broker).

For the installation of Django Channels 2, follow this link: https://channels.readthedocs.io/en/latest/installation.html
For the installation of Redis follow: https://channels.readthedocs.io/en/latest/topics/channel_layers.html

Another thing to note is that this is a single page application, and all of this is supported using the Handlebars JavaScript templating library.

See my demonstration video: https://youtu.be/TQvrU1JPZ_Y for more.


The content is as follows:
The folder sky (app) contains the static folder which has all of the SASS, CSS and JavaScript files.
I have also downloaded the bootstrap CSS and JavaScript files, and also the files of other libraries like: Handlebars, Cookies to prevent other web requests.

The same folder also contains other typical Django files, and the one to take note of is the consumers.py file and the routing.py file.

routing.py behaves just like urls.py, except that it redirects all of the Http requests to urls.py and takes in all the WebSocket requests and redirects them to the relevant consumers(Python Classes to facilitate the chat feature) in the consumers.py file.

There is also a routing.py file in project directory(finalproject_sky) which just behaves the same way as the urls.py file (as a wrapper for all lower level routing.py files).

The rest of the files are all the typical Django project files.

My details are as follows:
Name: Digaamber Dhamija
edX username: Digaamber
GitHub username: digaamberdhamija
Country: India
