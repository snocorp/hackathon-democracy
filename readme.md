Democracy
=========

for hackathons
--------------

### Getting Started

* Clone the application from the git repository
* Install [mongodb](https://www.mongodb.org/) `sudo apt-get install mongodb`
* Install [node](http://nodejs.org/) `sudo apt-get install nodejs`
* Install [grunt-cli](http://gruntjs.com/) `npm install -g grunt-cli`
* Install [bower](http://bower.io/) `npm install -g bower`
* Install npm dependencies `npm install`
* Install bower dependencies `bower install`
* Run the server `grunt server`

### Configuration

Configuration is stored in a file called config.json at the root of the application. This is the list of parameters:

* mongo\_url: The URL of the mongo database (default 'mongodb://localhost/test')
* cookie\_secret: The session cookie secret key (default 'not very secret')
* smtp\_service: nodemailer SMTP service value ([options](https://github.com/andris9/nodemailer#well-known-services-for-smtp), default null)
* smtp\_user: the username for the SMTP service (default null)
* smtp\_password: the password for the SMTP service (default null)

Note that all smtp settings must be configured for mailing voter registrations.

In addition, the system can be started in development mode

`grunt server`

or in production mode

`grunt server:dist`