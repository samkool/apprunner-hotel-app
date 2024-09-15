const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const config = require('./config');

function initDynamoDBClient() {
  const configPromise = require('./config');

  return configPromise.then((config) => {
    console.log('Config loaded:', config);
    if(!config.infra.region) {
      throw new Error('AWS_REGION environment variable must be set. This is usually set by Fargate');
    }
    console.log('Application launched in: ', config.infra.region);
    
    const client = new DynamoDBClient({ region: config.infra.region });
    return DynamoDBDocumentClient.from(client);
  });
}

module.exports = { initDynamoDBClient };
