import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const MaxWidthWrapper = ({className, children} : {className ?: string, children : ReactNode}) => {

    return(
        // default set to string, or overwrite wwith incoming className argument
        <div className = {cn("mx-auto w-full max-w-screen-xl px-2.5 md:px-20", className)}>
            {children}
        </div>
    )

}

export default MaxWidthWrapper;