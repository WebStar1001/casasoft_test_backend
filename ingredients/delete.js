'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.INGREDIENT_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };
  const jsonResponseHeader = {
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
    "X-Requested-With": "*",
    "Content-Type": "application/json"
  };
  // delete the todo from the database
  dynamoDb.delete(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: jsonResponseHeader,
        body: 'Couldn\'t remove the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: jsonResponseHeader,
      body: JSON.stringify({}),
    };
    callback(null, response);
  });
};
