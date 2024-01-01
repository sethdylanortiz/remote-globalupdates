"use server";
import { NextResponse } from "next/server";
import { updateEntryDB } from "../../lib/dynamodb.js";

// used to update existing FileName's JSON entry
export async function POST(newEntryObjectString){

    try{
        const {newFileName, newJSON} = await newEntryObjectString.json();
        const success_msg = await updateEntryDB(newFileName, newJSON);

        console.log("route.js update/POST() success_msg: " + success_msg);

        return NextResponse.json({
            responseMsg: ["route.js SUCCESS POST() responseMsg updateEntryDB()"],
            response: success_msg,

            success: true,
            status: 200
        });
    }catch(error){
        console.log("route.js update/POST() error: " + error);
        return NextResponse.json({
            responseMsg: ["route.js ERROR update/POST() responseMsg updateEntryDB()"],
            response: null,

            success: false,
            status: 500
        });
    }
}