import React from "react";
import styles from "./testingpage.module.css";

// services
import EntryContainer from './EntryContainer/EntryContainer';
import { getDevelopmentJSONData } from "./services";

const sampleData = {
    "name": "rootdir",
    "__items": [
        {
            "name": "fooditems",
            "__items": [
            {
                "name": "price",
                "__items":[
                {
                    "name": "apple",
                    "__value": 
                    {
                        "person": "John",
                        "age": 30,
                        "car": null
                    }
                }]
            }]
        },
        {
            "name": "stats",
            "__items": [
                {
                    "name": "apple",
                    "__value": 
                    {
                        "person": "John",
                        "age": 30,
                        "car": null
                    }
                },
                {
                    "name": "steak",
                    "__value": 
                    {
                        "person": "John",
                        "age": 30,
                        "car": null
                    }
                }
            ]
        },
    {
        "name": "changelog",
        "__value":
        {
            "person": "John",
            "age": 30,
            "car": null
        }
    }
    ]
}

const TestingPage = async() => {

    const initItems = await getDevelopmentJSONData();

    return (
        <div className = {styles.container}> 
            <EntryContainer explorerData = {JSON.parse(initItems)}/>
        </div>
    )
}

export default TestingPage;
