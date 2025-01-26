"use client";

import * as React from "react";
import { addDays, format, startOfDay, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Event {
    id: string;
    name: string;
    platform?: string;
    startDate: Date;
    endDate: Date;
    prizePool?: number;
    tags: string[];
}

interface CalendarViewProps {
    events: Event[];
    startDate?: Date;
    daysToShow?: number;
}

export function CalendarView({
    events,
    startDate = new Date(),
    daysToShow = 30,
}: CalendarViewProps) {
    const platforms = Array.from(
        new Set(events.map((event) => event.platform))
    );
    const dates = Array.from({ length: daysToShow }, (_, i) =>
        addDays(startOfDay(startDate), i)
    );

    const getEventStyle = (event: Event) => {
        const startDayIndex = differenceInDays(event.startDate, startDate);
        const duration = differenceInDays(event.endDate, event.startDate) + 1;

        return {
            gridColumn: `${Math.max(1, startDayIndex + 1)} / span ${duration}`,
        };
    };

    const getPlatformColor = (platform: string) => {
        const colors: Record<string, string> = {
            // EthGlobal: "bg-purple-600/90 hover:bg-purple-600",
            Dorahacks: "bg-orange-500/90 hover:bg-orange-500",
            Cantina: "bg-red-500/90 hover:bg-red-500",
            Sherlock: "bg-indigo-600/90 hover:bg-indigo-600",
            Hats: "bg-blue-600/90 hover:bg-blue-600",
            ethglobal: "bg-violet-500/90 hover:bg-violet-500",
            unknown: "bg-pink-600/90 hover:bg-pink-600",
        };
        return colors[platform] || "bg-gray-500/90 hover:bg-gray-500";
    };

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-[1200px]">
                {/* Header with dates */}
                <div className="grid grid-cols-[150px_repeat(30,1fr)] border-b border-border">
                    <div className="p-2 font-bold text-sm bg-muted">
                        Platform
                    </div>
                    {dates.map((date, i) => (
                        <div
                            key={date.toISOString()}
                            className={cn(
                                "p-2 text-center text-sm font-medium border-l border-border",
                                i % 2 === 0 ? "bg-muted" : "bg-muted/50"
                            )}
                        >
                            <div>{format(date, "d")}</div>
                            <div className="text-xs text-muted-foreground">
                                {format(date, "MMM")}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Platform rows with events */}
                {platforms.map((platform) => (
                    <div
                        key={platform}
                        className="grid grid-cols-[150px_repeat(30,1fr)] relative min-h-[80px] border-b border-border"
                    >
                        <div className="p-2 font-medium bg-muted border-r border-border">
                            {platform}
                        </div>
                        {/* Background grid */}
                        {dates.map((date, i) => (
                            <div
                                key={date.toISOString()}
                                className={cn(
                                    "border-l border-border",
                                    i % 2 === 0 ? "bg-muted" : "bg-muted/50"
                                )}
                            />
                        ))}
                        {/* Events */}
                        {events
                            .filter((event) => event.platform === platform)
                            .map((event) => (
                                <div
                                    key={event.id}
                                    style={getEventStyle(event)}
                                    className={cn(
                                        "absolute h-16 m-1 rounded-md p-2 text-white",
                                        getPlatformColor(
                                            event.platform || "unknown"
                                        ),
                                        "transition-colors duration-200"
                                    )}
                                >
                                    <div className="font-medium text-sm truncate">
                                        {event.name}
                                    </div>
                                    <div className="text-sm font-bold">
                                        ${event.prizePool?.toLocaleString()}
                                    </div>
                                    <div className="flex gap-1 mt-1 overflow-hidden">
                                        {event.tags.slice(0, 2).map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="text-[10px] h-4 bg-white/20 hover:bg-white/30 text-white border-none"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
