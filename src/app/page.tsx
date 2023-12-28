import MaxWidthWrapper from "@/components/ui/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

// <section> tag is used to create a 'new' section of the webpage
// <div> tag has no effect on the HTML and is only used to group items

export default function Home() {
    return (
        <MaxWidthWrapper>
            <div className = "py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
                <h1>h1 tag for home page</h1>

                <div>
                {/* buttonVariants() gets all default variants */}
                <Link href = "/item" className = {buttonVariants()}>View Item</Link>
                </div>

            </div>
            
        </MaxWidthWrapper>
    )
}