"use server";
import { redirect } from "next/navigation"; // https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function
import { revalidatePath } from "next/cache"; // https://nextjs.org/docs/app/api-reference/functions/revalidatePath

// services
import { getJSONDataDB, writeJSONDataDB } from "../lib/dynamodb";
import useTraverseTree from "./Hooks/use-traverse-tree"; 

const getDevelopmentJSONData = async() => {
    try{
        const request = await getJSONDataDB(0);
        // console.log("getDevelopmentJSONData(), request: "); console.log(request);
        
        return request.Item ? JSON.parse(request.Item.Entry) : redirect("/404");
    }catch(error){
        console.log("services.ts getDevelopmentJSONData() error: " + error);
        redirect("/404");
    };
};

const updateDevelopmentJSON = async({parent, newItemName, isFolder}:
    {parent: string, newItemName: string, isFolder: boolean}) => {

    try{
        // get current entire json (next.js cache)
        const getDBrequest = await getJSONDataDB(0);
        const json_dev = JSON.parse(getDBrequest.Item?.Entry); // returns type string

        // add passed sub-json to current json
        const { insertNode } = useTraverseTree();
        const updatedTree = insertNode(json_dev, parent, newItemName, isFolder);

        // write to new db
        console.log("updatedTree: "); console.log(JSON.stringify(updatedTree, null, 4));
        await writeJSONDataDB(0, JSON.stringify(updatedTree));

        revalidatePath("/testingpage");
    }catch(error){
        console.log("services.ts updateDevelopmentJSON() error: " + error);
        redirect("/404");
    }
};

const deleteDevelopmentJSON = async({id}: {id: number}) => {

    try{
        // get current entire json (next.js cache)
        const getDBrequest = await getJSONDataDB(0);
        const json_dev = JSON.parse(getDBrequest.Item?.Entry); // returns type string

        // add passed sub-json to current json
        const { deleteNode } = useTraverseTree();
        const updatedTree = deleteNode(json_dev, id);

        // write to new db
        console.log("updatedTree: "); console.log(JSON.stringify(updatedTree, null, 4));
        await writeJSONDataDB(0, JSON.stringify(updatedTree));

        revalidatePath("/testingpage");
    }catch(error){
        console.log("services.ts updateDevelopmentJSONData() error: " + error);
        redirect("/404");
    }
};

const renameDevelopmentJSON = async({id, newname}: {id: number, newname: string}) => {

    console.log("renameDevelopmentJSON, newname: " + newname);

    try{
        // get current entire json (next.js cache)
        const getDBrequest = await getJSONDataDB(0);
        const json_dev = JSON.parse(getDBrequest.Item?.Entry); // returns type string

        // add passed sub-json to current json
        const { renameNode } = useTraverseTree();
        const updatedTree = renameNode(json_dev, id, newname);

        // write to new db
        console.log("updatedTree: "); console.log(JSON.stringify(updatedTree, null, 4));
        // await writeJSONDataDB(0, JSON.stringify(updatedTree));

        revalidatePath("/testingpage");
    }catch(error){
        console.log("services.ts updateDevelopmentJSONData() error: " + error);
        redirect("/404");
    }
}

export { getDevelopmentJSONData, updateDevelopmentJSON, deleteDevelopmentJSON, renameDevelopmentJSON };

/*
todo: 
    - remove "values": since we now have "__isFolder"?

{
    "name": "rootdir",
    "__id": 100,
    "__isFolder": true,
    "__items": [
        {
            "name": "food items",
            "__id": 1,
            "__isFolder": true,
            "__items": [
                {
                    "name": "prices",
                    "__id": 2,
                    "__isFolder": true,
                    "__items": [
                        {
                            "name": "apple",
                            "__id": 3,
                            "__isFolder": false,
                            "__items": [],
                            "__value": {
                                "person": "John",
                                "age": 30,
                                "car": 100
                            }
                        }
                    ]
                }
            ]
        },
        {
            "name": "stats",
            "__id": 65,
            "__isFolder": true,
            "__items": [
                {
                    "name": "new folder testing",
                    "__id": 5,
                    "__isFolder": true,
                    "__items": []
                },
                {
                    "name": "apple",
                    "__id": 6,
                    "__isFolder": false,
                    "__items": [],
                    "__value": {
                        "person": "John",
                        "age": 30,
                        "car": 100
                    }
                },
                {
                    "name": "steak",
                    "__id": 7,
                    "__isFolder": false,
                    "__items": [],
                    "__value": {
                        "person": "John",
                        "age": 30,
                        "car": 100
                    }
                }
            ]
        },
        {
            "name": "changelog",
            "__id": 8,
            "__isFolder": false,
            "__items": [],
            "__value": {
                "person": "John",
                "age": 30,
                "car": 100
            }
        }
    ]
}
*/