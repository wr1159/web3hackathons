"use client";

import * as React from "react";
import Link from "next/link";
import {
    addDays,
    subDays,
    format,
    startOfDay,
    differenceInDays,
    isBefore,
    isAfter,
    min,
} from "date-fns";
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
    level?: number;
    slug: string; // Added slug attribute
}

interface CalendarViewProps {
    events: Event[];
    initialStartDate?: Date;
}
// TODO: Migrate to React Calendar Timeline
export function CalendarView({
    events,
    initialStartDate = new Date(),
}: CalendarViewProps) {
    // Find the earliest and latest event dates
    const earliestEventDate = events.reduce((earliest, event) => {
        return earliest < event.startDate ? earliest : event.startDate;
    }, initialStartDate);

    const latestEventDate = events.reduce((latest, event) => {
        return latest > event.endDate ? latest : event.endDate;
    }, initialStartDate);

    // Set the start date to 30 days before the earliest event or initialStartDate
    const startDate = subDays(min([earliestEventDate, initialStartDate]), 30);

    const daysToShow = differenceInDays(latestEventDate, startDate) + 37; // Add a week buffer

    const platforms = Array.from(
        new Set(events.map((event) => event.platform))
    ).filter(Boolean) as string[];

    const dates = Array.from({ length: daysToShow }, (_, i) =>
        addDays(startOfDay(startDate), i)
    );

    // Sort events by start date
    const sortedEvents = [...events].sort(
        (a, b) => a.startDate.getTime() - b.startDate.getTime()
    );

    // Function to check if events overlap
    const doEventsOverlap = (event1: Event, event2: Event) => {
        return !(
            isAfter(event1.startDate, event2.endDate) ||
            isBefore(event1.endDate, event2.startDate)
        );
    };

    // Function to get vertical position for staggering
    const getEventPosition = (event: Event, platformEvents: Event[]) => {
        const levels: boolean[] = []; // Track occupied levels

        // Check each event that starts before or at the same time as the current event
        const previousEvents = platformEvents.filter(
            (e) => e.id !== event.id && !isAfter(e.startDate, event.startDate)
        );

        // Find the first available level
        for (const prevEvent of previousEvents) {
            if (doEventsOverlap(event, prevEvent)) {
                if (prevEvent.level !== undefined) {
                    levels[prevEvent.level] = true;
                }
            }
        }

        // Find the first free level
        let level = 0;
        while (levels[level]) {
            level++;
        }

        return level;
    };

    // Pre-calculate levels for all events
    const eventLevels = new Map<string, number>();
    platforms.forEach((platform) => {
        const platformEvents = sortedEvents.filter(
            (event) => event.platform === platform
        );
        platformEvents.forEach((event) => {
            const level = getEventPosition(event, platformEvents);
            event.level = level; // Add level to event object
            eventLevels.set(event.id, level);
        });
    });

    const getEventStyle = (event: Event) => {
        const startDayIndex = differenceInDays(event.startDate, startDate);
        const duration = differenceInDays(event.endDate, event.startDate) + 1;
        const level = eventLevels.get(event.id) || 0;

        return {
            gridColumn: `${Math.max(1, startDayIndex + 1)} / span ${duration}`,
            top: `${level * 76 + 4}px`,
            left: 0,
            right: 0,
        };
    };

    const getPlatformColor = (platform: string) => {
        const colors: Record<string, string> = {
            DoraHacks: "bg-orange-500/90 hover:bg-orange-500",
            ETHGlobal: "bg-indigo-600/90 hover:bg-indigo-600",
            Devfolio: "bg-blue-600/90 hover:bg-blue-600",
        };
        return colors[platform] || "bg-gray-500/90 hover:bg-gray-500";
    };

    // Calculate row heights based on maximum level + 1
    const getRowHeight = (platform: string) => {
        const platformEvents = events.filter((e) => e.platform === platform);
        const maxLevel = Math.max(
            ...platformEvents.map((e) => eventLevels.get(e.id) || 0)
        );
        return (maxLevel + 1) * 76; // 76px per event level
    };

    return (
        <div className="w-full overflow-x-auto">
            <div
                style={{
                    minWidth: `${Math.max(1200, dates.length * 60)}px`,
                    width: "100%",
                }}
            >
                {/* Header with dates */}
                <div
                    className="grid border-b border-border sticky top-0 z-10 bg-background"
                    style={{
                        gridTemplateColumns: `150px repeat(${dates.length}, minmax(60px, 1fr))`,
                    }}
                >
                    <div className="p-2 font-bold text-sm bg-muted sticky left-0 z-20">
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
                {platforms.map((platform) => {
                    const platformEvents = events.filter(
                        (event) => event.platform === platform
                    );
                    const rowHeight = getRowHeight(platform);

                    return (
                        <div
                            key={platform}
                            className="grid relative border-b border-border"
                            style={{
                                gridTemplateColumns: `150px repeat(${dates.length}, minmax(60px, 1fr))`,
                                height: `${rowHeight}px`,
                            }}
                        >
                            <div className="p-2 font-medium bg-muted border-r border-border sticky left-0 z-10">
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
                            {platformEvents.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/hackathons/${event.slug}`}
                                    style={{
                                        ...getEventStyle(event),
                                        minWidth: 0,
                                        width: "100%",
                                        height: "70px",
                                    }}
                                    className={cn(
                                        "absolute m-1 rounded-md p-2 text-white overflow-hidden",
                                        getPlatformColor(
                                            event.platform || "unknown"
                                        ),
                                        "transition-colors duration-200 hover:opacity-80"
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
                                </Link>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
