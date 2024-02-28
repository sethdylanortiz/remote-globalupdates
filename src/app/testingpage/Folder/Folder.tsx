"use client";
import React, { useState } from 'react'
import styles from "./folder.module.css";

// services
import Button from '@/components/button/Button';

/*
todo:
- new file
- new folder

- edit file
- delete file
*/

const Folder = ({json} : {json: any}) => {

    const [expand, setExpand] = useState(false);
    const [isNewFolder, setIsNewFolder] = useState(false);
    const [inputText, setInputText] = useState("");

    const handleNewItem = (e: any, isFolder: any) => {
        e.stopPropagation();
        setExpand(true);

        if(isFolder == true)
        {
            setIsNewFolder(true);
        }
    }
    const addFolder = (e: any) => {
        console.log("e.target.value: "+ e.target.value);


        // to prevent refresh after form submission
        e.preventDefault();

        console.log("e.target.value: "+ e.target.value);

        // get passed json,
        // get parent file/folder name
        // append new folder entry under parent
        // write to db
        
        console.log("inputText: " + inputText);
        console.log("json.name: " + json.name);     // parent
        console.log("json: "); console.log(json);   // parent's json
    }

    if(json.__value)
    {
        return (
            <span className = {styles.file}> 📄 {json.name} </span>
        )
    }
    // else
    return (
        <div>

            <div className = {styles.folder} onClick = {() => setExpand(!expand)}>
                <span>📁 {json.name}</span>

                <div className = {styles.button_container}>
                    {/* <button className = {styles.button} onClick = {(e) => handleNewItem(e, true)}>+ Folder</button> */}
                    <Button text = "+ Folder" color = "grey" handleClick = {(e: any) => handleNewItem(e, true)}/>
                    <Button text = "+ File" color = "grey" handleClick = {(e: any) => handleNewItem(e, false)}/>
                </div>
            </div>

            <div style = {{display: expand ? "block" : "none", paddingLeft: 50}}>

                {isNewFolder && (
                    <div className = {styles.new_folder}>

                        <form className = {styles.folder_input} onSubmit = {addFolder}>
                        {/* <div className = {styles.folder_input}> */}
                            <span>📁</span>
                            <input type = "text" value = {inputText} onChange = {(e) => setInputText(e.target.value)}/>
                            {/* <Button text = "Save" color = "blue" buttonType = "submit"/> */}
                            <Button text = "Save" color = "blue" handleClick = {(e: any) => addFolder(e)}/>
                            <Button text = "Cancel" color = "grey" handleClick = {() => setIsNewFolder(false)}/>
                        </form>
                        
                    </div>
                    )}



                {
                    json.__items.map((item: any) => {
                        return <Folder json = {item}/>
                    })
                }
            </div>

        </div>
    )
    
}

export default Folder;


// "use client";
// import React, { useState } from 'react'
// import styles from "./folder.module.css";

// const Folder = ({explorerData} : {explorerData: any}) => {

//     const [expand, setExpand] = useState(false);
//     const [showInput, setShowInput] = useState({
//         visible: false,
//         ___value: null
//     });

//     const handleNewFolder = (e: any, isFolder: any) => {
//         e.stopPropagation();

//         setShowInput({
//             visible: true,
//             ___value: isFolder
//         });
//     }

//     if(!explorerData.__value)
//     {
//         return (
//             <div>
//                 <div className = {styles.folder} onClick = {() => setExpand(!expand)}>
//                     <span>📁 {explorerData.name}</span>

//                     <div className = {styles.button_container}>
//                         <button className = {styles.button} onClick = {(e) => handleNewFolder(e, null)}>+ Folder</button>
//                         <button className = {styles.button} onClick = {(e) => handleNewFolder(e, {})}>+ File</button>
//                     </div>
//                 </div>

//                 <div style = {{display: expand ? "block" : "none", paddingLeft: 50}}>

//                     {showInput.visible && (
//                         <div className = {styles.addContainer}>

//                             <span>{showInput.___value ? "📁" : "📄"}</span>
//                             <input className = {styles.input}/>
//                         </div>
//                     )}

//                     {explorerData.__items.map((childPath: any) => {
//                         return <Folder explorerData = {childPath}/>
//                     })}
//                 </div>
//             </div>
//         );
//     } else {
//         return <span className = {styles.file}> 📄 {explorerData.name} </span>
//     }
// }

// export default Folder;