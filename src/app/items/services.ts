"use server";
import { redirect } from "next/navigation"; // https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function
import { revalidatePath } from "next/cache"; // https://nextjs.org/docs/app/api-reference/functions/revalidatePath

// services
import { getJSONDataDB, writeJSONDataDB } from "../lib/dynamodb";
import useTraverseTree from "./Hooks/use-traverse-tree"; 
import { getVersion } from "../glabal_services/globalservices";

const getDevelopmentJSONData = async(table: string) => {
    try{
        // get current version - if Live is requested, getCurrentLiveVersion
        const versionNumber = table == "Live" ? await getVersion(): 0;

        const request = await getJSONDataDB(versionNumber, table);
        // console.log("getDevelopmentJSONData(), request: "); console.log(request);
        
        return request.Item ? JSON.parse(request.Item.Entry) : redirect("/404");
    }catch(error){
        console.log("services.ts getDevelopmentJSONData() error: " + error);
        redirect("/404");
    };
};

// todo: add addition to head __id value to avoid uuid()
const addDevelopmentJSON = async({parentId, newItemName, newItemValue, isFolder}:
    {parentId: number, newItemName: string, newItemValue: string, isFolder: boolean}) => {

    try{
        // get current version
        const versionNumber = await getVersion();

        // get current entire json (next.js cache)
        const getDBrequest = await getJSONDataDB(versionNumber);
        const json_dev = JSON.parse(getDBrequest.Item?.Entry); // returns type string

        // add passed sub-json to current json
        const { insertNode } = useTraverseTree();
        const updatedTree = insertNode(json_dev, parentId, newItemName, newItemValue, isFolder);

        // write to new db
        console.log("updatedTree: "); console.log(JSON.stringify(updatedTree, null, 4));
        // await writeJSONDataDB(versionNumber + 1, JSON.stringify(updatedTree));

        revalidatePath("/testingpage");
    }catch(error){
        console.log("services.ts addDevelopmentJSON() error: " + error);
        redirect("/404");
    }
};

const deleteDevelopmentJSON = async({id}: {id: number}) => {

    try{
        // get current version
        const versionNumber = await getVersion();

        // get current entire json (next.js cache)
        const getDBrequest = await getJSONDataDB(versionNumber);
        const json_dev = JSON.parse(getDBrequest.Item?.Entry); // returns type string

        // add passed sub-json to current json
        const { deleteNode } = useTraverseTree();
        const updatedTree = deleteNode(json_dev, id);

        // write to new db
        console.log("updatedTree: "); console.log(JSON.stringify(updatedTree, null, 4));
        // await writeJSONDataDB(versionNumber + 1, JSON.stringify(updatedTree));

        revalidatePath("/testingpage");
    }catch(error){
        console.log("services.ts deleteDevelopmentJSONData() error: " + error);
        redirect("/404");
    }
};

const editDevelopmentJSON = async({id, newItemName, newItemValue}:
     {id: number, newItemName: string, newItemValue?: string}) => {

    console.log("editDevelopmentJSON, newname: " + newItemName);
    console.log("editDevelopmentJSON, newItemValue: " + newItemValue);

    try{
        // get current version
        const versionNumber = await getVersion();

        // get current entire json (next.js cache)
        const getDBrequest = await getJSONDataDB(versionNumber);
        const json_dev = JSON.parse(getDBrequest.Item?.Entry); // returns type string

        // add passed sub-json to current json
        const { editNode } = useTraverseTree();
        const updatedTree = editNode(json_dev, id, newItemName, newItemValue);

        // write to new db
        console.log("updatedTree: "); console.log(JSON.stringify(updatedTree, null, 4));
        // await writeJSONDataDB(versionNumber + 1, JSON.stringify(updatedTree));

        revalidatePath("/testingpage");
    }catch(error){
        console.log("services.ts editDevelopmentJSON() error: " + error);
        redirect("/404");
    }
}

export { getDevelopmentJSONData, addDevelopmentJSON, deleteDevelopmentJSON, editDevelopmentJSON };