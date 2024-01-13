"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import styles from "./diffEntry.module.css";
import { DiffEditor } from "@monaco-editor/react";
import Button from "../button/Button";

// services
import { handleMerge } from "@/app/merge/services";

// icons
import icon_file from "../../../public/icon_file.png";
import icon_plus from "../../../public/icon-plus.png"
import icon_minus from "../../../public/icon-minus.png"
import icon_warning from "../../../public/icon-warning.png";

// todo - implement <Context>, pass to services.ts, to <layout>
type Item = [{
    FileName: string,
    entry: string
}];

const DiffEntry = (// todo - implement useReducer()
{newItems, syncedItemsDiffentEntry, deletedItems}: 
    {newItems: Item, syncedItemsDiffentEntry: any, deletedItems: Item}):JSX.Element =>{

    // for editor state
    const [showEditor, setShowEditor] = useState(false);

    // for filename
    const [fileName, setFileName] = useState<any>(null);

    // for entry editor
    const [originalJSON, setOriginalJSON] = useState<string | null>(null);
    const [modifiedJSON, setModifiedJSON] = useState<string | null>(null);
    const [mount, setMount] = useState(false); // todo - make sure this works
    const editorRef = useRef(null);
    const handleEditorDidMount = (editor: any, monaco: any) => {
        console.log("DiffEntry handleEditorDidMount()");
        editorRef.current = editor;
        setMount(!mount); // check this
    }
    const handleCompare = (filename: string, original: string, modified: string) => {
        setFileName(filename);
        setOriginalJSON(original);
        setModifiedJSON(modified);
        setShowEditor(true);
    }
    const handleCloseEditor = () => {
        // add unmount on close 
        setShowEditor(false);
        setFileName(null);
        setOriginalJSON(null);
        setModifiedJSON(null);
    }

    try{

        return (
            <div className = {styles.container}>
                {/* newItems */}
                {newItems.map((item: any) =>
                    <div className = {styles.item_container} style = {{background: "#92DA63"}} key = {item.FileName}>

                        <div className = {styles.file}>
                            <Image
                                src = {icon_file}
                                alt = "icon_file.png"
                                height = {45}
                            />
                            <p>{item.FileName}</p>
                        </div>

                        <div className = {styles.button_container}>
                            <Button text = "Compare" color = "blue" 
                                handleClick = {() => {handleCompare(item.FileName, "{}",item.entry)}}/>
                            <Image
                                src = {icon_plus}
                                alt = "icon_plus.png"
                                height = {40}
                            />
                        </div>

                    </div>
                )}
                {/* syncedItemsDiffentEntry */}
                {syncedItemsDiffentEntry.map((item: any) =>
                    <div className = {styles.item_container} style = {{background: "#E6DD80"}} key = {item.FileName}>

                        <div className = {styles.file}>
                            <Image
                                src = {icon_file}
                                alt = "icon_file.png"
                                height = {45}
                            />
                            <p>{item.FileName}</p>
                        </div>

                        <div className = {styles.button_container}>
                            <Button text = "Compare" color = "blue" 
                                handleClick = {() => {
                                        {handleCompare(item.FileName, item.dev_entry, item.prod_entry)}
                                    }
                                }/>

                            <Image
                                src = {icon_warning}
                                alt = "icon_warning.png"
                                height = {40}
                            />
                        </div>

                    </div>
                )}
                {/* deletedItems */}
                {deletedItems.map((item: any) =>
                    <div className = {styles.item_container} style = {{background: "#E68080"}} key = {item.FileName}>

                        <div className = {styles.file}>
                            <Image
                                src = {icon_file}
                                alt = "icon_file.png"
                                height = {45}
                            />
                            <p>{item.FileName}</p>
                        </div>

                        <div className = {styles.button_container}>
                            <Button text = "Compare" color = "blue" 
                                handleClick = {() => {
                                        {handleCompare(item.FileName, item.entry,"{}")}
                                    }
                                }/>
                            <Image
                                src = {icon_minus}
                                alt = "icon_minus.png"
                                height = {40}
                            />
                        </div>

                    </div>
                )}

                {showEditor == true?            
                    <section className = {styles.editor_container}>

                        <div className = {styles.filename_header}> 
                            <p>Current file</p>
                        </div>

                        <textarea
                            className = {styles.filename_textarea} 
                            rows = {1}
                            placeholder = "Current item's FileName goes here"
                            readOnly = {true}
                            value = {fileName}
                        />

                        <div className = {styles.section_titles}>
                            <div className = {styles.title}>
                                <p>Production</p>
                            </div>
                            <div className = {styles.title}>
                                <p>Development</p>
                            </div>
                        </div>

                        <DiffEditor
                            className = {styles.diffeditor}
                            height = "75%"
                            width = "90%"
                            theme = "light"
                            language = "json"
                            options = {{
                                readOnly: true,
                                renderOverviewRuler: false,
                                scrollBeyondLastLine: false,
                            }}
                                                    // change this .parse() into another var
                            original = {JSON.stringify(JSON.parse(originalJSON), null, 4)}
                            modified = {JSON.stringify(JSON.parse(modifiedJSON), null, 4)}
                            onMount = {handleEditorDidMount}
                        />

                        <div className = {styles.button_section}> 
                            <Button text = "MERGE" color = "blue" handleClick = {() => {
                                    console.log();
                                    handleMerge({
                                        filename: fileName,
                                        newJSON: modifiedJSON})
                                }}/>
                            <Button text = "CLOSE" color = "grey" handleClick = {handleCloseEditor}/>

                        </div>
                    </section>
                : null}

            </div>
        );

    } catch(error) {
        console.log("ERROR: " + error);
        return <p>Error: {error?.message ?? JSON.stringify(error)}</p>
    }
}

export default DiffEntry;