"use server";
import { redirect } from "next/navigation";

// services
import { updateLiveVersionDB } from "../lib/dynamodb";

const revertVersion = async(newVersion: number) => {

    try{
        await updateLiveVersionDB(0, newVersion);
    }catch(error){
        console.log("services.ts revertVersion() error: " + error);
        redirect("/404");
    };

};

export { revertVersion };