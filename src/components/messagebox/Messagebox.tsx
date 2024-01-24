import React from 'react'
import styles from "./messagebox.module.css";

const getTheme = (type: string) =>{
    // return [background-color, border-color]
    switch(type){
        case "error":
            return ["#FF7A64", "#E73C20"];
        case "success":
            return ["#def8d2", "#65a657"];
        case "confirmation":
            return ["white", "white"];
        default:
            return ["white", "white"];
    };
}

const Messagebox = ({type, message}: {type: string, message: string}) => {
    return (
        // add background opacity outer div?
        <div className = {styles.container} 
            style = {{
                background: getTheme(type)[0],
                borderColor: type == "confirmation" ? "" : getTheme(type)[1],
                borderWidth: type == "confirmation" ? "0px": "4px"
            }}>
            <p>{message}</p>
            {/* add buttons */}
            {/* return state change to parent component? */}
        </div>
    );
}
export default Messagebox;