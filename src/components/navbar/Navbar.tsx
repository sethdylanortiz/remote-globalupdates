"use client";
import React from "react";

// import Link form "next/link";
import Image from "next/image";
import Link from "next/link";

// styles
import styles from "./Navbar.module.css";
import logo_badpirate from "../../../public/pirate-ship.png";

// to-do: change back to css from tailwind
const Navbar = () => {
    return(
        <nav className = {styles.container}>

            <Link className = {styles.logo_link} href = "/">
                <Image
                    src = {logo_badpirate}
                    alt = "logo_badpirate"
                    height = {50}
                />
            </Link>

           <div className = {styles.header_name}>
                <h2>bad pirate</h2>

           </div>
        </nav>
    )
}

export default Navbar;