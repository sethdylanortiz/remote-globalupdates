"use client";
import React from "react";

// import Link form "next/link";
import Image from "next/image";
import Link from "next/link";

// styles
import styles from "./navbar.module.css";
import logo_badpirate from "../../../public/pirate-ship.png";

// to-do: change back to css from tailwind
const Navbar = () => {

    const links = [
        {name: "Merge", href: "/merge"},
        {name: "All Items", href: "/items"}
    ];

    return(
        <nav className = {styles.container}>

            <Link className = {styles.logo_link} href = "/">
                <Image
                    src = {logo_badpirate}
                    alt = "logo_badpirate"
                    height = {60}
                />
                <div className = {styles.header_name}>
                    <h2>bad pirate</h2>
                </div>
           </Link>

            <div className = {styles.nav_links}>
                {links.map((link: any) => 
                    <Link key = {link.name} href = {link.href}>{link.name}</Link>
                )}
            </div>

        </nav>
    )
}

export default Navbar;