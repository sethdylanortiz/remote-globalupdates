"use client";
import React from "react";

// import Link form "next/link";
import Image from "next/image";
import Link from "next/link";

// styles
import styles from "./navbar.module.css";
import logo_badpirate from "../../../public/icon-pirate_ship.png";

const Navbar = () => {

    const links = [
        {name: "Home", href: "/"},
        {name: "Development", href: "/items"},
        {name: "Merge", href: "/merge"},
        {name: "Versioning", href: "/versioning"}
    ];

    return(
        <nav className = {styles.container}>
            <Link className = {styles.logo_link} href = "/">
                    <Image
                        src = {logo_badpirate}
                        alt = "logo_badpirate"
                        height = {0}
                        width = {0}
                        style = {{
                            // maxHeight: "5%",
                            // height: "auto",
                            maxWidth: "9%",
                            height: "auto",
                        }}
                    />
                    <div className = {styles.header_name}>
                        <h2>Bad Pirate</h2>
                </div>
           </Link>

            <div className = {styles.nav_links}>
                {links.map((link: any) => 
                    <Link key = {link.name} href = {link.href}>{link.name}</Link>
                )}
            </div>
        </nav>
    )
};

export default Navbar;