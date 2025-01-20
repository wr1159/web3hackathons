import HackathonsContent from "@/components/hackathon-content";
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
            <h1 className="sr-only">Web3 Hackathons</h1>
            <HackathonsContent hackathons={hackathons || []} />
        </div>
    );
}
