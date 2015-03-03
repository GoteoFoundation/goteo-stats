# Goteo Statistics

## Prerequisites

This project assumes you are using Mac OS X with [XCode][xcode] and
[homebrew][brew] installed and configured correctly, but installation will
comfortably work on other platforms with minor command alterations.

Lets first check your system is OK, running brew doctor will help you

    brew doctor

This project requires [Node.js][nodejs] to build and [nginx][nginx] to serve the
application.

    brew install node nginx

You'll need to install node package [bower][bower] globally which is uses to
maintain third-party component dependencies.

    npm install --global bower protractor karma-cli

## Installation

Assuming you have [Node.js][nodejs] and [bower][bower]
installed you are ready to clone and install the project.


#### Clone the project

    $ git clone git@github.com:agonzalezdiez/goteoAPIViz.git
    $ cd ./goteoAPIViz

#### Install

    $ make setup

## Development

Now you have the application successfully installed, you want to make a change,
right.

Run [gulp][gulp], which will [lint][lint-wiki] and pre-compile the application
on file changes and make them available via [localhost:3000](http://localhost:3000):

    $ make

## Building

There is a [gulp][gulp] task that will build the application for deploying on
HTTP web servers run:

    $ gulp build

## License

Copyright 2015 Outliers Collective

[nodejs]:http://nodejs.org/
[bower]:http://bower.io/
[brew]:http://brew.sh/
[xcode]:https://developer.apple.com/xcode/
[gulp]:http://gulpjs.com/
[lint-wiki]:http://en.wikipedia.org/wiki/Lint_(software)
[nginx]:http://nginx.com