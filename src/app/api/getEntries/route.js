// for developer database
import { NextResponse } from "next/server";
import { getEntryDB } from "../../lib/dynamodb.js";

export async function GET(){

    console.log("\n\n" + "route.js: inside GET()");

    try{
        const items_obj = await getEntryDB("development");

        return NextResponse.json({
            responseMsg: ["route.js SUCCESS GET() responseMsg getEntryDB()"],
            entries_dev_obj: items_obj,

            success: true,
            status: 200
        });
    }catch(error){

        console.log("route.js GET() error: " + error);
        return NextResponse.json({
            responseMsg: ["route.js ERROR GET() responseMsg getEntryDB()"],
            entries_dev_obj: null,

            success: false,
            status: 500
        }); 
    }

}