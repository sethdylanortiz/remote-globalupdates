import React from "react";
import styles from "./page.module.css";
import fetch from "node-fetch";
import DiffEntry from "@/components/diffEntry/DiffEntry";

// todo - implement cache search before making another aws call
// aws call dev database
// aws call live database
// add logic to compare, list compare entries
// onclick of entries, opens comparison json
    // merge
        // update entry in db 'version' - for polling
// if no changes, dsplay - all entrys are up to date

const MergePage = async() => {
    
    // look into caching this - uncheck web browser 'disable' cache?
    const getDeveloperDatabase = async() => {
        // add try-catch
        const response_obj = await fetch("http://localhost:3000/api/getEntries", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
        });
        return response_obj;
    }
    const getProductionDatabase = async() => {
        // add try-catch
        const repsonse_obj = await fetch("http://localhost:3000/api/getProductionEntries", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        return repsonse_obj;
    }
    // on page load
    const developer_config_obj = await getDeveloperDatabase();
    const {entries_dev_obj}: any = await developer_config_obj.json();
    console.log("\n" + "entries_dev_obj: \n" + entries_dev_obj);
    console.log("\n" + "entries_dev_obj.Items: \n" + entries_dev_obj.Items);
    console.log("\n" + "JSON.stringify(entries_dev_obj): \n" + JSON.stringify(entries_dev_obj));

    const production_config_obj = await getProductionDatabase();
    const {entries_prod_obj}: any = await production_config_obj.json();
    console.log("\n" + "entries_prod_obj: \n" + entries_prod_obj);
    console.log("\n" + "entries_prod_obj.Items: \n" + entries_prod_obj.Items);
    console.log("\n" + "JSON.stringify(entries_prod_obj): \n" + JSON.stringify(entries_prod_obj));

    return(
        <div className = {styles.container}>

            <DiffEntry
                dev_obj_str = {entries_dev_obj.Items} // passing obj now
                prod_obj_str = {entries_prod_obj.Items}
            />
            
        </div>
    );
}

export default MergePage;