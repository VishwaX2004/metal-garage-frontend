import {
    useEffect,
    useRef,
    useState,
} from "react";

import axios from "axios";

import toast from "react-hot-toast";

import {
    motion,
    AnimatePresence,
} from "framer-motion";

import {
    User,
    Mail,
    Lock,
    Camera,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    Save,
    Eye,
    EyeOff,
    LogOut,
    Settings,
    KeyRound,
    Upload,
    X,
    ArrowRight,
    Sparkles,
} from "lucide-react";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import Header from "../components/header";


import mediaUpload from "../utils/mediaUpload";
import Footer from "../components/footer";

// ============================================================
// CONSTANTS
// ============================================================

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

const DEFAULT_PROFILE_IMAGE =
    "https://training.allsoftsolutions.in/images/avtar.png";

// ============================================================
// ACCOUNT PAGE
// ============================================================

export default function AccountPage() {
    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    const fileInputRef =
        useRef(null);

    // ========================================================
    // USER
    // ========================================================

    const [user, setUser] =
        useState(null);

    // ========================================================
    // ACTIVE TAB
    // ========================================================

    const [activeTab, setActiveTab] =
        useState(
            searchParams.get("tab") ===
                "security"
                ? "security"
                : "profile"
        );

    // ========================================================
    // LOADING
    // ========================================================

    const [loading, setLoading] =
        useState(true);

    const [savingProfile, setSavingProfile] =
        useState(false);

    const [savingPassword, setSavingPassword] =
        useState(false);

    // ========================================================
    // PROFILE FORM
    // ========================================================

    const [firstName, setFirstName] =
        useState("");

    const [lastName, setLastName] =
        useState("");

    const [email, setEmail] =
        useState("");

    // ========================================================
    // PASSWORD FORM
    // ========================================================

    const [
        currentPassword,
        setCurrentPassword,
    ] = useState("");

    const [
        newPassword,
        setNewPassword,
    ] = useState("");

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    // ========================================================
    // PASSWORD VISIBILITY
    // ========================================================

    const [
        showCurrentPassword,
        setShowCurrentPassword,
    ] = useState(false);

    const [
        showNewPassword,
        setShowNewPassword,
    ] = useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    // ========================================================
    // PROFILE IMAGE
    // ========================================================

    const [
        selectedImage,
        setSelectedImage,
    ] = useState(null);

    const [
        imagePreview,
        setImagePreview,
    ] = useState(null);

    // ========================================================
    // AUTH TOKEN
    // ========================================================

    const getToken = () => {
        return localStorage.getItem(
            "token"
        );
    };

    // ========================================================
    // AUTH HEADERS
    // ========================================================

    const getAuthHeaders = () => {
        const token =
            getToken();

        return {
            Authorization: `Bearer ${token}`,
            "Content-Type":
                "application/json",
        };
    };

    // ========================================================
    // FETCH PROFILE
    // ========================================================

    useEffect(() => {
        fetchProfile();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ========================================================
    // FETCH USER FROM BACKEND
    // ========================================================

    const fetchProfile = async () => {
        const token =
            getToken();

        if (!token) {
            toast.error(
                "Please login to access your account."
            );

            navigate("/login");

            return;
        }

        try {
            setLoading(true);

            const response =
                await axios.get(
                    `${API_URL}/api/users/me`,
                    {
                        headers:
                            getAuthHeaders(),
                    }
                );

            const loggedUser =
                response.data.user;

            if (!loggedUser) {
                throw new Error(
                    "User information was not returned."
                );
            }

            // ------------------------------------------------
            // UPDATE STATE
            // ------------------------------------------------

            setUser(loggedUser);

            setFirstName(
                loggedUser.firstName ||
                    ""
            );

            setLastName(
                loggedUser.lastName ||
                    ""
            );

            setEmail(
                loggedUser.email ||
                    ""
            );

            // ------------------------------------------------
            // UPDATE LOCAL STORAGE
            // ------------------------------------------------

            localStorage.setItem(
                "user",
                JSON.stringify(
                    loggedUser
                )
            );

            localStorage.setItem(
                "currentUser",
                JSON.stringify(
                    loggedUser
                )
            );

            // ------------------------------------------------
            // UPDATE HEADER
            // ------------------------------------------------

            window.dispatchEvent(
                new CustomEvent(
                    "authUpdated",
                    {
                        detail:
                            loggedUser,
                    }
                )
            );
        } catch (error) {
            console.error(
                "fetchProfile error:",
                error
            );

            if (
                error.response?.status ===
                401
            ) {
                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                localStorage.removeItem(
                    "currentUser"
                );

                toast.error(
                    "Your session has expired. Please login again."
                );

                navigate("/login");

                return;
            }

            toast.error(
                error.response?.data
                    ?.message ||
                    "Unable to load your account."
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // IMAGE PREVIEW CLEANUP
    // ========================================================

    useEffect(() => {
        return () => {
            if (
                imagePreview &&
                imagePreview.startsWith(
                    "blob:"
                )
            ) {
                URL.revokeObjectURL(
                    imagePreview
                );
            }
        };
    }, [imagePreview]);

    // ========================================================
    // SELECT PROFILE IMAGE
    // ========================================================

    const handleImageChange = (
        event
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        // ----------------------------------------------------
        // FILE TYPE
        // ----------------------------------------------------

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {
            toast.error(
                "Only JPG, PNG and WEBP images are allowed."
            );

            event.target.value = "";

            return;
        }

        // ----------------------------------------------------
        // FILE SIZE
        // ----------------------------------------------------

        if (
            file.size >
            10 * 1024 * 1024
        ) {
            toast.error(
                "Image must be smaller than 10 MB."
            );

            event.target.value = "";

            return;
        }

        // ----------------------------------------------------
        // OLD PREVIEW CLEANUP
        // ----------------------------------------------------

        if (
            imagePreview &&
            imagePreview.startsWith(
                "blob:"
            )
        ) {
            URL.revokeObjectURL(
                imagePreview
            );
        }

        // ----------------------------------------------------
        // SET FILE
        // ----------------------------------------------------

        setSelectedImage(file);

        setImagePreview(
            URL.createObjectURL(
                file
            )
        );
    };

    // ========================================================
    // REMOVE SELECTED IMAGE
    // ========================================================

    const removeSelectedImage = () => {
        if (
            imagePreview &&
            imagePreview.startsWith(
                "blob:"
            )
        ) {
            URL.revokeObjectURL(
                imagePreview
            );
        }

        setSelectedImage(null);

        setImagePreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value =
                "";
        }
    };

    // ========================================================
    // SAVE PROFILE
    // ========================================================

    const handleSaveProfile =
        async (event) => {
            event.preventDefault();

            // ------------------------------------------------
            // VALIDATION
            // ------------------------------------------------

            if (
                !firstName.trim() ||
                !lastName.trim() ||
                !email.trim()
            ) {
                toast.error(
                    "Please complete all profile fields."
                );

                return;
            }

            // ------------------------------------------------
            // EMAIL VALIDATION
            // ------------------------------------------------

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !emailPattern.test(
                    email.trim()
                )
            ) {
                toast.error(
                    "Please enter a valid email address."
                );

                return;
            }

            const token =
                getToken();

            if (!token) {
                navigate("/login");

                return;
            }

            try {
                setSavingProfile(
                    true
                );

                let profileImage =
                    user?.profileImage ||
                    DEFAULT_PROFILE_IMAGE;

                // ------------------------------------------------
                // UPLOAD NEW PROFILE IMAGE
                // ------------------------------------------------

                if (selectedImage) {
                    toast.loading(
                        "Uploading profile picture...",
                        {
                            id: "profile-upload",
                        }
                    );

                    profileImage =
                        await mediaUpload(
                            selectedImage
                        );

                    toast.success(
                        "Profile picture uploaded.",
                        {
                            id: "profile-upload",
                        }
                    );
                }

                // ------------------------------------------------
                // UPDATE PROFILE
                // ------------------------------------------------

                const response =
                    await axios.put(
                        `${API_URL}/api/users/me`,
                        {
                            firstName:
                                firstName.trim(),

                            lastName:
                                lastName.trim(),

                            email:
                                email
                                    .trim()
                                    .toLowerCase(),

                            profileImage,
                        },
                        {
                            headers:
                                getAuthHeaders(),
                        }
                    );

                const updatedUser =
                    response.data.user;

                const newToken =
                    response.data.token;

                // ------------------------------------------------
                // UPDATE TOKEN
                // ------------------------------------------------

                if (newToken) {
                    localStorage.setItem(
                        "token",
                        newToken
                    );
                }

                // ------------------------------------------------
                // UPDATE USER
                // ------------------------------------------------

                setUser(
                    updatedUser
                );

                setFirstName(
                    updatedUser.firstName ||
                        ""
                );

                setLastName(
                    updatedUser.lastName ||
                        ""
                );

                setEmail(
                    updatedUser.email ||
                        ""
                );

                // ------------------------------------------------
                // LOCAL STORAGE
                // ------------------------------------------------

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        updatedUser
                    )
                );

                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(
                        updatedUser
                    )
                );

                // ------------------------------------------------
                // HEADER UPDATE
                // ------------------------------------------------

                window.dispatchEvent(
                    new CustomEvent(
                        "authUpdated",
                        {
                            detail:
                                updatedUser,
                        }
                    )
                );

                // ------------------------------------------------
                // CLEAR IMAGE STATE
                // ------------------------------------------------

                removeSelectedImage();

                toast.success(
                    "Account information updated successfully."
                );
            } catch (error) {
                console.error(
                    "handleSaveProfile error:",
                    error
                );

                toast.dismiss(
                    "profile-upload"
                );

                toast.error(
                    error.response?.data
                        ?.message ||
                        error.message ||
                        "Failed to update your account."
                );
            } finally {
                setSavingProfile(
                    false
                );
            }
        };

    // ========================================================
    // UPDATE PASSWORD
    // ========================================================

    const handleUpdatePassword =
        async (event) => {
            event.preventDefault();

            // ------------------------------------------------
            // VALIDATION
            // ------------------------------------------------

            if (
                !currentPassword ||
                !newPassword ||
                !confirmPassword
            ) {
                toast.error(
                    "Please complete all password fields."
                );

                return;
            }

            if (
                newPassword.length < 6
            ) {
                toast.error(
                    "New password must contain at least 6 characters."
                );

                return;
            }

            if (
                newPassword !==
                confirmPassword
            ) {
                toast.error(
                    "New passwords do not match."
                );

                return;
            }

            if (
                currentPassword ===
                newPassword
            ) {
                toast.error(
                    "New password must be different from your current password."
                );

                return;
            }

            try {
                setSavingPassword(
                    true
                );

                const response =
                    await axios.put(
                        `${API_URL}/api/users/me`,
                        {
                            currentPassword,
                            newPassword,
                        },
                        {
                            headers:
                                getAuthHeaders(),
                        }
                    );

                const updatedUser =
                    response.data.user;

                const newToken =
                    response.data.token;

                // ------------------------------------------------
                // UPDATE TOKEN
                // ------------------------------------------------

                if (newToken) {
                    localStorage.setItem(
                        "token",
                        newToken
                    );
                }

                // ------------------------------------------------
                // UPDATE USER
                // ------------------------------------------------

                setUser(
                    updatedUser
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        updatedUser
                    )
                );

                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(
                        updatedUser
                    )
                );

                // ------------------------------------------------
                // UPDATE HEADER
                // ------------------------------------------------

                window.dispatchEvent(
                    new CustomEvent(
                        "authUpdated",
                        {
                            detail:
                                updatedUser,
                        }
                    )
                );

                // ------------------------------------------------
                // CLEAR PASSWORD FIELDS
                // ------------------------------------------------

                setCurrentPassword(
                    ""
                );

                setNewPassword("");

                setConfirmPassword("");

                toast.success(
                    "Password updated successfully."
                );
            } catch (error) {
                console.error(
                    "handleUpdatePassword error:",
                    error
                );

                if (
                    error.response
                        ?.status === 401
                ) {
                    toast.error(
                        "Current password is incorrect."
                    );
                } else {
                    toast.error(
                        error.response?.data
                            ?.message ||
                            "Failed to update password."
                    );
                }
            } finally {
                setSavingPassword(
                    false
                );
            }
        };

    // ========================================================
    // LOGOUT
    // ========================================================

    const handleLogout = () => {
        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        localStorage.removeItem(
            "currentUser"
        );

        window.dispatchEvent(
            new CustomEvent(
                "authUpdated"
            )
        );

        toast.success(
            "You have been logged out."
        );

        navigate("/");
    };

    // ========================================================
    // INITIALS
    // ========================================================

    const getInitials = () => {
        const first =
            user?.firstName?.[0] ||
            "";

        const last =
            user?.lastName?.[0] ||
            "";

        return (
            first + last
        ).toUpperCase() || "MG";
    };

    // ========================================================
    // LOADING SCREEN
    // ========================================================

    if (loading) {
        return (
            <>
                <Header />

                <main className="min-h-screen bg-[#F5F5DC] flex items-center justify-center px-6">
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.9,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        className="text-center"
                    >
                        <div className="relative mx-auto mb-6 h-16 w-16">
                            <div className="absolute inset-0 rounded-full border-4 border-black/10" />

                            <motion.div
                                animate={{
                                    rotate: 360,
                                }}
                                transition={{
                                    duration: 1,
                                    repeat:
                                        Infinity,
                                    ease: "linear",
                                }}
                                className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FF8F00]"
                            />
                        </div>

                        <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-black/50">
                            Loading Garage Account
                        </p>
                    </motion.div>
                </main>
            </>
        );
    }

    // ========================================================
    // PAGE
    // ========================================================

    return (
        <div className="min-h-screen bg-[#F5F5DC] text-[#0A0A0A]">
            <Header />

            {/* ==================================================
                MAIN
            ================================================== */}

            <main className="relative overflow-hidden">
                {/* Background details */}

                <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#FF8F00]/10 blur-3xl" />

                <div className="pointer-events-none absolute -right-32 top-[30rem] h-96 w-96 rounded-full bg-[#FF3B00]/10 blur-3xl" />

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                    {/* ==================================================
                        HEADER
                    ================================================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.5,
                        }}
                        className="mb-8"
                    >
                        <div className="mb-3 flex items-center gap-3">
                            <span className="h-px w-10 bg-[#FF8F00]" />

                            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">
                                GARAGE / ACCOUNT
                            </span>
                        </div>

                        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                            <div>
                                <h1 className="font-[Oswald] text-4xl font-bold uppercase tracking-tight sm:text-5xl">
                                    My Account
                                </h1>

                                <p className="mt-2 max-w-xl text-sm text-black/55">
                                    Manage your Metal Garage
                                    profile, personal
                                    information and account
                                    security.
                                </p>
                            </div>

                            <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white/50 px-4 py-2">
                                <Sparkles
                                    size={14}
                                    className="text-[#FF8F00]"
                                />

                                <span className="font-mono text-[10px] font-bold uppercase tracking-widest">
                                    Collector Account
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* ==================================================
                        ACCOUNT GRID
                    ================================================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 25,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.6,
                            delay: 0.1,
                        }}
                        className="grid gap-6 lg:grid-cols-[300px_1fr]"
                    >
                        {/* ==================================================
                            SIDEBAR
                        ================================================== */}

                        <aside className="h-fit overflow-hidden rounded-3xl bg-[#0A0A0A] text-white shadow-2xl">
                            {/* Profile identity */}

                            <div className="relative overflow-hidden p-6">
                                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#FF8F00]/20 blur-2xl" />

                                <div className="relative">
                                    {/* Avatar */}

                                    <div className="mb-5 flex items-center gap-4">
                                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-[#FF8F00] bg-[#F5F5DC]">
                                            {imagePreview ||
                                            user?.profileImage ? (
                                                <img
                                                    src={
                                                        imagePreview ||
                                                        user.profileImage
                                                    }
                                                    alt="Profile"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-[#FF8F00] font-[Oswald] text-xl font-bold text-black">
                                                    {getInitials()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate font-[Oswald] text-xl font-bold uppercase">
                                                {user?.firstName}{" "}
                                                {
                                                    user?.lastName
                                                }
                                            </p>

                                            <p className="truncate font-mono text-[10px] text-white/45">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status */}

                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-[#4ADE80]" />

                                            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/70">
                                                Account Active
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}

                            <div className="border-t border-white/10 p-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveTab(
                                            "profile"
                                        )
                                    }
                                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                                        activeTab ===
                                        "profile"
                                            ? "bg-[#FF8F00] text-black"
                                            : "text-white/60 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    <User
                                        size={18}
                                    />

                                    <div>
                                        <p className="font-[Oswald] text-sm font-bold uppercase">
                                            Profile
                                        </p>

                                        <p
                                            className={`font-mono text-[9px] ${
                                                activeTab ===
                                                "profile"
                                                    ? "text-black/60"
                                                    : "text-white/30"
                                            }`}
                                        >
                                            Personal information
                                        </p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveTab(
                                            "security"
                                        )
                                    }
                                    className={`mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                                        activeTab ===
                                        "security"
                                            ? "bg-[#FF8F00] text-black"
                                            : "text-white/60 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    <Lock
                                        size={18}
                                    />

                                    <div>
                                        <p className="font-[Oswald] text-sm font-bold uppercase">
                                            Security
                                        </p>

                                        <p
                                            className={`font-mono text-[9px] ${
                                                activeTab ===
                                                "security"
                                                    ? "text-black/60"
                                                    : "text-white/30"
                                            }`}
                                        >
                                            Password & security
                                        </p>
                                    </div>
                                </button>
                            </div>

                            {/* Account information */}

                            <div className="border-t border-white/10 p-6">
                                <div className="mb-4 flex items-center gap-2">
                                    <ShieldCheck
                                        size={15}
                                        className="text-[#FF8F00]"
                                    />

                                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                                        Account Information
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-[9px] uppercase text-white/35">
                                            Role
                                        </span>

                                        <span className="rounded-full bg-white/10 px-2 py-1 font-mono text-[9px] font-bold uppercase text-white/70">
                                            {user?.role ||
                                                "user"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-[9px] uppercase text-white/35">
                                            Email
                                        </span>

                                        <span className="font-mono text-[9px] text-white/70">
                                            {user?.isEmailVerified
                                                ? "Verified"
                                                : "Not verified"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Logout */}

                            <div className="border-t border-white/10 p-3">
                                <button
                                    type="button"
                                    onClick={
                                        handleLogout
                                    }
                                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-white/45 transition hover:bg-[#FF3B00]/10 hover:text-[#FF3B00]"
                                >
                                    <span className="flex items-center gap-3">
                                        <LogOut
                                            size={17}
                                        />

                                        <span className="font-[Oswald] text-sm font-bold uppercase">
                                            Sign Out
                                        </span>
                                    </span>

                                    <ArrowRight
                                        size={15}
                                    />
                                </button>
                            </div>
                        </aside>

                        {/* ==================================================
                            CONTENT
                        ================================================== */}

                        <section className="min-w-0">
                            <AnimatePresence mode="wait">
                                {/* ==================================================
                                    PROFILE TAB
                                ================================================== */}

                                {activeTab ===
                                    "profile" && (
                                    <motion.div
                                        key="profile"
                                        initial={{
                                            opacity: 0,
                                            x: 15,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            x: -15,
                                        }}
                                        transition={{
                                            duration: 0.25,
                                        }}
                                        className="overflow-hidden rounded-3xl border border-black/10 bg-white/55 shadow-xl backdrop-blur-sm"
                                    >
                                        {/* Section heading */}

                                        <div className="border-b border-black/10 p-6 sm:p-8">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[#FF8F00]">
                                                        PROFILE
                                                    </p>

                                                    <h2 className="font-[Oswald] text-2xl font-bold uppercase sm:text-3xl">
                                                        Personal Information
                                                    </h2>

                                                    <p className="mt-2 text-sm text-black/45">
                                                        Keep your Metal
                                                        Garage account
                                                        information
                                                        up to date.
                                                    </p>
                                                </div>

                                                <div className="hidden rounded-2xl bg-[#0A0A0A] p-3 text-white sm:block">
                                                    <Settings
                                                        size={
                                                            20
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <form
                                            onSubmit={
                                                handleSaveProfile
                                            }
                                            className="p-6 sm:p-8"
                                        >
                                            {/* ==================================================
                                                PROFILE IMAGE
                                            ================================================== */}

                                            <div className="mb-8">
                                                <label className="mb-3 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/50">
                                                    Profile Picture
                                                </label>

                                                <div className="flex flex-col gap-5 rounded-2xl border border-dashed border-black/15 bg-[#F5F5DC]/60 p-5 sm:flex-row sm:items-center">
                                                    {/* Avatar */}

                                                    <div className="relative mx-auto h-28 w-28 shrink-0 sm:mx-0">
                                                        <div className="h-full w-full overflow-hidden rounded-3xl border-4 border-white bg-[#0A0A0A] shadow-lg">
                                                            {imagePreview ||
                                                            user?.profileImage ? (
                                                                <img
                                                                    src={
                                                                        imagePreview ||
                                                                        user.profileImage
                                                                    }
                                                                    alt="Profile preview"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center bg-[#FF8F00] font-[Oswald] text-3xl font-bold">
                                                                    {getInitials()}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="absolute -bottom-2 -right-2 rounded-xl border-4 border-[#F5F5DC] bg-[#FF8F00] p-2 text-black">
                                                            <Camera
                                                                size={
                                                                    15
                                                                }
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Upload content */}

                                                    <div className="flex-1 text-center sm:text-left">
                                                        <h3 className="font-[Oswald] text-lg font-bold uppercase">
                                                            Update your photo
                                                        </h3>

                                                        <p className="mt-1 text-xs leading-5 text-black/45">
                                                            Use a JPG,
                                                            PNG or WEBP
                                                            image.
                                                            Maximum
                                                            file size is
                                                            10 MB.
                                                        </p>

                                                        <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                                                            <input
                                                                ref={
                                                                    fileInputRef
                                                                }
                                                                type="file"
                                                                accept="image/jpeg,image/png,image/webp"
                                                                onChange={
                                                                    handleImageChange
                                                                }
                                                                className="hidden"
                                                            />

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    fileInputRef.current?.click()
                                                                }
                                                                className="inline-flex items-center gap-2 rounded-xl bg-[#0A0A0A] px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-[#FF8F00] hover:text-black"
                                                            >
                                                                <Upload
                                                                    size={
                                                                        14
                                                                    }
                                                                />

                                                                Choose Image
                                                            </button>

                                                            {selectedImage && (
                                                                <button
                                                                    type="button"
                                                                    onClick={
                                                                        removeSelectedImage
                                                                    }
                                                                    className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider transition hover:border-[#FF3B00] hover:text-[#FF3B00]"
                                                                >
                                                                    <X
                                                                        size={
                                                                            14
                                                                        }
                                                                    />

                                                                    Remove
                                                                </button>
                                                            )}
                                                        </div>

                                                        {selectedImage && (
                                                            <p className="mt-3 font-mono text-[9px] text-[#FF8F00]">
                                                                Selected:{" "}
                                                                {
                                                                    selectedImage.name
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ==================================================
                                                NAME
                                            ================================================== */}

                                            <div className="grid gap-5 sm:grid-cols-2">
                                                {/* First Name */}

                                                <div>
                                                    <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-black/50">
                                                        First Name
                                                    </label>

                                                    <div className="relative">
                                                        <User
                                                            size={
                                                                16
                                                            }
                                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                                                        />

                                                        <input
                                                            type="text"
                                                            value={
                                                                firstName
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                setFirstName(
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="First name"
                                                            className="w-full rounded-xl border border-black/10 bg-white px-11 py-3.5 text-sm outline-none transition placeholder:text-black/25 focus:border-[#FF8F00] focus:ring-4 focus:ring-[#FF8F00]/10"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Last Name */}

                                                <div>
                                                    <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-black/50">
                                                        Last Name
                                                    </label>

                                                    <div className="relative">
                                                        <User
                                                            size={
                                                                16
                                                            }
                                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                                                        />

                                                        <input
                                                            type="text"
                                                            value={
                                                                lastName
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                setLastName(
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Last name"
                                                            className="w-full rounded-xl border border-black/10 bg-white px-11 py-3.5 text-sm outline-none transition placeholder:text-black/25 focus:border-[#FF8F00] focus:ring-4 focus:ring-[#FF8F00]/10"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ==================================================
                                                EMAIL
                                            ================================================== */}

                                            <div className="mt-5">
                                                <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-black/50">
                                                    Email Address
                                                </label>

                                                <div className="relative">
                                                    <Mail
                                                        size={
                                                            16
                                                        }
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                                                    />

                                                    <input
                                                        type="email"
                                                        value={
                                                            email
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setEmail(
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="you@example.com"
                                                        className="w-full rounded-xl border border-black/10 bg-white px-11 py-3.5 text-sm outline-none transition placeholder:text-black/25 focus:border-[#FF8F00] focus:ring-4 focus:ring-[#FF8F00]/10"
                                                    />
                                                </div>

                                                <p className="mt-2 flex items-center gap-1.5 font-mono text-[9px] text-black/35">
                                                    <AlertCircle
                                                        size={
                                                            11
                                                        }
                                                    />

                                                    Changing your email
                                                    may require
                                                    verification in a
                                                    future update.
                                                </p>
                                            </div>

                                            {/* ==================================================
                                                SAVE
                                            ================================================== */}

                                            <div className="mt-8 flex flex-col justify-between gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2
                                                        size={
                                                            16
                                                        }
                                                        className="text-green-600"
                                                    />

                                                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-black/40">
                                                        Changes are saved
                                                        securely
                                                    </span>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={
                                                        savingProfile
                                                    }
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF8F00] px-6 py-3.5 font-[Oswald] text-sm font-bold uppercase tracking-wider text-black shadow-lg shadow-[#FF8F00]/20 transition hover:-translate-y-0.5 hover:bg-[#ff9f1c] disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {savingProfile ? (
                                                        <>
                                                            <motion.div
                                                                animate={{
                                                                    rotate: 360,
                                                                }}
                                                                transition={{
                                                                    duration: 0.8,
                                                                    repeat:
                                                                        Infinity,
                                                                    ease: "linear",
                                                                }}
                                                            >
                                                                <Settings
                                                                    size={
                                                                        16
                                                                    }
                                                                />
                                                            </motion.div>

                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save
                                                                size={
                                                                    16
                                                                }
                                                            />

                                                            Save Changes
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}

                                {/* ==================================================
                                    SECURITY TAB
                                ================================================== */}

                                {activeTab ===
                                    "security" && (
                                    <motion.div
                                        key="security"
                                        initial={{
                                            opacity: 0,
                                            x: 15,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            x: -15,
                                        }}
                                        transition={{
                                            duration: 0.25,
                                        }}
                                        className="overflow-hidden rounded-3xl border border-black/10 bg-white/55 shadow-xl backdrop-blur-sm"
                                    >
                                        {/* Header */}

                                        <div className="border-b border-black/10 p-6 sm:p-8">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[#FF8F00]">
                                                        SECURITY
                                                    </p>

                                                    <h2 className="font-[Oswald] text-2xl font-bold uppercase sm:text-3xl">
                                                        Account Security
                                                    </h2>

                                                    <p className="mt-2 max-w-xl text-sm text-black/45">
                                                        Protect your Metal
                                                        Garage account by
                                                        keeping your
                                                        password strong
                                                        and private.
                                                    </p>
                                                </div>

                                                <div className="hidden rounded-2xl bg-[#0A0A0A] p-3 text-white sm:block">
                                                    <KeyRound
                                                        size={
                                                            20
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <form
                                            onSubmit={
                                                handleUpdatePassword
                                            }
                                            className="p-6 sm:p-8"
                                        >
                                            {/* ==================================================
                                                SECURITY NOTICE
                                            ================================================== */}

                                            <div className="mb-8 flex gap-4 rounded-2xl border border-[#FF8F00]/20 bg-[#FF8F00]/5 p-5">
                                                <div className="shrink-0 rounded-xl bg-[#FF8F00] p-2.5 text-black">
                                                    <ShieldCheck
                                                        size={
                                                            18
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    <h3 className="font-[Oswald] text-base font-bold uppercase">
                                                        Keep your account
                                                        secure
                                                    </h3>

                                                    <p className="mt-1 text-xs leading-5 text-black/50">
                                                        Use a unique
                                                        password with at
                                                        least 6 characters.
                                                        Never share your
                                                        password with
                                                        anyone.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* ==================================================
                                                CURRENT PASSWORD
                                            ================================================== */}

                                            <div>
                                                <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-black/50">
                                                    Current Password
                                                </label>

                                                <div className="relative">
                                                    <Lock
                                                        size={
                                                            16
                                                        }
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                                                    />

                                                    <input
                                                        type={
                                                            showCurrentPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        value={
                                                            currentPassword
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setCurrentPassword(
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="Enter current password"
                                                        className="w-full rounded-xl border border-black/10 bg-white px-11 py-3.5 pr-12 text-sm outline-none transition placeholder:text-black/25 focus:border-[#FF8F00] focus:ring-4 focus:ring-[#FF8F00]/10"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowCurrentPassword(
                                                                !showCurrentPassword
                                                            )
                                                        }
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/35 transition hover:text-black"
                                                    >
                                                        {showCurrentPassword ? (
                                                            <EyeOff
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        ) : (
                                                            <Eye
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* ==================================================
                                                NEW PASSWORD
                                            ================================================== */}

                                            <div className="mt-5">
                                                <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-black/50">
                                                    New Password
                                                </label>

                                                <div className="relative">
                                                    <KeyRound
                                                        size={
                                                            16
                                                        }
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                                                    />

                                                    <input
                                                        type={
                                                            showNewPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        value={
                                                            newPassword
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setNewPassword(
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="Enter new password"
                                                        className="w-full rounded-xl border border-black/10 bg-white px-11 py-3.5 pr-12 text-sm outline-none transition placeholder:text-black/25 focus:border-[#FF8F00] focus:ring-4 focus:ring-[#FF8F00]/10"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowNewPassword(
                                                                !showNewPassword
                                                            )
                                                        }
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/35 transition hover:text-black"
                                                    >
                                                        {showNewPassword ? (
                                                            <EyeOff
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        ) : (
                                                            <Eye
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* ==================================================
                                                CONFIRM PASSWORD
                                            ================================================== */}

                                            <div className="mt-5">
                                                <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-black/50">
                                                    Confirm New Password
                                                </label>

                                                <div className="relative">
                                                    <KeyRound
                                                        size={
                                                            16
                                                        }
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                                                    />

                                                    <input
                                                        type={
                                                            showConfirmPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        value={
                                                            confirmPassword
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setConfirmPassword(
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="Confirm new password"
                                                        className={`w-full rounded-xl border bg-white px-11 py-3.5 pr-12 text-sm outline-none transition placeholder:text-black/25 focus:ring-4 ${
                                                            confirmPassword &&
                                                            newPassword !==
                                                                confirmPassword
                                                                ? "border-[#FF3B00] focus:border-[#FF3B00] focus:ring-[#FF3B00]/10"
                                                                : "border-black/10 focus:border-[#FF8F00] focus:ring-[#FF8F00]/10"
                                                        }`}
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowConfirmPassword(
                                                                !showConfirmPassword
                                                            )
                                                        }
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/35 transition hover:text-black"
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        ) : (
                                                            <Eye
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        )}
                                                    </button>
                                                </div>

                                                {confirmPassword &&
                                                    newPassword !==
                                                        confirmPassword && (
                                                        <p className="mt-2 font-mono text-[9px] font-bold text-[#FF3B00]">
                                                            Passwords do not
                                                            match.
                                                        </p>
                                                    )}

                                                {confirmPassword &&
                                                    newPassword ===
                                                        confirmPassword && (
                                                        <p className="mt-2 flex items-center gap-1 font-mono text-[9px] font-bold text-green-600">
                                                            <CheckCircle2
                                                                size={
                                                                    11
                                                                }
                                                            />

                                                            Passwords match.
                                                        </p>
                                                    )}
                                            </div>

                                            {/* ==================================================
                                                PASSWORD REQUIREMENTS
                                            ================================================== */}

                                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                                <div className="flex items-center gap-2 rounded-xl bg-[#F5F5DC] p-3">
                                                    <CheckCircle2
                                                        size={
                                                            14
                                                        }
                                                        className={
                                                            newPassword.length >=
                                                            6
                                                                ? "text-green-600"
                                                                : "text-black/20"
                                                        }
                                                    />

                                                    <span className="font-mono text-[9px] font-bold uppercase text-black/45">
                                                        6+ Characters
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 rounded-xl bg-[#F5F5DC] p-3">
                                                    <CheckCircle2
                                                        size={
                                                            14
                                                        }
                                                        className={
                                                            newPassword &&
                                                            confirmPassword &&
                                                            newPassword ===
                                                                confirmPassword
                                                                ? "text-green-600"
                                                                : "text-black/20"
                                                        }
                                                    />

                                                    <span className="font-mono text-[9px] font-bold uppercase text-black/45">
                                                        Passwords Match
                                                    </span>
                                                </div>
                                            </div>

                                            {/* ==================================================
                                                SAVE PASSWORD
                                            ================================================== */}

                                            <div className="mt-8 flex flex-col justify-between gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center">
                                                <div className="flex items-center gap-2">
                                                    <ShieldCheck
                                                        size={
                                                            16
                                                        }
                                                        className="text-green-600"
                                                    />

                                                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-black/40">
                                                        Password encrypted
                                                        securely
                                                    </span>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={
                                                        savingPassword
                                                    }
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A0A0A] px-6 py-3.5 font-[Oswald] text-sm font-bold uppercase tracking-wider text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#FF8F00] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {savingPassword ? (
                                                        <>
                                                            <motion.div
                                                                animate={{
                                                                    rotate: 360,
                                                                }}
                                                                transition={{
                                                                    duration: 0.8,
                                                                    repeat:
                                                                        Infinity,
                                                                    ease: "linear",
                                                                }}
                                                            >
                                                                <Settings
                                                                    size={
                                                                        16
                                                                    }
                                                                />
                                                            </motion.div>

                                                            Updating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save
                                                                size={
                                                                    16
                                                                }
                                                            />

                                                            Update Password
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}