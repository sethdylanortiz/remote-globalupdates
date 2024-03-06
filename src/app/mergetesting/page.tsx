"use server";

import React from "react";
import styles from "./mergepage.module.css";

// services
import Folder from "./Folder/Folder";
import { compareJSON } from "./services";

/*
todo:
- aws call in services for current Live version
- aws call in services for current development version
- comparsion and folder display

done:

*/

const devJSON = {
    "name": "rootdir",
    "__id": 100,
    "__isFolder": true,
    "__items": [
        {
            "name": "stats",
            "__id": 65,
            "__isFolder": true,
            "__items": [
                {
                    "name": "new folder testing",
                    "__id": 5,
                    "__isFolder": true,
                    "__items": []
                },  
                {
                    "name": "apple",
                    "__id": 6,
                    "__isFolder": false,
                    "__items": [],
                    "__value": {
                        "person": "John",
                        "age": 30,
                        "car": 100
                    }
                },
                {
                    "name": "steak",
                    "__id": 7,
                    "__isFolder": false,
                    "__items": [],
                    "__value": {
                        "person": "John",
                        "age": 30,
                        "car": 100
                    }
                }
            ]
        },
        {
            "name": "changelog",
            "__id": 8,
            "__isFolder": false,
            "__items": [],
            "__value": {
                "person": "John",
                "age": 30,
                "car": 100
            }
        },
        {
            "name": "newtesting",
            "__id": 1w9,
            "__isFolder": false,
            "__items": [],
            "__value": {
                "person": "seth",
                "age": 30,
                "car": 100
            }
        }
    ]
}

const liveJSON = {
    "name": "rootdir",
    "__id": 100,
    "__isFolder": true,
    "__items": [
        {
            "name": "stats",
            "__id": 65,
            "__isFolder": true,
            "__items": [
                {
                    "name": "new folder testing",
                    "__id": 5,
                    "__isFolder": true,
                    "__items": []
                },  
                {
                    "name": "apple",
                    "__id": 6,
                    "__isFolder": false,
                    "__items": [],
                    "__value": {
                        "person": "Seth",
                        "age": 30,
                        "car": 100
                    }
                }
            ]
        },
        {
            "name": "changelog",
            "__id": 8,
            "__isFolder": false,
            "__items": [],
            "__value": {
                "person": "John",
                "age": 30,
                "car": 100
            }
        }
    ]
}

const MergePage = async() => {

    // get currrent development & live version configuration

    // call function to compare both jsons, and tag each one with a new entry!
    compareJSON(devJSON, liveJSON);

    return (
        <div className = {styles.container}> 
            {/* <Folder devJSON = {developmentItems} liveJSON = {liveItems}/> */}
        </div>
    )

}

export default MergePage;  