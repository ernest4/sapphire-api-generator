# Sapphire

Node.js [Express](https://www.npmjs.com/package/express) REST*like* SOA*like* API generator for SPAs.

Where Rails and Sails fails, Sapphire prevails!

Convention over configuration? Why choose?! Welcome to the configurable convention!

* If Rails is too constrictive but Express is too open ended then this is the framework for you.

* If you want to generate boilerplate so you can focus on development, but still have the full power to do anything at any time, this is the framework for you.

* If you’re a newbie, starting out and want to build web apps quickly I’d advise Rails. Solid MVC fundamentals will do you well. Once you come back note that you wont find 'fat' models here, but an SOA based architecture!

* If you know what MVC is and appreciate Rails, but want the speed and power of Node.js with the niceties of Rails, this is the framework for you.

**All feedback wellcome, I want this tool to be the best tool it can be!**

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

The quickest way to get started with sapphire is to utilize the executable `sapphire` to generate an api:

Create the **app**:

```bash
$ sapphire init my_api
```

Install **dependencies**:

```bash
$ cd my_api
$ npm install
```

Make sure [MongoDB is installed](https://docs.mongodb.com/v3.2/administration/install-community/).
Run the **Mongo database** before launching the server:

* #### Mac
```bash
$ mongod --config /usr/local/etc/mongod.conf
```

* #### Ubuntu
```bash
$ sudo service mongod start
```

Start your **Express.js app** at `http://localhost:3001/`:

```bash
$ npm run nodemon
```

You can go to (GET) `http://localhost:3001/ping` to check if the api is working.

Generate the first **asset**:

```bash
$ sapphire generate user
```

Generate **100 dummy users** for testing:

```bash
$ sapphire seed user --count 100
```

You can go to `http://localhost:3001/api/v1/user` to check if the api is working and **get all users**.


## Command Line Options

This generator can also be further configured with the following command line flags.

### Main commands
    
    Usage: sapphire [options] [command]

    Options:
      -V, --version                  output the version number
      -h, --help                     output usage information

    Commands:
      init|i [options] <app_name>    initialize the base structure of your api
      generate|g [options] <asset>   generate a database backed asset for your RESTlike api
      seed|s [options] <asset>       generate dummy data for chosen asset
      update|u <asset> [args...]     change the asset's model or add relationships to other models
      example|e [options] <project>  Bootstrap an example API with at least two related models
      
### Use cases
#### I want to create a new sapphire project:
![Alt Text](https://media.giphy.com/media/Urslb7oSSeRpRKs8MW/giphy.gif)

    Usage: init|i [options] <app_name>

    initialize the base structure of your api

    Options:
      --no-git       don't add a git repo
      --no-intro     don't add the _intro.txt files which explain the directories
      --no-security  don't add security middleware
      --no-readme    don't add a README.md
      --no-ping      don't add the /ping route for checking API status
      -H, --heroku   add a Heroku Procfile for deploying to Heroku
      -a, --auth     add authorization of routes
      -l, --logging  add logging middleware
      -h, --help     output usage information
      
 #### I want to add a new asset to my sapphire project:
 
    Usage: generate|g [options] <asset>

    generate a database backed asset for your RESTlike api

    Options:
      --apiv <version>  specify the api version under which to create the asset
      -h, --help               output usage information
      
 #### I want to update an existing assets model (WIP. COMING SOON):
 
    Usage: update|u [options] <asset> [args...]

    change the asset's model or add relationships to other models:

      RELATIONSHIP: [one to many]: asset1 has many asset2

        EXAMPLE 1: one author has many books.

        $ sapphire update author has many book

      RELATIONSHIP: [many to many]: asset1 many to many asset2

        EXAMPLE 2: An editor has worked on many articles and an article can have many editors.

        $ sapphire update editor many to many article

        EXAMPLE 3: alternatively, you may define relationships one by one.

        $ sapphire update editor has many article
        $ sapphire update article has many editor


    Options:
      -h, --help  output usage information
      
#### I want a complete example (WIP. COMING SOON):

    Usage: example|e [options] <project>

    Bootstrap an example API with at least two related models:

      RELATIONSHIP: [one to many]: asset1 has many asset2

        EXAMPLE 1: Will create an api for tasks and todos, where each task has a list of todos.

        $ sapphire example todos

      RELATIONSHIP: [many to many]: asset1 many to many asset2

        EXAMPLE 2: Will create an api for customers and items, where each customer has many
                  items in their basket, but an item can belong to many customers too.

        $ sapphire example shoppers


    Options:
      -a, --auth  add authorization for the example
      -h, --help  output usage information

## License

[MIT](LICENSE)
