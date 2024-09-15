/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var express = require('express');
var router = express.Router();
const { CreateTableCommand } = require("@aws-sdk/client-dynamodb");
const dynamodb = require('../dynamodb');

const configPromise = require('../config');

async function createDynamoDBTable(tableName) {
  const params = {
    TableName: tableName,
    KeySchema: [
      { AttributeName: "id", KeyType: "HASH" }
    ],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "N" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  const client = await dynamodb.initDynamoDBClient();
  return client.send(new CreateTableCommand(params));
}

configPromise.then((config) => {
  console.log('Config loaded:', config);
  router.get('/', async function(req, res, next) {
    try {
      await createDynamoDBTable(config.dynamodb.tableName);
      res.render('create', { menuTitle: config.app.hotel_name, tableName: config.dynamodb.tableName });
    } catch (error) {
      console.error('Error creating DynamoDB table:', error);
      next(error);
    }
  });
}).catch((error) => {
  console.error('Error loading config:', error);
});
module.exports = router;
