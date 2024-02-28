"use server";
import { redirect } from "next/navigation"; // https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function
import { revalidatePath } from "next/cache"; // https://nextjs.org/docs/app/api-reference/functions/revalidatePath

// services
import { getJSONDataDB } from "../lib/dynamodb"; 

const getDevelopmentJSONData = async() => {
    try{
        const request = await getJSONDataDB(0);
        // console.log("getDevelopmentJSONData(), request: "); console.log(request);
        
        return request.Item ? request.Item.Item : redirect("/404");
    }catch(error){
        console.log("services.ts getDevelopmentJSONData() error: " + error);
        redirect("/404");
    };
};

const updateDevelopmentJSONData = async(childJSON: string) => {

    try{
        // get current entire json (next.js cache)
        const request = await getJSONDataDB(0);

        // add passed sub-json to current json

        // write to new db
    }catch(error){
        console.log("services.ts updateDevelopmentJSONData() error: " + error);
        redirect("/404");
    }
};

export { getDevelopmentJSONData, updateDevelopmentJSONData };