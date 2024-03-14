import React from "react";
import styles from "./itemspage.module.css";

// services
import { getDevelopmentJSONData } from "./services";
import Folder from "./Folder/Folder";

const ItemsPage = async() => {

    const development_items = await getDevelopmentJSONData("development");

    return (
        <div className = {styles.container}> 
            <Folder json = {development_items}/>
        </div>
    )
}

export default ItemsPage;