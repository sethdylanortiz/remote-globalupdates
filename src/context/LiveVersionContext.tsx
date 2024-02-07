import React, { createContext, useContext } from "react";

// services
import { getConfigVersionsDB, getCurrentLiveVersion } from "../app/lib/dynamodb";

export type VersionType = string | number | null;

type VersionContextType = {
    version: VersionType;
    setVersion: React.Dispatch<React.SetStateAction<VersionType>>;
}

const VersionContext = createContext<VersionContextType>({
    version: 0,
    setVersion: () => {}
});

// const useVersionContext = () => useContext(VersionContext);

// const VersionContextProvider = async({children}: {children:React.ReactNode}) => {
//     // fill useState() with latest db value
//     const cur_version = await getCurrentLiveVersion();
//     const [version, setVersion] = useState(cur_version);
//     console.log("VersionContextProvider, version: " + version);

//     return(
//         <VersionContext.Provider value = {{version, setVersion}}>
//             {children}
//         </VersionContext.Provider>
//     );
// };

import { init_version } from "./LiveVersionContextProvider";

// transform string entry -> number for display -> so can be easily updated
const useVersionContext = () => {
    const context = useContext(VersionContext);

    if(!context){
        throw new Error("VersionContext must be used within an VersionContextProvider");
    }

    // init
    if(context.version == null)
    {
        init_version();
    }

    // console.log("useVersionContext, context.VERSION: " + context.version);

    return context;
};

export { VersionContext, useVersionContext };