"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Zod schema for form validation
const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    location: z
        .string()
        .min(2, { message: "Location must be at least 2 characters." }),
    start_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid start date.",
    }),
    end_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid end date.",
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
    // image: z
    //     .instanceof(File)
    //     .optional()
    //     .refine((file) => file === undefined || file instanceof File, {
    //         message: "Invalid file.",
    //     }),
});

export default function RequestForm() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            location: "",
            start_date: "",
            end_date: "",
            prize_pool: undefined,
            website_url: "",
            tags: [""],
            // image: undefined,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);

        let base64Image = null;
        // if (values.image) {
        //     const reader = new FileReader();
        //     base64Image = await new Promise<string>((resolve, reject) => {
        //         reader.onload = () => resolve(reader.result as string);
        //         reader.onerror = (error) => reject(error);
        //         reader.readAsDataURL(values.image!);
        //     });
        // }

        const payload = {
            ...values,
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
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6">Submit a Hackathon</h1>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block mb-2 font-medium">
                        Hackathon Name
                    </label>
                    <Input
                        {...form.register("name")}
                        placeholder="e.g., ETHDam"
                    />
                    <p className="text-red-500 text-sm">
                        {form.formState.errors.name?.message}
                    </p>
                </div>
                <div>
                    <label className="block mb-2 font-medium">Location</label>
                    <Input
                        {...form.register("location")}
                        placeholder="e.g., Amsterdam, Netherlands"
                    />
                    <p className="text-red-500 text-sm">
                        {form.formState.errors.location?.message}
                    </p>
                </div>
                <div>
                    <label className="block mb-2 font-medium">Start Date</label>
                    <Input {...form.register("start_date")} type="date" />
                    <p className="text-red-500 text-sm">
                        {form.formState.errors.start_date?.message}
                    </p>
                </div>
                <div>
                    <label className="block mb-2 font-medium">End Date</label>
                    <Input {...form.register("end_date")} type="date" />
                    <p className="text-red-500 text-sm">
                        {form.formState.errors.end_date?.message}
                    </p>
                </div>
                <div>
                    <label className="block mb-2 font-medium">
                        Prize Pool (Optional)
                    </label>
                    <Input
                        {...form.register("prize_pool")}
                        placeholder="e.g., 50000"
                    />
                    <p className="text-red-500 text-sm">
                        {form.formState.errors.prize_pool?.message}
                    </p>
                </div>
                <div>
                    <label className="block mb-2 font-medium">
                        Website URL (Optional)
                    </label>
                    <Input
                        {...form.register("website_url")}
                        placeholder="e.g., https://ethdam.com"
                    />
                    <p className="text-red-500 text-sm">
                        {form.formState.errors.website_url?.message}
                    </p>
                </div>
                <div>
                    <label className="block mb-2 font-medium">Tags</label>
                    <Textarea
                        {...form.register("tags")}
                        placeholder="Comma-separated tags, e.g., blockchain, web3"
                    />
                    <p className="text-red-500 text-sm">
                        {form.formState.errors.tags?.message}
                    </p>
                </div>
                <div>
                    <label className="block mb-2 font-medium">
                        Upload Image (Optional)
                    </label>
                    {/* <Input
                        {...form.register("image")}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            console.log(e.target.files?.[0]);
                            form.setValue("image", e.target.files?.[0]);
                        }}
                    />
                    <p className="text-red-500 text-sm">
                        {form.formState.errors.image?.message}
                    </p> */}
                </div>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Hackathon"}
                </Button>
            </form>
        </div>
    );
}
