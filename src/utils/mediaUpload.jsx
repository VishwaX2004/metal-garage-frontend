import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    throw new Error("VITE_SUPABASE_URL is not configured.");
}

if (!supabaseAnonKey) {
    throw new Error("VITE_SUPABASE_ANON_KEY is not configured.");
}

const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
);

export default async function mediaUpload(file) {

    if (!file) {
        throw new Error("Please select an image first.");
    }

    if (!(file instanceof File)) {
        throw new Error("Invalid image file.");
    }

    // Only allow images
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
        throw new Error(
            "Only JPG, PNG and WEBP images are allowed."
        );
    }

    // 10 MB maximum
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
        throw new Error(
            "Image size must be less than 10 MB."
        );
    }

    try {

        // Clean original filename
        const cleanFileName = file.name
            .replace(/[^a-zA-Z0-9.-]/g, "_");

        // Unique filename
        const timestamp = Date.now();

        const randomString = Math.random()
            .toString(36)
            .substring(2, 10);

        const fileName =
            `${timestamp}-${randomString}-${cleanFileName}`;

        console.log("Uploading image:", fileName);

        const {
            data,
            error
        } = await supabase.storage
            .from("images")
            .upload(
                fileName,
                file,
                {
                    cacheControl: "3600",
                    contentType: file.type,
                    upsert: false
                }
            );

        if (error) {
            console.error(
                "Supabase Storage upload error:",
                error
            );

            throw new Error(
                error.message ||
                "Failed to upload image to Supabase."
            );
        }

        if (!data || !data.path) {
            throw new Error(
                "Upload succeeded but no file path was returned."
            );
        }

        console.log(
            "Uploaded file path:",
            data.path
        );

        // Generate public URL
        const {
            data: publicUrlData
        } = supabase.storage
            .from("images")
            .getPublicUrl(data.path);

        if (
            !publicUrlData ||
            !publicUrlData.publicUrl
        ) {
            throw new Error(
                "Could not generate public image URL."
            );
        }

        const publicUrl =
            publicUrlData.publicUrl;

        console.log(
            "Public image URL:",
            publicUrl
        );

        return publicUrl;

    } catch (error) {

        console.error(
            "mediaUpload error:",
            error
        );

        throw error;
    }
}