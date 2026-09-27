import { createClient } from "@supabase/supabase-js";

// ============================================================
// SUPABASE CONFIG
// ============================================================

const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL?.trim();

const supabaseAnonKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const BUCKET_NAME = "images";

// ============================================================
// VALIDATE ENVIRONMENT
// ============================================================

if (!supabaseUrl) {
    throw new Error(
        "VITE_SUPABASE_URL is missing from the .env file."
    );
}

if (!supabaseAnonKey) {
    throw new Error(
        "VITE_SUPABASE_ANON_KEY is missing from the .env file."
    );
}

// ============================================================
// NORMALIZE SUPABASE URL
// ============================================================

const normalizedSupabaseUrl =
    supabaseUrl.replace(/\/+$/, "");

// ============================================================
// VALIDATE SUPABASE URL
// ============================================================

try {
    const parsedUrl =
        new URL(normalizedSupabaseUrl);

    if (
        parsedUrl.protocol !== "https:" &&
        parsedUrl.protocol !== "http:"
    ) {
        throw new Error();
    }
} catch {
    throw new Error(
        "VITE_SUPABASE_URL is not a valid URL."
    );
}

// ============================================================
// SUPABASE CLIENT
// ============================================================

const supabase = createClient(
    normalizedSupabaseUrl,
    supabaseAnonKey,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
        },
    }
);

// ============================================================
// CONSTANTS
// ============================================================

const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const MAX_FILE_SIZE =
    10 * 1024 * 1024;

// ============================================================
// CREATE UNIQUE FILE PATH
// ============================================================

const createFilePath = (file) => {
    const cleanFileName =
        file.name
            .trim()
            .replace(
                /[^a-zA-Z0-9.-]/g,
                "_"
            );

    const timestamp =
        Date.now();

    const randomString =
        Math.random()
            .toString(36)
            .substring(2, 10);

    return `products/${timestamp}-${randomString}-${cleanFileName}`;
};

// ============================================================
// MEDIA UPLOAD
// ============================================================

export default async function mediaUpload(file) {
    // --------------------------------------------------------
    // FILE VALIDATION
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
    // FILE TYPE
    // --------------------------------------------------------

    if (
        !ALLOWED_FILE_TYPES.includes(
            file.type
        )
    ) {
        throw new Error(
            "Only JPG, PNG and WEBP images are allowed."
        );
    }

    // --------------------------------------------------------
    // FILE SIZE
    // --------------------------------------------------------

    if (
        file.size >
        MAX_FILE_SIZE
    ) {
        throw new Error(
            "Image size must be less than 10 MB."
        );
    }

    // --------------------------------------------------------
    // CREATE PATH
    // --------------------------------------------------------

    const filePath =
        createFilePath(file);

    console.log(
        "========================================"
    );

    console.log(
        "SUPABASE IMAGE UPLOAD"
    );

    console.log(
        "========================================"
    );

    console.log(
        "Supabase URL:",
        normalizedSupabaseUrl
    );

    console.log(
        "Bucket:",
        BUCKET_NAME
    );

    console.log(
        "File:",
        file.name
    );

    console.log(
        "File type:",
        file.type
    );

    console.log(
        "File size:",
        file.size
    );

    console.log(
        "Storage path:",
        filePath
    );

    try {
        // ----------------------------------------------------
        // UPLOAD
        // ----------------------------------------------------

        const {
            data,
            error,
        } =
            await supabase.storage
                .from(BUCKET_NAME)
                .upload(
                    filePath,
                    file,
                    {
                        cacheControl:
                            "3600",

                        contentType:
                            file.type,

                        upsert:
                            false,
                    }
                );

        // ----------------------------------------------------
        // SUPABASE ERROR
        // ----------------------------------------------------

        if (error) {
            console.error(
                "Supabase upload error:",
                error
            );

            console.error(
                "Supabase upload error message:",
                error.message
            );

            console.error(
                "Supabase upload error name:",
                error.name
            );

            console.error(
                "Supabase upload error status:",
                error.status
            );

            throw new Error(
                error.message ||
                    "Supabase image upload failed."
            );
        }

        // ----------------------------------------------------
        // CHECK RESPONSE
        // ----------------------------------------------------

        if (
            !data ||
            !data.path
        ) {
            console.error(
                "Invalid Supabase upload response:",
                data
            );

            throw new Error(
                "Supabase did not return an uploaded file path."
            );
        }

        console.log(
            "Upload successful:",
            data
        );

        // ----------------------------------------------------
        // GET PUBLIC URL
        // ----------------------------------------------------

        const {
            data: publicUrlData,
        } =
            supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(
                    data.path
                );

        const publicUrl =
            publicUrlData?.publicUrl;

        if (
            !publicUrl
        ) {
            throw new Error(
                "Supabase did not return a public image URL."
            );
        }

        console.log(
            "Public image URL:",
            publicUrl
        );

        console.log(
            "========================================"
        );

        return publicUrl;
    } catch (error) {
        console.error(
            "mediaUpload error:",
            error
        );

        // ----------------------------------------------------
        // NETWORK ERROR
        // ----------------------------------------------------

        if (
            error?.message ===
                "Failed to fetch" ||
            error?.name ===
                "TypeError" ||
            error?.name ===
                "StorageUnknownError"
        ) {
            throw new Error(
                "Unable to connect to Supabase Storage. Check VITE_SUPABASE_URL, internet/DNS connection, and the Supabase project."
            );
        }

        throw error;
    }
}