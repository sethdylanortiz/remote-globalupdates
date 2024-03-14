"use server";
import React from "react";
import styles from "./version.module.css";

// services
import Folder from "../Folder/Folder";
import { getJSONData } from "@/app/global_services/globalservices";
import RevertButton from "../revertButton/RevertButton";

const Version = async({ params }: { params: any }) => {

    const versionNumber = Number(params.version);
    const renderJSON = await getJSONData(versionNumber, "Live");
    
    return(
        <div>

            <div className = {styles.versionHeader}>

                <p>Currently viewing version: <span>{params.version}</span></p>

                <RevertButton versionNumber = {versionNumber} />

            </div>

            <div className = {styles.container}>

                <Folder json = {renderJSON} />
                
            </div>

        </div>

    )

};

export default Version;
// using next.js dynamic routes