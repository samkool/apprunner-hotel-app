var config = {
    infra: {},
    app: {},
    dynamodb: {}
};

// Define a function to initialize the config
async function initializeConfig() {
    config.infra.region = process.env.AWS_REGION;
    config.app.hotel_param = process.env.HOTEL_NAME_PARAM;
    config.dynamodb.tableName = process.env.DYNAMODB_TABLE_NAME;

    // Await the retrieval of SSM parameter
    config.app.hotel_name = await retrieve_ssm_parameter(config.app.hotel_param);

    return config; // Return the fully loaded config
}

// Asynchronous function to retrieve SSM parameter
async function retrieve_ssm_parameter(parameter_name) {
    var AWS = require('aws-sdk');
    var client = new AWS.SSM({
        region: config.infra.region
    });

    try {
        const data = await client.getParameter({ Name: parameter_name }).promise();
        return data.Parameter.Value; // Return the parameter value
    } catch (err) {
        console.error("Error retrieving parameter:", err);
        throw err;
    }
}

// Export the config as a promise
module.exports = initializeConfig();
