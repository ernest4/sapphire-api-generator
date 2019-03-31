# Sapphire

Node.js [Express](https://www.npmjs.com/package/express) REST*like* API generator.

Where Rails and Sails fails, Sapphire prevails!

Convention over configuration? Why choose?! Welcome to the configurable convention!

* If Rails is too constrictive but Express is too open ended then this is the framework for you.

* If you want to generate boilerplate so you can focus on development, but still have the fully power to do anything at any time, this is the framework for you.

* If you’re a newbie, starting out and want to build web apps quickly I’d advise Rails. Solid MVC fundamentals will do you well!

* If you know what MVC is and appreciate Rails, but want the speed and power of Node.js with the niceties of Rails, this is the framework for you.


<!-- need to set up the badges later WIP WIP WIP...
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Linux Build][travis-image]][travis-url]
[![Windows Build][appveyor-image]][appveyor-url]
[![NPM](https://nodei.co/npm/<package>.png)](https://nodei.co/npm/<package>/) -->

## Installation

```sh
$ npm install -g sapphire-api-generator
```

## Quick Start

The quickest way to get started with sapphire is to utilize the executable `sapphire` to generate an application as shown below:

Create the app:

```bash
$ sapphire init my_api
```

Install dependencies:

```bash
$ cd my_api
$ npm install
```

Start your Express.js app at `http://localhost:3000/`:

```bash
$ npm start
```

You can go to `http://localhost:3000/ping` to check if the api is working.

Generate the first asset:

```bash
$ sapphire generate user
```

Generate 100 dummy users for testing:

```bash
$ sapphire seed user 100
```

You can go to `http://localhost:3000/api/v1/user` to check if the api is working and get all users.


## Command Line Options

This generator can also be further configured with the following command line flags.

        --version        output the version number
        --no-git         don't add a git repo
        --heroku         add a heroku Procfile
    -h, --help           output usage information

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/express-generator.svg
[npm-url]: https://npmjs.org/package/express-generator
[travis-image]: https://img.shields.io/travis/expressjs/generator/master.svg?label=linux
[travis-url]: https://travis-ci.org/expressjs/generator
[appveyor-image]: https://img.shields.io/appveyor/ci/dougwilson/generator/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/dougwilson/generator
[downloads-image]: https://img.shields.io/npm/dm/express-generator.svg
[downloads-url]: https://npmjs.org/package/express-generator
