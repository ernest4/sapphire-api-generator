# Sapphire

Node.js [Express](https://www.npmjs.com/package/express) REST*like* SOA*like* API generator.

Where Rails and Sails fails, Sapphire prevails!

Convention over configuration? Why choose?! Welcome to the configurable convention!

* If Rails is too constrictive but Express is too open ended then this is the framework for you.

* If you want to generate boilerplate so you can focus on development, but still have the fully power to do anything at any time, this is the framework for you.

* If you’re a newbie, starting out and want to build web apps quickly I’d advise Rails. Solid MVC fundamentals will do you well, but note that you wont find 'fat' models here, but rather an SOA based architecture!

* If you know what MVC is and appreciate Rails, but want the speed and power of Node.js with the niceties of Rails, this is the framework for you.

*RESTlike because you're free to do what you want with your routes.*
*SOAlike because SOA by definition are over the network, however the services in sapphire don't have to be over the network - because you're free to do what you want with your services.*


<!-- 
need to set up the badges later WIP WIP WIP...

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
$ sapphire seed user --count 100
```

You can go to `http://localhost:3000/api/v1/user` to check if the api is working and get all users.


## Command Line Options

This generator can also be further configured with the following command line flags.

    -V, --version        output the version number
        --no-git         don't add a git repo
    -H, --heroku         add a heroku Procfile
    -h, --help           output usage information

## License

[MIT](LICENSE)
