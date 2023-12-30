/*
    filename (pk): string
    entry: string
*/
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
    };

    return doc_client.send(new ScanCommand(params));
}

export { getEntryDB }