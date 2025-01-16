import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
    return (
        <div className="flex flex-col gap-16 items-center">
            <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center font-bold">
                Your One Stop for Web3 Hackathons!
            </p>
            <Button>
                <Link href="/hackathons" prefetch>
                    Start now!
                </Link>
            </Button>
            <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
        </div>
    );
}
