"use client";
import { Hackathon } from "@/types/hackathon";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { HackathonCard } from "./hackathon-card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CalendarView } from "./calendar-view";

export default function HackathonsContent({
    hackathons,
}: Readonly<{ hackathons: Hackathon[] }>) {
    const [filteredHackathons, setFilteredHackathons] =
        useState<Hackathon[]>(hackathons);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("start_date");
    const [filterTag, setFilterTag] = useState("All");
    useEffect(() => {
        const filtered = hackathons?.filter(
            (hackathon) =>
                hackathon.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) &&
                (filterTag === "All" || hackathon.tags.includes(filterTag))
        );

        if (filtered === undefined) {
            return;
        }
        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === "prize_pool") {
                return b.prize_pool - a.prize_pool;
            } else {
                return (
                    new Date(a.start_date).getTime() -
                    new Date(b.start_date).getTime()
                );
            }
        });

        setFilteredHackathons(sorted);
    }, [hackathons, searchTerm, sortBy, filterTag]);

    const allTags = Array.from(new Set(hackathons?.flatMap((h) => h.tags)));
    return (
        <div className="container mx-auto px-4 pb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Input
                    placeholder="Search hackathons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="md:w-1/3"
                />
                <Select onValueChange={setSortBy} defaultValue={sortBy}>
                    <SelectTrigger className="md:w-1/4">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="start_date">Start Date</SelectItem>
                        <SelectItem value="prize_pool">Prize Pool</SelectItem>
                    </SelectContent>
                </Select>
                <Select onValueChange={setFilterTag} defaultValue={filterTag}>
                    <SelectTrigger className="md:w-1/4">
                        <SelectValue placeholder="Filter by tag" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Tags</SelectItem>
                        {allTags.map((tag) => (
                            <SelectItem key={tag} value={tag}>
                                {tag}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Tabs defaultValue="grid" className="mb-8">
                <TabsList>
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                    <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                </TabsList>
                <TabsContent value="grid">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredHackathons
                            .filter(
                                (hackathon) =>
                                    new Date(hackathon.end_date) >= new Date()
                            )
                            .map((hackathon) => (
                                <HackathonCard
                                    key={hackathon.id}
                                    {...hackathon}
                                />
                            ))}
                    </div>
                </TabsContent>
                <TabsContent value="calendar">
                    <CalendarView
                        events={filteredHackathons.map((h) => ({
                            id: h.id,
                            name: h.name,
                            platform: h.platform || "Unknown",
                            startDate: new Date(h.start_date),
                            endDate: new Date(h.end_date),
                            prizePool: h.prize_pool,
                            tags: h.tags,
                            slug: h.slug,
                        }))}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
