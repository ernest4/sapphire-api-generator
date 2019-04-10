"use strict";

function introSources(app_name, introFileName) {
  let introSources = [];

  const utilsIntroSource = `This folder is for utterly generic utility functions and classes which are not specific to web apps
in general. For e.g. a function milisToMinutes(miliseconds) which does time manipulation and has
nothing specific to do with Express or web apps in general, but may be used all over the app.
`;

  const sharedIntroSource = `Code that is broadly shared all throughout the web app shall go here. Even if the code is a once
off used in the app, if it doesn't really belong in services, models, controller etc. it shall go
here.
`;

  const controllerIntroSource = `Controllers extract the data from requests pass it services and return their responses to users.
Controllers get called by the routes handler.

The express context ends here, the services are generic functions that don't deal with 'requests' or
'bodies' of requests. The services deal with simple inputs that can be anything and are routing
framework agnostic.

Controllers are 'thin' and minimal.
`;

  const modelsIntroSource = `Models encapsulate the database information such as schemas, validations, indexes etc.
All of the models are imported into all.models.js and exported as a single function in server.js

Models will be accessed by services.

Models are 'thin' and minimal.
`;

  const routesIntroSource = `Routes tie together the URLs and controllers and any acompanying middleware such as authorization.
All of the routes are imported into all.routes.js and exported as a single function to wrap around
the app object in server.js

Routes are 'thin' and minimal.
`;

  const servicesIntroSource = `Services is where all the business log lives. Services are 'fat' and contain everything they need
to do their jobs. Initialized by controllers, Services ultimately respond back to controllers.
`;

  introSources.push({
    path: `${app_name}/_utils/${introFileName}`,
    source: utilsIntroSource
  });
  introSources.push({
    path: `${app_name}/api/shared/${introFileName}`,
    source: sharedIntroSource
  });
  introSources.push({
    path: `${app_name}/api/v1/controllers/${introFileName}`,
    source: controllerIntroSource
  });
  introSources.push({
    path: `${app_name}/api/v1/models/${introFileName}`,
    source: modelsIntroSource
  });
  introSources.push({
    path: `${app_name}/api/v1/routes/${introFileName}`,
    source: routesIntroSource
  });
  introSources.push({
    path: `${app_name}/api/v1/services/${introFileName}`,
    source: servicesIntroSource
  });

  return introSources;
}

module.exports = introSources;
