/*
    FileName (pk): string
    entry: string
*/
// aws sdk v3
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, ScanCommand, DeleteCommand} from '@aws-sdk/lib-dynamodb';

const database_client = new DynamoDBClient({
    region: process.env.TABLE_REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
});

const doc_client = DynamoDBDocumentClient.from(database_client);

// method to GET all items [for display] - move to chunks
// what order does it get it in? will it mix materials + foods?
const getEntryDB = async(config) => {
    const tablename = config === "production"? process.env.TABLE_NAME_PRODUCTION : process.env.TABLE_NAME_DEVELOPMENT
    const params = {
        TableName: tablename
        // todo - add batch, by 5x entries at a time
    };

    // todo - add try catch here?
    // https://levelup.gitconnected.com/building-a-next-js-dynamodb-crud-app-4bb2afe0d2f6
    return doc_client.send(new ScanCommand(params));
}

const updateEntryDB = async(filename, newJSON, config) => {

    const tablename = (config === "production") ? process.env.TABLE_NAME_PRODUCTION : process.env.TABLE_NAME_DEVELOPMENT;
    const params = {
        TableName: tablename,
        Key: {
            FileName: filename
        },
        UpdateExpression: "SET entry = :p",
        ExpressionAttributeValues: {
            ":p": newJSON
        },
        ReturnValues: "ALL_NEW" // returns this string on completion
    };

    // todo - try catch here 
    // https://levelup.gitconnected.com/building-a-next-js-dynamodb-crud-app-4bb2afe0d2f6
    // try{
    //     const response = doc_client.send(new UpdateCommand(params));
    //     console.log("Success updating: " + filename + ", response: " + response);
    //     console.log("response: " + response);
    //     return;
    // }
    return doc_client.send(new UpdateCommand(params));
}

const deleteEntryDB = async(filename, config) => {

    const tablename = (config === "production") ? process.env.TABLE_NAME_PRODUCTION : process.env.TABLE_NAME_DEVELOPMENT;
    const params = {
        TableName: tablename,
        Key: {
            FileName: filename
        }
    };

    // todo - try catch here
    return doc_client.send(new DeleteCommand(params));
}

export { getEntryDB, updateEntryDB, deleteEntryDB }