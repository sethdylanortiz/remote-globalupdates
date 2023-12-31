/*
    filename (pk): string
    entry: string
*/
"use server";
// aws sdk v3
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, ScanCommand} from '@aws-sdk/lib-dynamodb';

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
const getEntryDB = async() => {

    console.log("\n" + "dynamodb.js - inside getEntryDB()");

    const params = {
        TableName: process.env.TABLE_NAME_DEVELOPMENT
        // todo - add batch, by 5x entries at a time
    };

    // todo - add try catch here
    // https://levelup.gitconnected.com/building-a-next-js-dynamodb-crud-app-4bb2afe0d2f6
    return doc_client.send(new ScanCommand(params));
}

const updateEntryDB = async(filename, newJSON) => {
    console.log("\n" + "dynamodb.js - inside updateEntryDB()");
    console.log("dynamodb.js - filename: " + filename);
    console.log("dynamodb.js - newJSON: " + newJSON);

    const params = {
        TableName: process.env.TABLE_NAME_DEVELOPMENT,
        Key: {
            FileName: filename
        },
        UpdateExpression: "SET FileName = :p",
        ExpressionAttributeValues: {
            ":p": newJSON // needs JSON.stringify(newJSON, null, 4)?
        },
        ReturnValues: `UPDATED_JSON ${filename}` // returns this string on completion
    }

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

export { getEntryDB, updateEntryDB }