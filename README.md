# [Sapphire](https://github.com/ernest4/sapphire-api-generator/wiki)

Node.js [Express](https://www.npmjs.com/package/express) REST*like* SOA*like* API generator for SPAs.

Convention over configuration? Why choose?! Welcome to the configurable convention!

* If Rails is too constrictive but Express is too open ended then this is the framework for you.

* If you want to generate boilerplate so you can focus on development, but still have the full power to do anything at any time, this is the framework for you.

* If you’re a newbie, starting out and want to build web apps quickly I’d advise Rails. Solid MVC fundamentals will do you well. Once you come back note that you wont find 'fat' models here, but an SOA based architecture!

* If you know what MVC is and appreciate Rails, but want the speed and power of Node.js, this is the framework for you.

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

## [Wiki](https://github.com/ernest4/sapphire-api-generator/wiki)

For more information about [Sapphire](https://github.com/ernest4/sapphire-api-generator/wiki/Sapphire), what it is, how it works and how to use it, please have a look at the [wiki](https://github.com/ernest4/sapphire-api-generator/wiki)!

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

* Mac
```bash
$ mongod --config /usr/local/etc/mongod.conf
```

* Ubuntu
```bash
$ sudo service mongod start
```

Generate the first **asset**:

```bash
$ sapphire generate user
```

Update the first **asset**:

```bash
$ sapphire update user name:string required , age:number default:24 , gender:string enum:"['m','f','o']" default:"'o'"
```

Run the tests:

```bash
$ npm run test
```

Generate **100 dummy users** for live manual testing and mocking model data:

```bash
$ sapphire seed user --count 100
```

Start your **Express.js app** at `http://localhost:3001/`:

```bash
$ npm run nodemon
```

You can go to `http://localhost:3001/ping` to check if the api is working.

You can go to `http://localhost:3001/api/v1/user` to **get all users**.


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
      delete|d <asset>               delete a database backed asset from your RESTlike api
      seed|s [options] <asset>       generate dummy data for chosen asset
      update|u <asset> [args...]     change the asset's model or add relationships to other models
      example|e [options] <project>  Bootstrap an example API with at least two related models
      
### Use cases
#### I want to [create](https://github.com/ernest4/sapphire-api-generator/wiki/Extras#-sapphire-init) a new sapphire project:
*NOTE: you may use the command line directly with params (left) or launch an interactive session (right).*
![Alt Text](https://media.giphy.com/media/llONu0r5u4pKkEutxC/giphy.gif)
![Alt Text](https://media.giphy.com/media/lT9fOcP6wusCp8l3aJ/giphy.gif)

    Usage: init|i [options] [app_name]


      initialize the base structure of your api:

      NOTE: you may run 'sapphire init' command with or without arguments.
      Without arguments an interactive session will be launched to guide you.


    Options:
      --no-git       don't add a git repo
      --no-intro     don't add the README.txt files which explain the directories
      --no-security  don't add security middleware
      --no-readme    don't add a README.md
      -p, --ping     add the /ping route for checking API status
      -H, --heroku   add a Heroku Procfile for deploying to Heroku
      -l, --logging  add logging middleware
      -i, --inline   generate the models within model.js file instead of separate schema.json

                     WARNING: if you inline you will not be able to use Sapphire
                     update command to update models' fields and/or create relations
                     between models as well as seed them with the seed command. If
                     you inline, it is now your responsibility to maintain the model
                     schema and any relations.

      -h, --help     output usage information
      
#### I want to [add](https://github.com/ernest4/sapphire-api-generator/wiki/Extras#-sapphire-generate) a new asset to my sapphire project:
 
    Usage: generate|g [options] <asset>

    generate a database backed asset for your RESTlike api

    Options:
      --apiv <version>  specify the api version under which to create the asset (WIP. COMING SOON)
      -m, --model       only generate a model for this asset
      -a, --auth        add authorization of routes
      -h, --help        output usage information
      
#### I want to seed an asset in my database:
 
    Usage: seed|s [options] <asset> [assets...]

    generate dummy data for chosen asset(s):

         EXAMPLE 1: generate dummy data for single asset

           $ sapphire seed user


         EXAMPLE 2: generate dummy data for single asset, define count

           $ sapphire seed user --count 10000


    Options:
      --apiv <version>  specify the api version under which to seed the asset (WIP. COMING SOON)
      -c, --count <count>  specify the number of instances of the asset
      -h, --help           output usage information
      
#### I want to [update](https://github.com/ernest4/sapphire-api-generator/wiki/Commands:-sapphire-update#-sapphire-update-testsasset) an existing assets model:
 
    Usage: update|u [options] <asset> [args...]

    change the asset's model, add relationships to other models and generate
    tests:

         EXAMPLE 1: change the asset's model, add relationships to other models

           $ sapphire update user name:string required:’Enter User name’ ,
             birthday:date , gender:string enum:"['male', 'female', 'other']"
             default:"'other'" , socialId:string required:"User must have
             unique social ID" unique , createDate:date default:Date.now ,
             hobbies:ref ref:hobby , friends:ref ref:user


         EXAMPLE 2: generate tests for the given asset after you modified its JSON
         schema

           $ sapphire update tests user


         EXAMPLE 3: generate tests for the given assets after you modified their JSON
         schema

           $ sapphire update tests user book library


         EXAMPLE 4: generate tests for all assets after you modified their JSON
         schema (this will regenerate all the tests from scratch)

           $ sapphire update tests all


    Options:
      --apiv <version>  specify the api version under which to update the asset (WIP. COMING SOON)
      -r, --rest  generate the routes, controller and services for existing model of asset (WIP. COMING SOON)
      -h, --help  output usage information
      
#### I want to delete an existing asset from my sapphire project:

    Usage: delete|d [options] <asset>

    delete a database backed asset from your RESTlike api

    Options:
      --apiv <version>  specify the api version under which to delete the asset (WIP. COMING SOON)
      -h, --help        output usage information
      
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

# [Feature road map](https://github.com/ernest4/sapphire-api-generator/wiki/Feature-Road-Map)

## Asset description language (ADL) for generate and update commands:

The vision is to be able to intuitively describe the asset and it’s fields, in effect, describe it’s model schema via english like description language.

#### Example update (*syntax subject to change*):

```bash
$ sapphire update user has name with first and last string required warning 'Enter User name' , has birthday date , has gender string enum possible male or female or other default other , has socialId string required warning 'User must have unique social ID' unique , has createdDate date default now , has many hobby
```

#### Should output (*NOTE: this is end object that mongoose will understand, the schemas in Sapphire will be stored in JSON and loaded in when server starts, unless the models are inlined*):

```javascript
let UserSchema = new mongoose.Schema(
 {
   name: {
     first: {
       type: String,
       required: [true, "Enter User name"]
     },
     last: {
       type: String,
       required: [true, "Enter User name"]
     }
   },
   birthday: {
     type: Date
   },
   gender: {
     type: String,
     enum: ["m", "f", "o"],
     default: ["o"]
   },
   socialId: {
     type: String,
     required: [true, "User must have unique social ID"],
     unique: true
   },
   createdDate: {
     type: Date,
     default: Date.now
   },
   hobbies: [{ type: mongoose.Schema.Types.ObjectId, ref: ‘Hobby’}],
 },
 {
   getters: true
 }
);
```

### It can be as verbose or terse as you like
The aim is to promote a fluid stream of though, the following examples are all equivalent, with the exception that the default warning message is overwritten in first command:

```
$ sapphire update user has a name with first and last of type string that is required with a warning 'Enter User name' if missing , …
```
#### Should output:

```javascript
// ... rest of schema here
name: {
  first: {
    type: String,
    required: [true, "Enter User name"]
   },
    last: {
      type: String,
      required: [true, "Enter User name"]
   }
},
// ... rest of schema here
```

```
$ sapphire update user has name with first and last string required warning , …
```

#### Should output:

```javascript
// ... rest of schema here
name: {
  first: {
    type: String,
    required: [true, "user name first required"]
   },
    last: {
      type: String,
      required: [true, "user name first required"]
   }
},
// ... rest of schema here
```

## Alternative technologies support: PostgreSQL, Restify, Fastify and [more](https://github.com/ernest4/sapphire-api-generator/wiki/Feature-Road-Map).

### Very, VERY far down into the future

Only once the core tech has been built and tested around Express Mongoose stack.


## License

[MIT](LICENSE)
