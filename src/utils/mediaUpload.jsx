import { createClient } from "@supabase/supabase-js";

// ============================================================
// SUPABASE CONFIG
// ============================================================

const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL;

const supabaseAnonKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY;

// ============================================================
// VALIDATE ENVIRONMENT
// ============================================================

if (!supabaseUrl) {
    throw new Error(
        "VITE_SUPABASE_URL is not configured."
    );
}

if (!supabaseAnonKey) {
    throw new Error(
        "VITE_SUPABASE_ANON_KEY is not configured."
    );
}

// ============================================================
// SUPABASE CLIENT
// ============================================================

const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
);

// ============================================================
// MEDIA UPLOADER
// ============================================================

export default async function mediaUpload(
    file
) {
    // --------------------------------------------------------
    // CHECK FILE
    // --------------------------------------------------------

    if (!file) {
        throw new Error(
            "Please select an image first."
        );
    }

    if (!(file instanceof File)) {
        throw new Error(
            "Invalid image file."
        );
    }

    // --------------------------------------------------------
    // ALLOWED FILE TYPES
    // --------------------------------------------------------

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
        throw new Error(
            "Only JPG, PNG and WEBP images are allowed."
        );
    }

    // --------------------------------------------------------
    // MAX SIZE = 10 MB
    // --------------------------------------------------------

    const maxSize =
        10 * 1024 * 1024;

    if (file.size > maxSize) {
        throw new Error(
            "Image size must be less than 10 MB."
        );
    }

    try {
        // ----------------------------------------------------
        // CLEAN FILE NAME
        // ----------------------------------------------------

        const cleanFileName =
            file.name.replace(
                /[^a-zA-Z0-9.-]/g,
                "_"
            );

        // ----------------------------------------------------
        // UNIQUE FILE NAME
        // ----------------------------------------------------

        const timestamp =
            Date.now();

        const randomString =
            Math.random()
                .toString(36)
                .substring(2, 10);

        const fileName =
            `profiles/${timestamp}-${randomString}-${cleanFileName}`;

        // ----------------------------------------------------
        // UPLOAD TO SUPABASE
        // ----------------------------------------------------

        const {
            data,
            error,
        } = await supabase.storage
            .from("images")
            .upload(
                fileName,
                file,
                {
                    cacheControl: "3600",
                    contentType:
                        file.type,
                    upsert: false,
                }
            );

        if (error) {
            console.error(
                "Supabase upload error:",
                error
            );

            throw new Error(
                error.message ||
                    "Failed to upload image."
            );
        }

        if (!data?.path) {
            throw new Error(
                "Upload completed but no image path was returned."
            );
        }

        // ----------------------------------------------------
        // GET PUBLIC URL
        // ----------------------------------------------------

        const {
            data: publicUrlData,
        } = supabase.storage
            .from("images")
            .getPublicUrl(
                data.path
            );

        if (
            !publicUrlData?.publicUrl
        ) {
            throw new Error(
                "Could not generate public image URL."
            );
        }

        return publicUrlData.publicUrl;
    } catch (error) {
        console.error(
            "mediaUpload error:",
            error
        );

        throw error;
    }
}