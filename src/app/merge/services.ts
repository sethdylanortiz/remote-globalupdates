"use server";
import { redirect } from "next/navigation"; // https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function
import useTraverseTree from "./Hooks/use-traverse-tree";

export type TreeData = { parentId: number, name: string, id: number, fileValue: string | null }
export type TreeDataEdited = { id: number, name: string, devFileValue: string }

import { getJSONData, getCurrentLiveJSONData } from "../glabal_services/globalservices";
import { getLiveVersionDB, updateLiveVersionDB, writeJSONDataDB } from "../lib/dynamodb";
import { revalidatePath } from "next/cache"; // https://nextjs.org/docs/app/api-reference/functions/revalidatePath

// function to compare two tree's values
const compareTrees = async() => {

    // get development and live JSON from database
    const devJSON = await getJSONData(0, "Development");
    const liveJSON = await getCurrentLiveJSONData();

    const { getTreeData, markTree } = useTraverseTree();
    const devTreeData = getTreeData(devJSON); 
    const liveTreeData = getTreeData(liveJSON);
    // console.log("devTreeData: "); console.log(devTreeData);
    // console.log("liveTreeData: "); console.log(liveTreeData);

    // SYNCED: items that exist in both AND include differences
    var editedItems = new Array();
    devTreeData.map((devItem: TreeData) => {
        // find __id's that exist in both objs && contain differnce in entry
        let found_index = liveTreeData.findIndex((liveItem: TreeData) => liveItem.id === devItem.id);

        if(found_index !== -1 && liveTreeData[found_index].fileValue !== null
             && liveTreeData[found_index].fileValue !== devItem.fileValue)
        {
            // console.log("$ found_index, fileValue change: " + found_index);
            editedItems.push({
                id: devItem.id,
                __isFolder: false,
                devFileValue: devItem.fileValue,
                // for file renaming display
                devFileName: devItem.name,
            });
        }
        // check if edit is a folder rename
        else if(found_index !== -1 && liveTreeData[found_index].fileValue === null
            && liveTreeData[found_index].name !== devItem.name)
        {
            // console.log("$ found index folder rename: " + found_index);
            editedItems.push({
                id: devItem.id,
                __isFolder: true,
                devFolderName: devItem.name,
            });
        }
    });
    // console.log("editedItems: "); console.log(editedItems);

    // NEW: loop devTree and check if dne
    const addedItems = devTreeData.filter((item: TreeData) => {
        if(!liveTreeData.find(({ id }) => id == item.id))
            return item;
    });
    // console.log("addedItems: "); console.log(addedItems);

    // DELETE: loop liveTree and check if dne
    const deletedItems = liveTreeData.filter((item: TreeData) => {
        if(!devTreeData.find(({ id }) => id == item.id))
            return item;
    });
    // console.log("deletedItems: "); console.log(deletedItems);
    
    // else, return tree should contain differences: null

    // if no changes were made, return for no change display
    if(editedItems.length == 0 && addedItems.length == 0 && deletedItems.length == 0)
    {
        return -1;
    }

    // todo: change markTree() to send editedItems, addedItems, and deletedItems
    var differerenceTree = markTree(liveJSON, "Edited", editedItems)
    differerenceTree = markTree(differerenceTree, "Added", addedItems);
    differerenceTree = markTree(differerenceTree, "Deleted", deletedItems);

    // console.log(JSON.stringify(differerenceTree, null, 4));

    return differerenceTree;
};

const mergeTree = async() => {

    try{
        // get new highest version number
        const request = await getLiveVersionDB(1);
        const newHighestVersionNumber = Number(request.Item?.Entry) + 1;
        console.log("$ mergeTree() newHighestVersionNumber: " + newHighestVersionNumber);

        // get current development JSON from database to be merged
        const devJSON = await getJSONData(0, "Development");
        console.log("$ mergeTree() devJSON: "); console.log(devJSON);

        // create entry in live db, containing new highest version number JSON
        await writeJSONDataDB(newHighestVersionNumber, JSON.stringify(devJSON), "Live");

        // update current version number in db
        // aws database schema: keyValue, Key '0' (number) holds Live version (string)
        await updateLiveVersionDB(0, newHighestVersionNumber);

        // update highest version number in db
        // aws database schema: keyValue, Key '-1' (number) hold *Highest Live version (string)
        await updateLiveVersionDB(1, newHighestVersionNumber);

        revalidatePath("/merge");
    }catch(error){
        console.log("services.ts mergeTree() error: " + error);
        redirect("/404");
    };

};

export { compareTrees, mergeTree };