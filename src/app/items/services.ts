"use server";
import { redirect } from "next/navigation"; // https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function
import { revalidatePath } from "next/cache"; // https://nextjs.org/docs/app/api-reference/functions/revalidatePath

// services
import { getEntryDB, updateEntryDB, deleteEntryDB } from "../lib/dynamodb";
/*
to-do:
    - add try catch
    - add redirect
    - change schema to Filename, Entry
*/
export type Item = {
    FileName: string,
    entry: string
};
export type Items = Item[];

// send response to page.tsx - not <Entry> client component
const getDevelopmentItems = async() => {
    try{
        const items_dev_obj = await getEntryDB("development");
        return {entries_dev_obj: items_dev_obj}
    }catch(error){
        console.log("services.ts getDevelopmentItems() error: " + error);
        redirect("/404");
    }
};

const updateForm = async(curFileName: string, newFilename: string, curJSON: string, newJSON: string) => {

    // to-do: what happens if value contains a " "?
    const [curFileName_trim, newFileName_trim] = [curFileName.trim(), newFilename.trim()];
    const [curJSON_trim, newJSON_trim] = [curJSON.replace(/\s/g,""), newJSON.replace(/\s/g,"")];
    console.log("SERVICES.TSX, UPDATEFORM, newFileName_trim: " + newFileName_trim);
    console.log("SERVICES.TSX, UPDATEFORM, curFileName_trim: " + curFileName_trim);

    if((curJSON_trim !== newJSON_trim) || (curFileName_trim !== newFileName_trim)){

        console.log("updateForm() change in JSON, curJSON_trim !== newJSON_trim");
        // update/create entry if differences are noticed
        try{
            // should we be updateing with trim?
            await updateEntryDB(newFileName_trim, newJSON_trim, "development");
            // console.log("Updated " + `${newJSON}` + "'s Item successfully!");
            revalidatePath("/items");
        }catch(error){     
            console.log("error: " + error);
            redirect("/404");
        }
        // delete old entry if new filename was set
        if(curFileName_trim !== newFileName_trim && curFileName !== "")
        {
            console.log("curFileName_trim !== newFileName_trim");
            try{
                await deleteEntryDB(curFileName_trim, "development");
                console.log("Deleted " + `${curFileName_trim}` + "'s Item successfully!");
                revalidatePath("/items");
            }catch(error){
                console.log("updateForm() error: " + error);
                redirect("/404");
            }
        }
    }
    else{
        console.log("updateForm() curJSON == newJSON, curFileName == newFileName, ignore call" + "\n\n" + 
        "updateForm() curJSON_trim: \n" + curJSON_trim + "\n\n" + 
        "updateForm() newJSON_trim: \n" + newJSON_trim);
    }
};


const deleteItem = async(filename: string) => {
    console.log("deleteItem(), delete button pressed!");

    try{
        await deleteEntryDB(filename, "development");
        console.log("Deleted " + `${filename}` + "'s Item successfully!");
        revalidatePath("/items");
    }catch(error){
        console.log("deleteItem() error: " + error);
        redirect("/404");
    }

};
export { getDevelopmentItems, updateForm, deleteItem}