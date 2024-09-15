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
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");
const dynamodb = require('../dynamodb');

const configPromise = require('../config');

configPromise.then((config) => {
    console.log('Config loaded:', config);
    /* display room list */
    router.get('/', async function(req, res, next) {
      try {
        const client = await dynamodb.initDynamoDBClient();
        const params = {
          TableName: config.dynamodb.tableName
        };
        
        const data = await client.send(new ScanCommand(params));
        
        if (data.Items) {
          res.render('room-list', { 
            title: 'Room List', 
            menuTitle: config.app.hotel_name, 
            tableName: config.dynamodb.tableName, 
            rooms: data.Items
          });
          console.log('displayed %d rooms', data.Items.length);
        }
      } catch (err) {
        console.error("Error retrieving rooms:", err);
        next(err);
      }
    });
  }).catch((error) => {
    console.error('Error loading config:', error);
  });
module.exports = router;
