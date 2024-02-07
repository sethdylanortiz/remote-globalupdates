// https://www.youtube.com/watch?v=I7dwJxGuGYQ&ab_channel=ByteGrad
"use client";
import React, { createContext, useContext, useState } from "react";
import Messagebox from "@/components/messagebox/Messagebox";

interface InterfaceStateContext {
    displayMessageBox: boolean;
    setDisplayMessageBox: React.Dispatch<React.SetStateAction<boolean>>;

    message: string | null;
    setMessage: React.Dispatch<React.SetStateAction<string>>;

    messageType: string | null;
    setMessageType: React.Dispatch<React.SetStateAction<string>>;
};

const StateContext = createContext<InterfaceStateContext | null>(null);

const StateContextProvider = ({children}: {children: React.ReactNode}) => {
    const [displayMessageBox, setDisplayMessageBox] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    return (
        <StateContext.Provider
            value = {{
                displayMessageBox,
                setDisplayMessageBox,

                message,
                setMessage,

                messageType,
                setMessageType
            }}
        >
            {displayMessageBox && <Messagebox type = {messageType} message = {message}/>}
            {children}
        </StateContext.Provider>
    );
}

export const useStateContext = () => {
    const context = useContext(StateContext);
    if(!context){
        throw new Error("useStateContext must be used in Provider");
    }
    return context;
};

export default StateContextProvider;

/* to use, inside function:

"use client";
import { useStateContext } from "../?";

const { displayMessageBox, setDisplayMessageBox, ...} = useStateContext();
*/