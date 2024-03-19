"use server";
import { DynamoDBClient, ReturnValue } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, ScanCommand, DeleteCommand} from '@aws-sdk/lib-dynamodb';

const database_client = new DynamoDBClient({
    region: process.env.TABLE_REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
});
const doc_client = DynamoDBDocumentClient.from(database_client);

// for user credential login
const getUserDB = (email, password) => {
// const getUserDB = async(email, password) => {
/*
✓ Compiled in 300ms (1199 modules)
    dynamodb.js, reqeust: 
    {
        '$metadata': {
            httpStatusCode: 200,
            requestId: 'AN4G5ST9O4VU75J1MUUJL364N3VV4KQNSO5AEMVJF66Q9ASUAAJG',
            extendedRequestId: undefined,
            cfId: undefined,
            attempts: 1,
            totalRetryDelay: 0
        }
    }
✓ Compiled in 243ms (1199 modules)
    dynamodb.js, reqeust:
    {
        '$metadata': {
            httpStatusCode: 200,
            requestId: 'MTHL3GFO7T2Q6V62OCP6PT4HJVVV4KQNSO5AEMVJF66Q9ASUAAJG',
            extendedRequestId: undefined,
            cfId: undefined,
            attempts: 1,
            totalRetryDelay: 0
        },
        Item: { email: 'robloxdontyoucare@gmail.com', password: 'Pizza1001' }
    }
*/

    const params = {
        TableName: process.env.TABLE_NAME_CREDENTIALS,
        Key: {
            email: email,
            password: password
        }
    };

    return doc_client.send(new GetCommand(params));
    // const request = await doc_client.send(new GetCommand(params));
    // console.log("dynamodb.js, request: ");
    // console.log(request);
    // request.Item? console.log("found!: " + request.Item) : console.log("account not found");
}; 

const getLiveVersionDB = (version) => {
    
    // aws database schema: Key '0' (number) holds Live version (string)
    // aws database schema: Key '-1' (number) hold *Highest Live version (string)
    const params = {
        TableName: process.env.TABLE_NAME_LIVE_VERSIONING,
        Key: {
            Version: version
        }
    };

    return doc_client.send(new GetCommand(params));
};

// for versioning page
const getConfigVersionsDB = () => {
    const params = {
        TableName: process.env.TABLE_NAME_LIVE_VERSIONING
    };
    return doc_client.send(new ScanCommand(params));
};

const getJSONDataDB = (version, type) => {

    const table = type == "Live" ? process.env.TABLE_NAME_LIVE_VERSIONING : process.env.TABLE_NAME_DEVELOPMENT;

    const params = {
        TableName: table,
        Key: {
            Version: version
        }
    };

    return doc_client.send(new GetCommand(params));
};

const writeJSONDataDB = (version, entry, tableType) => {
    
    const table = tableType === "Live" ? process.env.TABLE_NAME_LIVE_VERSIONING
        : process.env.TABLE_NAME_DEVELOPMENT

    const params = {
        TableName: table,
        Key: {
            Version: version
        },
        UpdateExpression: "SET Entry = :p",
        ExpressionAttributeValues: {
            ":p": entry
        },
        ReturnValues: "ALL_NEW"
    };

    return doc_client.send(new UpdateCommand(params));
}

const updateLiveVersionDB = (versionKey, newVersion) => {
    
    // aws database schema: keyValue, Key '0' (number) holds Live version (string)
    // aws database schema: keyValue, Key '-1' (number) hold *Highest Live version (string)
    const params = {
        TableName: process.env.TABLE_NAME_LIVE_VERSIONING,
        Key: {
            Version: versionKey
        },
        UpdateExpression: "SET Entry = :p",
        ExpressionAttributeValues: {
            ":p": newVersion
        },
        ReturnValues: "ALL_NEW"
    };

    return doc_client.send(new UpdateCommand(params));
};

export { getUserDB, getConfigVersionsDB, getLiveVersionDB,
     getJSONDataDB, writeJSONDataDB, updateLiveVersionDB }