"use server";
import React from "react"
import styles from "./loginpage.module.css";
import Button from "@/components/button/Button";
// import { signIn } from "@/auth";

const LoginPage = () => {
    return (
        <div className = {styles.container}>

        <div className = {styles.formContainer}>

                <div className = {styles.loginText}>
                    <h2>Sign in</h2>
                    <p>Please enter your developer credentials below</p>
                </div>

                <form className = {styles.form} action = {async() => {
                    // "use server"
                    // await signIn();
                }}>

                    <div className = {styles.inputContainer}>
                        <input required name = "email" placeholder = "email" />
                        <input required name = "password" placeholder = "password" />
                    </div>
                    <Button color = "blue" text = "Sign in" buttonType = "submit" />

                </form>  

            </div>
 
        </div>
    )
}

export default LoginPage