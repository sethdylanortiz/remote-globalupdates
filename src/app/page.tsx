import React from "react";
import styles from "./homepage.module.css";
import Link from "next/link";
import Image from "next/image";

// images
import image_itemsPage from "../../public/image-development.png";
import image_mergePage from "../../public/image-production.png";

export default function Home() {
    return (
        <div className = {styles.container}>
            
            <div className = {styles.image_navigation_container}>

                <div className = {styles.selection}>
                    <Link href = "/items">
                        <Image
                            className= {styles.image_container}
                            src = {image_itemsPage}
                            alt = "image_itemsPage.png"
                            height = {350} // change to scale performance - add mobile
                        />
                        <div className = {styles.button}>
                            <p>View Development Package</p>
                        </div>
                    </Link>
                </div>

                <div className = {styles.selection}>
                    <Link href = "/merge">
                        <Image
                            className= {styles.image_container}
                            src = {image_mergePage}
                            alt = "image_mergePage.png"
                            height = {350} // change to scale performance - add mobile
                        />
                        <div className = {styles.button}>
                            <p>Merge into LIVE</p>
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    )
}