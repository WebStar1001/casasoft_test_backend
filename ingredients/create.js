'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
    const data = JSON.parse(event.body);
    const jsonResponseHeader = {
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
        "X-Requested-With": "*",
        "Content-Type": "application/json"
    };
    if (typeof data.title !== 'string') {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            headers: jsonResponseHeader,
            body: 'Couldn\'t create the todo item.',
        });
        return;
    }

    const params = {
        TableName: process.env.INGREDIENT_TABLE,
        Item: {
            id: uuid.v1(),
            title: data.title,
            image: data.image,
            fat: data.fat,
            calories: data.calories,
            carbohydrates : data.carbohydrates
        },
    };

    // write the todo to the database
    dynamoDb.put(params, (error) => {
        // handle potential errors
        if (error) {
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: jsonResponseHeader,
                body: 'Couldn\'t create the todo item.',
            });
            return;
        }
        // create a response
        const response = {
            statusCode: 200,
            headers: jsonResponseHeader,
            body: JSON.stringify(params.Item),
        };
        callback(null, response);
    });
};
