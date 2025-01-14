import { createClient } from "@/utils/supabase/client";

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
        <main className="p-8">
            <h1 className="text-3xl font-bold">{hackathon.name}</h1>
            <img
                src={hackathon.banner_image || "/placeholder.jpg"}
                alt={hackathon.name}
                className="w-full h-64 object-cover rounded-md my-4"
            />
            <p className="text-lg">{hackathon.location}</p>
            <p className="text-md">
                {new Date(hackathon.start_date).toLocaleDateString()} -{" "}
                {new Date(hackathon.end_date).toLocaleDateString()}
            </p>
            <p className="text-md">
                Prize Pool: ${hackathon.prize_pool || "N/A"}
            </p>
            <a
                href={hackathon.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
            >
                Visit Website
            </a>
        </main>
    );
}
