'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
AWS.config.update({
  region: "us-east-1",
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: process.env.INGREDIENT_TABLE,
};

module.exports.list = (event, context, callback) => {
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todos.',
      });
      return;
    }

    const jsonResponseHeader = {
      "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
      "X-Requested-With": "*",
      "Content-Type": "application/json"
    };

    // create a response
    const response = {
      statusCode: 200,
      headers: jsonResponseHeader,
      body: JSON.stringify(result.Items)
    };
    callback(null, response);
  });
};
