import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// POST - Add a hackathon
export async function POST(req: Request) {
    const supabase = await createClient();
    const {
        name,
        location,
        start_date,
        end_date,
        prize_pool,
        website_url,
        tags,
        banner_image,
    } = await req.json();

    const { data, error } = await supabase
        .from("hackathons")
        .insert([
            {
                name,
                location,
                start_date,
                end_date,
                prize_pool,
                website_url,
                tags,
                banner_image,
                display: false, // Set display to false by default
            },
        ])
        .select("*");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
}

// GET - Get all hackathons
export async function GET() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("hackathons")
        .select("*")
        .eq("display", true); // Fetch only hackathons set to display

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });
}
