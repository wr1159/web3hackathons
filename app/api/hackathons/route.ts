import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { generateSlug } from "@/utils/generate-slug";

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
        image,
    }: {
        name: string;
        location: string;
        start_date: string;
        end_date: string;
        prize_pool?: number;
        website_url?: string;
        tags?: string[];
        image?: string;
    } = await req.json();
    const slug = generateSlug(name);
    let imageUrl = null;

    // Validate input
    if (!name || !location || !start_date || !end_date) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (image) {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const fileName = `${slug}-${Date.now()}.jpg`;

        // Upload image to Supabase storage
        const { error } = await supabase.storage
            .from("hackathon-images") // Replace with your Supabase storage bucket name
            .upload(fileName, buffer, { contentType: "image/jpeg" });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Generate public image URL
        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/hackathon-images/${fileName}`;
    }
    // Convert base64 image to Blob
    // Insert hackathon data into the database
    const { error: dbError } = await supabase.from("hackathons").insert({
        name,
        location,
        start_date,
        end_date,
        prize_pool: prize_pool || null,
        website_url: website_url || null,
        tags: tags || [],
        banner_image: imageUrl,
        display: false,
        slug,
    });

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(
        { message: "Hackathon created successfully" },
        { status: 201 }
    );
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
