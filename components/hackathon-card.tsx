import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HackathonCardProps {
    id: string;
    name: string;
    location: string;
    start_date: string;
    end_date: string;
    prize_pool: number;
    banner_image: string;
    slug: string;
    tags: string[];
}

export function HackathonCard({
    id,
    name,
    location,
    start_date,
    end_date,
    prize_pool,
    banner_image,
    slug,
    tags,
}: HackathonCardProps) {
    const today = new Date();
    const isLive = today >= new Date(start_date) && today <= new Date(end_date);

    return (
        <Link href={`/hackathons/${slug}`} className="block h-full">
            <Card className="overflow-hidden h-full hover:shadow-lg hover:translate-y-[-5px] transition-all duration-300 ">
                <img
                    src={banner_image || "/placeholder.jpg"}
                    alt={name}
                    className="w-full h-40 object-cover"
                />
                <CardContent className="p-4">
                    {isLive && (
                        <Badge className="mb-2 w-full rounded-sm text-center">
                            Live Now
                        </Badge>
                    )}
                    <h2 className="text-lg font-semibold mb-2">{name}</h2>
                    <p className="text-sm text-muted-foreground mb-1">
                        {location}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                        {new Date(start_date).toLocaleDateString()} -{" "}
                        {new Date(end_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-medium mb-2">
                        Prize Pool: $
                        {prize_pool?.toLocaleString("en-US") || "N/A"}
                    </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <Badge key={`${id}-${tag}`} variant="secondary">
                            {tag}
                        </Badge>
                    ))}
                </CardFooter>
            </Card>
        </Link>
    );
}
