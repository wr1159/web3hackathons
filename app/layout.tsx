import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

const defaultUrl = process.env.VERCEL_URL
    ? `https://web3hackathons.verecel.app`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Web3Hackathons",
    description: "Your one stop for all Web3 Hackathons",
    openGraph: {
        title: "Web3Hackathons",
        description: "Your one stop for all Web3 Hackathons",
        images: [
            {
                url: `${defaultUrl}/opengraph-image.png`,
                width: 1200,
                height: 630,
                alt: "Web3Hackathons OpenGraph Image",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        images: [
            {
                url: `${defaultUrl}/twitter-image.png`,
                width: 800,
                height: 600,
                alt: "Web3Hackathons Twitter Image",
            },
        ],
    },
};

const geistSans = Geist({
    display: "swap",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={geistSans.className}
            suppressHydrationWarning
        >
            <body className="bg-background text-foreground">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <main className="min-h-screen flex flex-col items-center">
                        <div className="flex-1 w-full flex flex-col items-center gap-8">
                            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                                <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
                                    <div className="flex gap-5 items-center font-semibold w-full justify-between md:justify-normal">
                                        <Link
                                            href="/"
                                            className="font-mono text-primary"
                                        >
                                            Web3Hackathons
                                        </Link>
                                        <Link href={"/hackathons"} prefetch>
                                            <Button>Explore Hackathons</Button>
                                        </Link>
                                    </div>
                                    <Link
                                        href={"/hackathons/request-form"}
                                        className="hidden md:block"
                                    >
                                        <Button>New Hackathon</Button>
                                    </Link>
                                </div>
                            </nav>
                            <div className="flex flex-col gap-20 max-w-7xl px-3 lg:px-8 w-full">
                                {children}
                            </div>

                            <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-4">
                                <p>
                                    An initiative by{" "}
                                    <Link
                                        href={"https://t.me/web3meets"}
                                        className="font-bold hover:underline"
                                    >
                                        Web3Meets
                                    </Link>{" "}
                                    | Made by{" "}
                                    <Link href={"https://x.com/wr1159"}>
                                        wr1159
                                    </Link>
                                    from
                                    <Link
                                        href={"https://x.com/nus_blockchain"}
                                        className="font-bold hover:underline"
                                    >
                                        NUS Blockchain
                                    </Link>{" "}
                                </p>
                                <ThemeSwitcher />
                            </footer>
                        </div>
                    </main>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
