import React from "react";
import styles from "./testingpage.module.css";

// services
import { getDevelopmentJSONData } from "./services";
import Folder from "./Folder/Folder";

const TestingPage = async() => {

    const development_items = await getDevelopmentJSONData();

    return (
        <div className = {styles.container}> 
            <Folder json = {development_items}/>
        </div>
    )
}

export default TestingPage;
