'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
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
  // fetch todo from the database
  dynamoDb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: jsonResponseHeader,
        body: 'Couldn\'t fetch the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: jsonResponseHeader,
      body: JSON.stringify(result.Item),
    };
    callback(null, response);
  });
};
