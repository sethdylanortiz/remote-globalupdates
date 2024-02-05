import React from 'react'
import styles from "./versionspage.module.css";

// services 
import { getVersions } from './services';
import VersionCard from './versionCard/VersionCard';

// services - other
import { getCurrentLiveVersion } from '../merge/services';

/*
todo:
- create services.ts
    - function() to take data from Live db -> transform into large json for version db
        - this should be in /merge's services, after merge push to versions db 
    - "revert" button after clicking
- since this page and /merge page have same page - look into creating new route
    and displaying the "header_section" on both then render children - therefore,
    only have to call/re-render/revalidate current_version in one place
*/
const VersionPage = async() => {

    // get current live version
    const {current_version} = await getCurrentLiveVersion();

    const {versions_obj} = await getVersions();
    const version_arr = JSON.parse(JSON.stringify(versions_obj));

    return (
        <div className = {styles.container}>

            <div className = {styles.header_section}>
                <div className = {styles.header_text}>
                        <p>Select a configuration version to view</p>
                        <p>Current Live version: {current_version} </p>
                </div>
            </div>

            <div className = {styles.cards_container}>
                {version_arr.map((configuration: any) =>
                    <div className = {styles.card} key = {configuration.Version}>
                        <VersionCard version = {configuration.Version} item = {JSON.stringify(JSON.parse(configuration.Item), null, 4)}/>
                    </div>
                )}
            </div>

        </div>

    )
};

export default VersionPage;