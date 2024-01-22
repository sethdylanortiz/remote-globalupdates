"use server";
import { redirect } from "next/navigation"; // https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function
import { revalidatePath } from "next/cache"; // https://nextjs.org/docs/app/api-reference/functions/revalidatePath
import { NextResponse } from "next/server";

// services
import { getEntryDB, updateEntryDB, deleteEntryDB } from "../lib/dynamodb";
/*
to-do:
    - add try catch
    - add redirect
    - change schema to Filename, Entry
*/
type Item = {
    Filename: string,
    Entry: string
};
type Items = Item[];

// send response to page.tsx - not <Entry> client component
const getDevelopmentItems = async() => {
    console.log("\n\n" + "inside services.ts, getDevelopmentItems()");

    try{
        const items_dev_obj = await getEntryDB("development");

        return NextResponse.json({
            responseMsg: ["services.ts SUCCESS getEntryDB()"],
            entries_dev_obj: items_dev_obj,
            success: true,
        });
    }catch(error){
        // redirect to error page
        redirect("/404");
    }
};

const updateForm = async(curFileName: string, newFilename: string, curJSON: string, newJSON: string) => {
    console.log("updateForm(), SAVE button pressed");

    // to-do: what happens if value contains a " "?
    const [curFileName_trim, newFileName_trim] = [curFileName.trim(), curFileName.trim()];
    const [curJSON_trim, newJSON_trim] = [curJSON.replace(/\s/g,""), newJSON.replace(/\s/g,"")];

    if((curJSON_trim !== newJSON_trim) || (curFileName_trim !== newFileName_trim)){

        console.log("updateForm() change in JSON, curJSON_trim !== newJSON_trim");
        // update/create entry if differences are noticed
        try{
            await updateEntryDB(newFilename, newJSON, "development");
            console.log("Updated " + `${newJSON}` + "'s Item successfully!");
            revalidatePath("/items");
        }catch(error){        
            redirect("/404");
        }
        // delete old entry if new filename was set
        if(curFileName_trim !== newFileName_trim)
        {
            try{
                await deleteEntryDB(curFileName_trim, "development");
                console.log("Deleted " + `${curFileName_trim}` + "'s Item successfully!");
                revalidatePath("/items");
            }catch(error){
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

export { getDevelopmentItems, updateForm }