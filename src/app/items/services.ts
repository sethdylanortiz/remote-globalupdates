"use server";
import { redirect } from "next/navigation"; // https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function
import { revalidatePath } from "next/cache"; // https://nextjs.org/docs/app/api-reference/functions/revalidatePath

// services
import { getItemsDB, updateEntryDB, deleteEntryDB, getItemDB, getFileNamesDB } from "../lib/dynamodb";

export type Item = {
    Filename: string,
    Entry: string
};
export type Items = Item[];

// send response to page.tsx - not <Entry> client component
const getDevelopmentItems = async() => {
    try{
        const items_dev_obj = await getItemsDB("development");
        return {entries_dev_arr: items_dev_obj.Items}
    }catch(error){
        console.log("services.ts getDevelopmentItems() error: " + error);
        redirect("/404");
    }
};

const getDevelopmentFilenames = async() => {
    try{
        const request = await getFileNamesDB();
        return request.Items ? request.Items : null;
    }catch(error){
        console.log("getDevelopmentFilenames() error: " + error);
        redirect("/404");
    };
};

const updateForm = async(curFilename_trim: string, newFilename_trim: string, curJSON_trim: string, newJSON_trim: string) => {
    console.log("services.tsx, updateForm(), curFilename_trim: " + curFilename_trim);
    console.log("services.tsx, updateForm(), newFilename_trim: " + newFilename_trim);

    if((curJSON_trim !== newJSON_trim) || (curFilename_trim !== newFilename_trim)){

        console.log("updateForm() change in JSON, curJSON_trim !== newJSON_trim");
        // update/create entry if differences are noticed
        try{
            // should we be updateing with trim?
            await updateEntryDB(newFilename_trim, newJSON_trim, "development");
            // console.log("Updated " + `${newJSON}` + "'s Item successfully!");
            revalidatePath("/items");
        }catch(error){
            console.log("error: " + error);
            redirect("/404");
        }
        // delete old entry if new filename was set
        if(curFilename_trim !== newFilename_trim && curFilename_trim !== "")
        {
            console.log("curFileName_trim !== newFileName_trim");
            try{
                await deleteEntryDB(curFilename_trim, "development");
                console.log("Deleted " + `${curFilename_trim}` + "'s Item successfully!");
                revalidatePath("/items");
            }catch(error){
                console.log("updateForm() error: " + error);
                redirect("/404");
            }
        }
    }
    else{
        console.log("updateForm() curJSON == newJSON, curFilename == newFilename, ignore call" + "\n\n" + 
        "updateForm() curJSON_trim: \n" + curJSON_trim + "\n\n" + 
        "updateForm() newJSON_trim: \n" + newJSON_trim);
    }
};

const deleteItem = async(filename: string) => {
    try{
        await deleteEntryDB(filename, "development");
        console.log("Deleted " + `${filename}` + "'s Item successfully!");
        revalidatePath("/items");
    }catch(error){
        console.log("deleteItem() error: " + error);
        redirect("/404");
    }
};

const doesItemExist = async(filename: string) => {
    try{
        const request = await getItemDB(filename);
        return request.Item ? true : false;
    }catch(error){
        console.log("doesItemExist() error: " + error);
        redirect("/404");
    }
};

const getEntry = async(filename: string) => {
    try{
        const request = await getItemDB(filename);
        return request.Item ? request.Item.Entry : redirect("/404");
    }catch(error){
        console.log("getEntry() error: " + error);
        redirect("/404");
    }
};

// display: block - take up whole width of screen and move things above/below - a <div> is diplsay block
// function to display/seperate entries db array into folders
const parseFilenames = async(items: Item[]) => {
    
        
    
};

export { getDevelopmentItems, updateForm, deleteItem, doesItemExist, getEntry, getDevelopmentFilenames };