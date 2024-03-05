"use server";
import { redirect } from "next/navigation"; // https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function
import { getLiveVersionDB } from "../lib/dynamodb";

const getVersion = async() => {

    try{
        const request = await getLiveVersionDB();
        
        if(request.Item)
        {
            const versionNumber = Number(request.Item.Entry);
            console.log("GLOBAL SERVICES getVersion(), version: " + versionNumber + ", type: " + typeof versionNumber);
            return versionNumber;
        }
        
        throw new Error("cannot get current live version number");

    }catch(error) {
        console.log("globalservices.ts getVersion() error: " + error);
        redirect("/404");
    };
};

export { getVersion };