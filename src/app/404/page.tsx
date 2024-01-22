import React from "react"
import styles from "./errorpage.module.css";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/button/Button";

// images
import image_sinkingship from "../../../public/image-sinkingship.png";

const ErrorPage = () => {
    return (
        <div className = {styles.container}>
            <Image
                src = {image_sinkingship}
                alt = "image_sinkingship.png"
                height = {350}
                quality = {75}
                // add sizes tag option
            />
            <div className = {styles.number_container}>
                <p>404</p>
            </div>
            <div className = {styles.message_container}>
                <p>Hey captain! Looks like you've sunk the ship!</p>
            </div>

            <Link href = "/">
                <Button text = "Take me back to the homepage" color = "blue"/>
            </Link>

        </div>
    )
}

export default ErrorPage;