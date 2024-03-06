"use server";
import { redirect } from "next/navigation";
import { getVersion } from "../glabal_services/globalservices";

// services
import { updateLiveVersionDB } from "../lib/dynamodb";

const revertVersion = async(newVersion: number) => {

    try{
        await updateLiveVersionDB(newVersion);
    }catch(error){
        console.log("services.ts getDevelopmentJSONData() error: " + error);
        redirect("/404");
    };

};

export { revertVersion };