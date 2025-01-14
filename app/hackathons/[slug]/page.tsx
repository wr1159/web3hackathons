import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function HackathonPage({
    params,
}: {
    params: { slug: string };
}) {
    console.log(params.slug);
    const supabase = await createClient();
    console.log(params);
    const { data: hackathon, error } = await supabase
        .from("hackathons")
        .select("*")
        .eq("slug", params.slug)
        .single();

    if (error || !hackathon) {
        return notFound(); // Show 404 if no hackathon is found
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">{hackathon.name}</h1>
            <img
                src={hackathon.banner_image}
                alt={hackathon.name}
                className="w-full h-64 object-cover my-4"
            />
            <p className="text-lg">{hackathon.location}</p>
            <p className="text-md">
                {new Date(hackathon.start_date).toLocaleDateString()} -{" "}
                {new Date(hackathon.end_date).toLocaleDateString()}
            </p>
            <p className="text-md">Prize Pool: ${hackathon.prize_pool}</p>
            <a
                href={hackathon.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
            >
                Visit Website
            </a>
        </div>
    );
}
