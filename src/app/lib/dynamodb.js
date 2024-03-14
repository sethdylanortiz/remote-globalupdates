/*
aws sdk v3
    Filename (pk): string
    Entry: string
*/
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

// todo: clean up these returns
export { getConfigVersionsDB, getLiveVersionDB,
     getJSONDataDB, writeJSONDataDB, updateLiveVersionDB }