import React from 'react'
import styles from "./errorBox.module.css";

const ErrorBox = (error: string) => {
    return (
        <div className = {styles.container}>
            ErrorBox
        </div>
    )
}

export default ErrorBox;