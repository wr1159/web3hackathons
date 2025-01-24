import { DatePickerWithRange } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export const revalidate = 3600; // Revalidate the page every hour
export const dynamicParams = true; // Allow unknown slugs for on-demand rendering

// Generate static params for hackathons
export async function generateStaticParams() {
    const supabase = await createClient();

    // Fetch hackathons directly from Supabase
    const { data: hackathons, error } = await supabase
        .from("hackathons")
        .select("slug");

    if (error) {
        console.error("Error fetching hackathons:", error);
        return [];
    }

    return hackathons;
}

export default async function HackathonPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: hackathon, error } = await supabase
        .from("hackathons")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!hackathon) {
        return <div>404: Hackathon not found</div>; // Optional: Add a 404-like message
    }

    return (
        <main className="lg:px-8">
            <img
                src={hackathon.banner_image || "/placeholder.jpg"}
                alt={hackathon.name}
                className="w-full h-64 object-cover rounded-md"
            />
            <h1 className="text-3xl font-bold text-primary py-4">
                {hackathon.name}
            </h1>
            <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <p className="text-lg">📍 {hackathon.location}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-LG">
                                💰 Prize Pool: $
                                {hackathon.prize_pool?.toLocaleString(
                                    "en-US"
                                ) || "N/A"}
                            </p>

                            <Link
                                href={hackathon.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4"
                            >
                                <Button>Visit Website</Button>
                            </Link>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={hackathon.start_date}
                        selected={{
                            from: hackathon.start_date,
                            to: hackathon.end_date,
                        }}
                        numberOfMonths={1}
                        className="p-0 xl:hidden"
                    />
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={hackathon.start_date}
                        selected={{
                            from: hackathon.start_date,
                            to: hackathon.end_date,
                        }}
                        numberOfMonths={2}
                        className="p-0 hidden xl:block"
                    />
                </Card>
            </div>
        </main>
    );
}
