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

const updateDevelopmentJSONData = async({parent, newItemName, isFolder}:
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
        console.log("services.ts updateDevelopmentJSONData() error: " + error);
        redirect("/404");
    }
};

export { getDevelopmentJSONData, updateDevelopmentJSONData };

// {
//     "name": "rootdir",
//     "__isFolder": true,
//     "__items": [
//         {
//             "name": "food items",
//             "__isFolder": true,
//             "__items": [
//             {
//                 "name": "prices",
//                 "__isFolder": true,
//                 "__items":[
//                 {
//                     "name": "apple",
//                     "__isFolder": false,
//                     "__items": [],
//                     "__value": 
//                     {
//                         "person": "John",
//                         "age": 30,
//                         "car": 100
//                     }
//                 }]
//             }]
//         },
//         {
//             "name": "stats",
//             "__isFolder": true,
//             "__items": [
//                 {
//                     "name": "apple",
//                     "__isFolder": false,
//                     "__items": [],
//                     "__value": 
//                     {
//                         "person": "John",
//                         "age": 30,
//                         "car": 100
//                     }
//                 },
//                 {
//                     "name": "steak",
//                     "__isFolder": false,
//                     "__items": [],
//                     "__value": 
//                     {
//                         "person": "John",
//                         "age": 30,
//                         "car": 100
//                     }
//                 }
//             ]
//         },
//     {
//         "name": "changelog",
//         "__isFolder": false,
//         "__items": [],
//         "__value":
//         {
//             "person": "John",
//             "age": 30,
//             "car": 100
//         }
//     }
//     ]
// }