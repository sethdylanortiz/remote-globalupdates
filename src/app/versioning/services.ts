"use server";
import { redirect } from "next/navigation";

// services
import { getConfigVersionsDB } from "../lib/dynamodb";

/* 
fix: - what happens when there are 200+ versions? dont grab them all, 
        - grab them by chunks, but grab the latest values ?? - aws side? / another db?
            - perhaps, in db call ./dynamodb.js - grab by pk > x -> update x after each request
*/
const getVersions = async() => {
    try{
        const response_obj = await getConfigVersionsDB();
        
        // return ordered array based on pk: version #
        return {
            versions_obj: response_obj.Items?.sort((a, b) => 
                a.Version > b.Version ? -1 : a.Version < b.Version ? 1 : 0)
        };
    }catch(error){
        console.log("services.ts getVersions() error: " + error);
        redirect("/404");
    }
};

export { getVersions };