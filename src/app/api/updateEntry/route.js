"use server";

import { NextRespone } from "next/server";
import { updateEntryDB } from "../../lib/dynamodb.js";

// used to update existing FileName's JSON entry
export async function POST(filename, newJSON){

    console.log("\n\n" + "route.js: inside update/POST()");
    console.log("filename: " + filename);
    console.log("typeof filename: " + typeof filename);
    console.log("newJSON: " + newJSON);
    console.log("typeof newJSON: " + typeof newJSON);

    try{

        const success_msg = await updateEntryDB(filename, newJSON);

        console.log("route.js POST() success_msg: " + success_msg);

        return NextResponse.json({
            responseMsg: ["route.js SUCCESS POST() responseMsg updateEntryDB()"],
            response: success_msg,

            success: true,
            status: 200
        });
    }catch(error){
        console.log("route.js POST() error: " + error);
        return NextRespone.json({
            responseMsg: ["route.js ERROR POST() responseMsg updateEntryDB()"],
            response: success_msg, // or null

            success: false,
            status: 500
        });
    }

}