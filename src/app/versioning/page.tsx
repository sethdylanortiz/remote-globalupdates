import React from 'react'
import styles from "./versionspage.module.css";
import Link from 'next/link';

// services 
import { getVersion, getCurrentLiveJSONData } from '../glabal_services/globalservices';
import Button from '@/components/button/Button';


const VersionPage = async() => {

    // get current live version
    console.log("VERSION PAGE!!");
    const currentLiveVersion = await getVersion();
    
    // get last 10 versions
    var versions = [];
    for(var i = currentLiveVersion - 1; i > currentLiveVersion - 7; i--)
    {
        versions.push(i);
    }

    return (
        <div className = {styles.container}>

            <div className = {styles.instruction}>
                <p>Select a version to view</p>
            </div>

            <Link href = {`/versioning/${currentLiveVersion}`}>
                <div className = {styles.versionCard}>

                    <p>View current live version: <span>{currentLiveVersion}</span></p>  
                    <Button text = "View" color = "blue"/>

                </div>
            </Link>

            {versions.map((version: number) => {
                return(
                    <Link href = {`/versioning/${version}`}>
                        <div className = {styles.versionCard}>
        
                            <p>View version: <span>{version}</span></p>  
                            <Button text = "View" color = "blue"/>
        
                        </div>
                    </Link>
                )
            })}

            <div className = {styles.instruction}>
                <p>To view an even older version, enter the version in the hyper link, example: BPRemoteConfig/versioning/x</p>
            </div>

        </div>

    )
};

export default VersionPage;