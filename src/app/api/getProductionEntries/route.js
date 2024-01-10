// for production database
import { NextResponse } from "next/server";
import { getEntryDB } from "../../lib/dynamodb";

export async function GET(){
    console.log("\n\n" + "route.js/getProductionEntries inside GET()");

    try{
        const items_obj = await getEntryDB("production");

        return NextResponse.json({
            responseMsg: ["route.js/getProductionEntries SUCCESS GET() responseMsg getEntryDB()"],
            entries_prod_obj: items_obj,

            success: true,
            status: 200
        });
    }catch(error){

        console.log("route.js/getProductionEntries GET() error: " + error);
        return NextResponse.json({
            responseMsg: ["route.js/getProductionEntries ERROR GET() responseMsg getEntryDB()"],
            entries_prod_obj: null,

            success: false,
            status: 500
        }); 
    }
}