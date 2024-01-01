"use server";
import { NextResponse } from "next/server";
import { deleteEntryDB } from "../../lib/dynamodb.js";

export async function POST(oldFileNameObj){
    console.log("\n\n" + "route.js: inside delete/POST()");

    try{
        const {fileNameToDelete} = await oldFileNameObj.json();
        const success_msg = await deleteEntryDB(fileNameToDelete);

        console.log("route.js delete/POST() success_msg: " + success_msg);

        return NextResponse.json({
            responseMsg: ["route.js SUCCESS delete/POST() responseMsg updateEntryDB()"],
            response: success_msg,

            success: true,
            status: 200
        });
    }catch(error){
        console.log("route.js delete/POST() error: " + error);
        return NextResponse.json({
            responseMsg: ["route.js ERROR delete/POST() responseMsg updateEntryDB()"],
            response: null,

            success: false,
            status: 500
        });
    }
}