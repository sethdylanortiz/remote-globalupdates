"use client"
import React, { useState } from 'react'
import styles from "./AddItem.module.css";

// services
import Button from '@/components/button/Button'
import JSONEditor from '../../testingpage/JSONEditor/JSONEditor';

const AddItem = ():JSX.Element => {
    
    const [showEditor, setShowEditor] = useState(false);
    const toggleShowEditor = () => {
        setShowEditor(false);
    }
    
    return (
        <div className = {styles.container}>
            <Button text = "+ New item" color = "green" handleClick = {() => {
                setShowEditor(true);
            }}/>

            {showEditor == true && (
                <JSONEditor filename = "" json = "{}" hideEditor = {toggleShowEditor} />
            )}
        </div>
    )
}

export default AddItem;