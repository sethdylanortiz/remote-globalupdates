/*
aws sdk v3
    FileName (pk): string
    entry: string
*/
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
const getEntryDB = (config) => {
    const tablename = config === "production"? process.env.TABLE_NAME_PRODUCTION : process.env.TABLE_NAME_DEVELOPMENT
    const params = {
        TableName: tablename
        // todo - add batch, by 5x entries at a time
    };

    return doc_client.send(new ScanCommand(params));
}

const updateEntryDB = (filename, newJSON, config) => {

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

    return doc_client.send(new UpdateCommand(params));
}

const deleteEntryDB = (filename, config) => {

    const tablename = (config === "production") ? process.env.TABLE_NAME_PRODUCTION : process.env.TABLE_NAME_DEVELOPMENT;
    const params = {
        TableName: tablename,
        Key: {
            FileName: filename
        }
    };

    return doc_client.send(new DeleteCommand(params));
};

const getLiveVersionDB = () => {
    const params = {
        TableName: process.env.TABLE_NAME_PRODUCTION,
        Key: {
            FileName: "VERSION"
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

const updateConfigVersionsDB = (new_version, new_config) => {
    const params = {
        TableName: process.env.TABLE_NAME_LIVE_VERSIONING,
        Item: {
            Version: new_version,
            Item: new_config
        }
    };

    return doc_client.send(new PutCommand(params));
};

export { getEntryDB, updateEntryDB, deleteEntryDB, getConfigVersionsDB,
     updateConfigVersionsDB, getLiveVersionDB }