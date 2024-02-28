"use server";
import { redirect } from "next/navigation"; // https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function
import { revalidatePath } from "next/cache"; // https://nextjs.org/docs/app/api-reference/functions/revalidatePath

// services
import { getItemsDB, getFileNamesDB } from "../lib/dynamodb";

const getDevelopmentItems = async() => {
    try{
        const items_dev_obj = await getItemsDB("development");
        return items_dev_obj.Items;
    }catch(error){
        console.log("services.ts getDevelopmentItems() error: " + error);
        redirect("/404");
    };
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

export { getDevelopmentItems, getDevelopmentFilenames };