# Node API CLI

Node Api CLI makes it easy to create an application that already works, with user session control with JwT and access and CRUDs logging, and using SendGrid as the default email send manager.

Currently with bank configuration ready only for MongoDB through Mongoose.

Already follows the best API practices in Node Js!

This facilitator has an extension to the [VS Code](https://code.visualstudio.com/) of name [Snippets node-api-cli](https://marketplace.visualstudio.com/items?itemName=snippets-node-api-cli.snippets-node-api-cli), to further assist in maintaining your application.

## Install

1. Open the terminal and point to the project's destination folder;
2. Execute in the terminal:

```bash
npm install -g yo generator-node-api-cli
```

3. And with that the node-api-cli will be available for use running:

```bash
yo node-api-cli
```

## Available options

When executing the initial command "yo node-api-cli" you can choose one of the options below:

- `Create new API project with MongoDB`: which creates a default design structure API on NodeJs using MongoDB;
- `Create new Entity with MongoDB`: which creates a model, control, repository and default route of the entity using MongoDB;
- `Create New Route`: which creates a default project route API in NodeJs;
- `Create New Controller`: which creates a default project control API on NodeJs;
- `Create new Repository with Mongoose`: which creates a standard repository of the API project on NodeJs using MongoDB through Mongoose;
- `Create new Mongoose Template`: which creates a default project template API on NodeJs using MongoDB via Mongoose;
