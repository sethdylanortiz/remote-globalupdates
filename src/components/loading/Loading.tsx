import React from 'react'
import styles from "./loading.module.css";

const Loading = () => {
    return (
        <div className = {styles.background_opacity}>

            <div className = {styles.message}>
                Loading...
                
            </div>
        </div>
    )
}

export default Loading;