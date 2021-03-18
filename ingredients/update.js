'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  const jsonResponseHeader = {
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
    "X-Requested-With": "*",
    "Content-Type": "application/json"
  };

  // validation
  if (typeof data.title !== 'string') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: jsonResponseHeader,
      body: 'Couldn\'t update the Ingredient item.',
    });
    return;
  }

  const params = {
    TableName: process.env.INGREDIENT_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#title': 'title'
    },
    ExpressionAttributeValues: {
      ':text': data.title,
      ':image': data.image,
      ':fat': data.fat,
      ':calories': data.calories,
      ':carbohydrates': data.carbohydrates,
    },
    UpdateExpression: 'SET #title = :text, image = :image, fat = :fat, calories = :calories, carbohydrates = :carbohydrates',
    ReturnValues: 'ALL_NEW',
  };

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: jsonResponseHeader,
        body: 'Couldn\'t fetch the Ingredient item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers : jsonResponseHeader,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
