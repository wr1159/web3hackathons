"use client";
import { useEffect, useState } from "react";

interface Hackathon {
    id: string;
    name: string;
    location: string;
    start_date: string;
    end_date: string;
    prize_pool: number;
    website_url: string;
    banner_image: string;
    slug: string;
}

export default function HackathonsPage() {
    const [hackathons, setHackathons] = useState<Hackathon[]>([]);

    useEffect(() => {
        const fetchHackathons = async () => {
            const response = await fetch("/api/hackathons");
            const data = await response.json();
            setHackathons(data);
        };

        fetchHackathons();
    }, []);
    console.log(hackathons);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Web3 Hackathons</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hackathons.map((hackathon) => (
                    <div
                        key={hackathon.id}
                        className="border rounded-lg shadow-lg"
                    >
                        <img
                            src={hackathon.banner_image}
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
                                Prize Pool: ${hackathon.prize_pool}
                            </p>
                            <a
                                href={`/hackathons/${hackathon.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
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
