"use client";
import React from "react";

import Image from "next/image";
import Link from "next/link";

// styles
import styles from "./navbar.module.css";
import logo_badpirate from "../../../public/icon-pirate_ship.png";

import { usePathname } from "next/navigation";

/*
todo:
    - add hamburger drop down menu on width decrease
*/
const Navbar = () => {

    const pathname = usePathname();

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
                        className = {styles.image}
                        src = {logo_badpirate}
                        alt = "logo_badpirate"
                        height = {50}
                        width = {50}
                    />

                    <div className = {styles.header_name}>
                        <h2>Bad Pirate</h2>
                </div>
            </Link>

            <div className = {styles.nav_links}>
                {links.map((link: any) => 
                    <Link 
                        key = {link.name} 
                        href = {link.href}
                        className = {pathname == link.href? styles.activeLink : styles.link}
                    >
                            {link.name}
                    </Link>
                )}
            </div>
        </nav>
    )
};

export default Navbar;