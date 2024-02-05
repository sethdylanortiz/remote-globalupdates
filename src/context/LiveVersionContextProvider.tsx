"use client";
import React, { useState } from "react";
import { VersionContext, VersionType } from "./LiveVersionContext";

import { getCurrentLiveVersion } from "@/app/lib/dynamodb";

export let init_version: any;

const VersionContextProvider = ({children}: {children:React.ReactNode}) => {

    const [version, setVersion] = useState<VersionType>(null);

    init_version = async() => {
        // await getCurrentLiveVersion().then(data => {
        //     setVersion(data);
        //     console.log("init_version: " + data);
        // });

        
        setTimeout(async() => {

            await getCurrentLiveVersion().then(data => {
                setVersion(data);
                console.log("init_version: " + data);
            });

            // setVersion(10);
            // console.log("setTimeout, version: " + version);
        }, 5000);
    };

    // const getVersion = async() => {

    //     // setTimeout(() => {
    //     //     setVersion(10);
    //     //     console.log("setTimeout, version: " + version);
    //     // }, 5000);

    //     // await getCurrentLiveVersion().then(data => {
    //     //     console.log("JOSH SAYS data:  " + data + " " + typeof data);
    //     //     setVersion(data);
    //     // });
    
    //     const init_version = await getCurrentLiveVersion();
    //     console.log("getVersion(), init_version: " + init_version + ", " + typeof init_version);
    //     setVersion(init_version);
    // }

    // fill useState() with latest db value
    // getVersion();

    return(
        <VersionContext.Provider value = {{version, setVersion}}>
            {children}
        </VersionContext.Provider>
    );
};

export default VersionContextProvider;