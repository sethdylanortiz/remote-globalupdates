"use server";
import { redirect } from "next/navigation"; // https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function
import { getLiveVersionDB, getJSONDataDB } from "../lib/dynamodb";

const getVersion = async() => {

    try{
        const request = await getLiveVersionDB(0);
        
        if(request.Item)
        {
            console.log("getVersion() request.Item: "); console.log(request.Item);

            const versionNumber = Number(request.Item.Entry);
            console.log("globalservices getVersion(), version: " + versionNumber + ", type: " + typeof versionNumber);
            return versionNumber;
        }
        
        throw new Error("cannot get current live version number");

    }catch(error) {
        console.log("globalservices.ts getVersion() error: " + error);
        redirect("/404");
    };
};


const getCurrentLiveJSONData = async() => {
    try{
        // get current version
        const versionNumber = await getVersion();

        const request = await getJSONDataDB(versionNumber, "Live");
        // console.log("getDevelopmentJSONData(), request: "); console.log(request);
        
        return request.Item ? JSON.parse(request.Item.Entry) : redirect("/404");
    }catch(error){
        console.log("services.ts getCurrentLiveJSONData() error: " + error);
        redirect("/404");
    };
};


const getJSONData = async(versionNumber: number, tableType: string) => {

    try{
        const request = await getJSONDataDB(versionNumber, tableType);
        
        return request.Item ? JSON.parse(request.Item.Entry) : redirect("/404");
    }catch(error){
        console.log("services.ts getJSONData() error: " + error);
        redirect("/404");
    };
};

export { getVersion, getCurrentLiveJSONData, getJSONData };