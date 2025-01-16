import { createClient } from "@/utils/supabase/client";

export const revalidate = 3600; // Revalidate the page every hour

export default async function HackathonsPage() {
    const supabase = await createClient();
    const { data: hackathons } = await supabase
        .from("hackathons")
        .select("*")
        .eq("display", true); // Fetch only hackathons set to display

    hackathons?.sort(
        (a, b) =>
            new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Web3 Hackathons</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hackathons?.map((hackathon) => (
                    <div
                        key={hackathon.id}
                        className="border rounded-lg shadow-lg"
                    >
                        <img
                            src={hackathon.banner_image || "/placeholder.jpg"} // Placeholder for missing images
                            alt={hackathon.name}
                            className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <div className="p-4">
                            <h2 className="text-lg font-semibold">
                                {hackathon.name}
                            </h2>
                            <p className="text-sm text-primary">
                                {hackathon.location}
                            </p>
                            <p className="text-sm text-primary">
                                {new Date(
                                    hackathon.start_date
                                ).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(
                                    hackathon.end_date
                                ).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-primary">
                                Prize Pool: ${hackathon.prize_pool || "N/A"}
                            </p>
                            <a
                                href={`/hackathons/${hackathon.slug}`}
                                className="text-blue-500 hover:underline text-sm"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
