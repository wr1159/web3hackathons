import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
    return (
        <section className="min-h-[calc(100vh-25rem)]">
            <div className="terminal-window">
                <div className="terminal-header">
                    <span className="text-primary">web3hackathons.xyz</span>
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                </div>
                <div className="terminal-body">
                    <p className="terminal-prompt mb-4">
                        Welcome to web3hackathons.xyz - Your gateway to
                        decentralized innovation
                    </p>
                    <p className="terminal-prompt mb-4">
                        Join global hackathons, build groundbreaking projects,
                        shape the future of Web3
                    </p>
                    <p className="terminal-prompt terminal-cursor">
                        Are you ready to start hacking?
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-20">
                <Link href="/hackathons" passHref>
                    <Button
                        size="lg"
                        className="text-lg bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Explore Hackathons
                    </Button>
                </Link>
                <Link href="/hackathons/request-form" passHref>
                    <Button
                        size="lg"
                        variant="outline"
                        className="text-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                        Submit Your Event
                    </Button>
                </Link>
            </div>
        </section>
    );
}
