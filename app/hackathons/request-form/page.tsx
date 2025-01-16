"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { DatePickerWithRange } from "@/components/date-range-picker";

// Define the Zod schema
const formSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Hackathon name must be at least 2 characters." }),
    location: z
        .string()
        .min(2, { message: "Location must be at least 2 characters." }),
    date_range: z.object({
        from: z.date().nullable(),
        to: z.date().nullable(),
    }),
    prize_pool: z
        .union([z.number().positive(), z.string().optional()])
        .optional()
        .refine((val) => val === undefined || !isNaN(Number(val)), {
            message: "Prize pool must be a valid number.",
        })
        .transform((val) => (val !== undefined ? Number(val) : val)),
    website_url: z.string().url({ message: "Invalid URL." }).optional(),
    tags: z
        .string()
        .optional()
        .transform((val) =>
            val ? val.split(",").map((tag) => tag.trim()) : []
        ),
    image: z
        .instanceof(File)
        .optional()
        .refine((file) => file === undefined || file instanceof File, {
            message: "Invalid file.",
        }),
});

export default function SubmitHackathonForm() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            location: "",
            date_range: dateRange,
            prize_pool: undefined,
            website_url: "",
            tags: [""],
            image: undefined,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const base64Image = values.image
            ? await new Promise<string>((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result as string);
                  reader.onerror = (error) => reject(error);
                  reader.readAsDataURL(values.image!);
              })
            : null;

        const payload = {
            ...values,
            start_date: values.date_range?.from?.toISOString(),
            end_date: values.date_range?.to?.toISOString(),
            tags: values.tags,
            image: base64Image,
        };

        try {
            const response = await fetch("/api/hackathons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Hackathon created successfully!",
                });
                form.reset();
            } else {
                const error = await response.json();
                toast({
                    title: "Error",
                    description: error.message,
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create hackathon.",
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Hackathon Name */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hackathon Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., ETHGlobal"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Location */}
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., Singapore"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Date Range Picker */}
                <FormField
                    control={form.control}
                    name="date_range"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date Range</FormLabel>
                            <FormControl>
                                <DatePickerWithRange
                                    date={dateRange}
                                    setDate={setDateRange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* Prize Pool */}
                <FormField
                    control={form.control}
                    name="prize_pool"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Prize Pool (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., 50000"
                                    type="number"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Website URL */}
                <FormField
                    control={form.control}
                    name="website_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Website URL (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., https://ethglobal.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Tags */}
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Comma-separated tags, e.g., blockchain, web3"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Image Upload */}
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Upload Image (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        field.onChange(e.target.files?.[0])
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit Button */}
                <Button type="submit">Submit Hackathon</Button>
            </form>
        </Form>
    );
}
