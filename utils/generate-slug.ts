import slugify from "slugify";

// Generate a slug from a name
const generateSlug = (name: string) => {
    return slugify(name, {
        lower: true, // Convert to lowercase
        strict: true, // Remove special characters
        trim: true, // Remove leading/trailing spaces
    });
};
