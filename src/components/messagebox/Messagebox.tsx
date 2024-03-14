import React from 'react'
import styles from "./messagebox.module.css";

export type MessageType = "error" | "success" | "confirmation";

const getTheme = (type: string) =>{
    // return [background-color, border-color]
    switch(type){
        case "error":
            return ["#FFF0ED", "#EB6550"];
        case "success":
            return ["#EAFFE0", "#65a657"];
        case "confirmation":
            return ["white", "white"];
        default:
            return ["white", "white"];
    };
}

const Messagebox = ({type, message, buttons}: {type: MessageType, message: string, buttons: any}) => {
    return (
        <div className = {styles.background_opacity}> 
            <div className = {styles.container} 
                style = {{
                    background: getTheme(type)[0],
                    borderColor: type == "confirmation" ? "" : getTheme(type)[1],
                    borderWidth: type == "confirmation" ? "0px": "3px"
                }}>

                <p>{message}</p>
                
                {/* do we have to iter? */}
                <div className = {styles.footer_buttons_container}>
                    {buttons.map((button: any, index: any) =>
                         <div key = {index}>
                            {button}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default Messagebox;