"use server";
import { redirect } from "next/navigation"; // https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function
import { signIn, signOut } from "@/auth";
// what is AuthError?
import { AuthError } from "next-auth";

export type UserCredentials = {
    email: string,
    password: string
}

const defaultValues = {
    email: "",
    password: ""
};

const login = async(formData: UserCredentials) => {

    try{
        const email = formData.email;
        const password = formData.password;

        // validate data (min length, etc.)

        // call database passing data
        await signIn("credentials", formData);

        // log user in? and return success
        return { 
            message: "success",
            errors: {}
        };

    }catch(error){

        if(error instanceof AuthError)
        {
            switch(error.type)
            {
                case "CredentialsSignin":
                    return {
                        message: 'credentials error',
                        errors: { ...defaultValues, credentials: "incorrect email or password" }
                    };
                default:
                    return {
                        message: 'unknown error',
                        errors: { ...defaultValues, unknown: 'unknown error', msg: error.type }
                    };
            };
        }
        console.log("auth_services.ts, login() error: " + error);
        redirect("/404");
    }
}

const logout = async() => {
    await signOut();
};

export { login, logout };