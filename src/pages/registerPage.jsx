import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    Eye,
    EyeOff,
    Mail,
    User,
    Lock,
    UserPlus,
    ShieldCheck,
    CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();

    /* =========================================================
       STATE
    ========================================================= */

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);
    const [isLoading, setIsLoading] = useState(false);

    /* =========================================================
       API
    ========================================================= */

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    /* =========================================================
       INPUT HANDLER
    ========================================================= */

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    /* =========================================================
       VALIDATION
    ========================================================= */

    function validateForm() {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        } = formData;

        if (!firstName.trim()) {
            toast.error("Please enter your first name.");
            return false;
        }

        if (!lastName.trim()) {
            toast.error("Please enter your last name.");
            return false;
        }

        if (!email.trim()) {
            toast.error("Please enter your email address.");
            return false;
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            toast.error("Please enter a valid email address.");
            return false;
        }

        if (!password) {
            toast.error("Please enter a password.");
            return false;
        }

        if (password.length < 6) {
            toast.error(
                "Password must contain at least 6 characters."
            );
            return false;
        }

        if (!confirmPassword) {
            toast.error("Please confirm your password.");
            return false;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return false;
        }

        return true;
    }

    /* =========================================================
       REGISTER
    ========================================================= */

    async function handleSubmit(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);

            const response = await axios.post(
                `${API_URL}/api/users`,
                {
                    email: formData.email
                        .trim()
                        .toLowerCase(),
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                    password: formData.password,
                }
            );

            toast.success(
                response.data?.message ||
                    "Account created successfully!"
            );

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
            });

            setTimeout(() => {
                navigate("/login");
            }, 900);
        } catch (error) {
            console.error(
                "Registration error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Unable to create your account.";

            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    /* =========================================================
       PASSWORD STRENGTH
    ========================================================= */

    const passwordLength =
        formData.password.length;

    const passwordStrong =
        passwordLength >= 8;

    const passwordValid =
        passwordLength >= 6;

    /* =========================================================
       UI
    ========================================================= */

    return (
        <div className="relative h-[100dvh] w-full overflow-hidden bg-[#050505]">

            {/* =====================================================
                BACKGROUND
            ===================================================== */}

            <div className="absolute inset-0">
                <img
                    src="/loginbg.png"
                    alt="Metal Garage"
                    className="
                        h-full
                        w-full
                        object-cover
                        object-center
                    "
                />

                <div className="absolute inset-0 bg-black/70" />

                <div
                    className="
                        absolute
                        -left-32
                        -top-32
                        h-[420px]
                        w-[420px]
                        rounded-full
                        bg-[#FF8F00]/15
                        blur-[130px]
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-32
                        -right-32
                        h-[420px]
                        w-[420px]
                        rounded-full
                        bg-[#FF3B00]/10
                        blur-[130px]
                    "
                />

                <div
                    className="
                        absolute
                        inset-0
                        opacity-[0.035]
                    "
                    style={{
                        backgroundImage:
                            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                        backgroundSize: "50px 50px",
                    }}
                />
            </div>

            {/* =====================================================
                TOP BRAND
            ===================================================== */}

            <motion.div
                initial={{
                    opacity: 0,
                    y: -15,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.5,
                }}
                className="
                    absolute
                    left-4
                    top-3
                    z-30
                    flex
                    items-center
                    gap-2
                    sm:left-7
                    sm:top-5
                "
            >
                <div
                    className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        border
                        border-[#FF8F00]/50
                        bg-black/50
                        backdrop-blur-md
                    "
                >
                    <span
                        className="
                            text-sm
                            font-black
                            italic
                            text-[#FF8F00]
                        "
                    >
                        MG
                    </span>
                </div>

                <div>
                    <p
                        className="
                            text-xs
                            font-black
                            uppercase
                            tracking-[0.18em]
                            text-white
                        "
                    >
                        Metal Garage
                    </p>

                    <p
                        className="
                            font-mono
                            text-[7px]
                            uppercase
                            tracking-[0.2em]
                            text-white/40
                        "
                    >
                        Die-Cast Collection
                    </p>
                </div>
            </motion.div>

            {/* =====================================================
                BACK BUTTON
            ===================================================== */}

            <motion.button
                initial={{
                    opacity: 0,
                    x: 15,
                }}
                animate={{
                    opacity: 1,
                    x: 0,
                }}
                transition={{
                    duration: 0.5,
                    delay: 0.1,
                }}
                type="button"
                onClick={() => navigate("/")}
                className="
                    group
                    absolute
                    right-4
                    top-3
                    z-30
                    flex
                    items-center
                    gap-2
                    border
                    border-white/10
                    bg-black/40
                    px-3
                    py-2
                    font-mono
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-white/60
                    backdrop-blur-md
                    transition
                    hover:border-[#FF8F00]/50
                    hover:text-[#FF8F00]
                    sm:right-7
                    sm:top-5
                "
            >
                <ArrowLeft
                    size={12}
                    className="
                        transition-transform
                        group-hover:-translate-x-1
                    "
                />

                Back
            </motion.button>

            {/* =====================================================
                MAIN
            ===================================================== */}

            <main
                className="
                    relative
                    z-20
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    overflow-hidden
                    px-3
                    py-3
                    sm:px-6
                    md:px-8
                "
            >
                {/* =================================================
                    REGISTER CARD
                ================================================= */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                        scale: 0.97,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.65,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="
                        flex
                        w-full
                        max-w-[720px]
                        max-h-[calc(100dvh-24px)]
                        items-center
                    "
                >
                    <div
                        className="
                            relative
                            w-full
                            overflow-hidden
                            border
                            border-white/15
                            bg-[#0B0B0B]/95
                            shadow-[0_30px_100px_rgba(0,0,0,0.65)]
                            backdrop-blur-xl
                        "
                    >

                        {/* =================================================
                            TOP ACCENT
                        ================================================= */}

                        <div
                            className="
                                absolute
                                left-0
                                right-0
                                top-0
                                h-[3px]
                                bg-[#FF8F00]
                                shadow-[0_0_20px_rgba(255,143,0,0.6)]
                            "
                        />

                        <div
                            className="
                                absolute
                                right-0
                                top-0
                                h-20
                                w-20
                                opacity-20
                            "
                            style={{
                                background:
                                    "linear-gradient(135deg, transparent 50%, #FF8F00 50%)",
                            }}
                        />

                        {/* =================================================
                            CARD HEADER
                        ================================================= */}

                        <div
                            className="
                                border-b
                                border-white/10
                                px-6
                                pb-5
                                pt-6
                                sm:px-8
                                sm:pb-6
                                sm:pt-7
                                md:px-10
                            "
                        >
                            <div
                                className="
                                    mb-3
                                    flex
                                    items-center
                                    justify-between
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <div
                                        className="
                                            h-7
                                            w-1
                                            bg-[#FF8F00]
                                        "
                                    />

                                    <span
                                        className="
                                            font-mono
                                            text-[9px]
                                            font-bold
                                            uppercase
                                            tracking-[0.25em]
                                            text-[#FF8F00]
                                        "
                                    >
                                        Garage Access
                                    </span>
                                </div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-1.5
                                        font-mono
                                        text-[8px]
                                        font-bold
                                        uppercase
                                        tracking-[0.15em]
                                        text-white/35
                                    "
                                >
                                    <ShieldCheck size={13} />
                                    Secure
                                </div>
                            </div>

                            <h1
                                className="
                                    text-[32px]
                                    font-black
                                    uppercase
                                    leading-none
                                    tracking-[-0.04em]
                                    text-white
                                    sm:text-[40px]
                                    md:text-[44px]
                                "
                            >
                                Build Your{" "}
                                <span className="text-[#FF8F00]">
                                    Garage.
                                </span>
                            </h1>

                            <p
                                className="
                                    mt-2
                                    max-w-[520px]
                                    text-[10px]
                                    leading-relaxed
                                    text-white/45
                                    sm:text-[11px]
                                    md:text-xs
                                "
                            >
                                Create your account and start
                                building your die-cast collection.
                            </p>
                        </div>

                        {/* =================================================
                            FORM AREA
                        ================================================= */}

                        <div
                            className="
                                px-6
                                py-5
                                sm:px-8
                                sm:py-6
                                md:px-10
                                md:py-7
                            "
                        >
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-3"
                            >

                                {/* =================================================
                                    NAMES
                                ================================================= */}

                                <div className="grid grid-cols-2 gap-3">

                                    {/* First Name */}

                                    <div>
                                        <label
                                            htmlFor="firstName"
                                            className="
                                                mb-1.5
                                                block
                                                font-mono
                                                text-[8px]
                                                font-bold
                                                uppercase
                                                tracking-[0.15em]
                                                text-white/45
                                            "
                                        >
                                            First Name
                                        </label>

                                        <div className="relative">
                                            <User
                                                size={15}
                                                className="
                                                    absolute
                                                    left-3
                                                    top-1/2
                                                    -translate-y-1/2
                                                    text-white/25
                                                "
                                            />

                                            <input
                                                id="firstName"
                                                name="firstName"
                                                type="text"
                                                value={
                                                    formData.firstName
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Vishwa"
                                                autoComplete="given-name"
                                                disabled={isLoading}
                                                className="
                                                    h-11
                                                    w-full
                                                    border
                                                    border-white/10
                                                    bg-white/[0.04]
                                                    pl-9
                                                    pr-3
                                                    text-xs
                                                    font-medium
                                                    text-white
                                                    outline-none
                                                    transition
                                                    placeholder:text-white/20
                                                    hover:border-white/20
                                                    focus:border-[#FF8F00]
                                                    focus:bg-white/[0.07]
                                                "
                                            />
                                        </div>
                                    </div>

                                    {/* Last Name */}

                                    <div>
                                        <label
                                            htmlFor="lastName"
                                            className="
                                                mb-1.5
                                                block
                                                font-mono
                                                text-[8px]
                                                font-bold
                                                uppercase
                                                tracking-[0.15em]
                                                text-white/45
                                            "
                                        >
                                            Last Name
                                        </label>

                                        <div className="relative">
                                            <User
                                                size={15}
                                                className="
                                                    absolute
                                                    left-3
                                                    top-1/2
                                                    -translate-y-1/2
                                                    text-white/25
                                                "
                                            />

                                            <input
                                                id="lastName"
                                                name="lastName"
                                                type="text"
                                                value={
                                                    formData.lastName
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Pramuditha"
                                                autoComplete="family-name"
                                                disabled={isLoading}
                                                className="
                                                    h-11
                                                    w-full
                                                    border
                                                    border-white/10
                                                    bg-white/[0.04]
                                                    pl-9
                                                    pr-3
                                                    text-xs
                                                    font-medium
                                                    text-white
                                                    outline-none
                                                    transition
                                                    placeholder:text-white/20
                                                    hover:border-white/20
                                                    focus:border-[#FF8F00]
                                                    focus:bg-white/[0.07]
                                                "
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* =================================================
                                    EMAIL
                                ================================================= */}

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="
                                            mb-1.5
                                            block
                                            font-mono
                                            text-[8px]
                                            font-bold
                                            uppercase
                                            tracking-[0.15em]
                                            text-white/45
                                        "
                                    >
                                        Email Address
                                    </label>

                                    <div className="relative">
                                        <Mail
                                            size={15}
                                            className="
                                                absolute
                                                left-3
                                                top-1/2
                                                -translate-y-1/2
                                                text-white/25
                                            "
                                        />

                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={
                                                formData.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            disabled={isLoading}
                                            className="
                                                h-11
                                                w-full
                                                border
                                                border-white/10
                                                bg-white/[0.04]
                                                pl-9
                                                pr-3
                                                text-xs
                                                font-medium
                                                text-white
                                                outline-none
                                                transition
                                                placeholder:text-white/20
                                                hover:border-white/20
                                                focus:border-[#FF8F00]
                                                focus:bg-white/[0.07]
                                            "
                                        />
                                    </div>
                                </div>

                                {/* =================================================
                                    PASSWORDS
                                ================================================= */}

                                <div className="grid grid-cols-2 gap-3">

                                    {/* Password */}

                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="
                                                mb-1.5
                                                block
                                                font-mono
                                                text-[8px]
                                                font-bold
                                                uppercase
                                                tracking-[0.15em]
                                                text-white/45
                                            "
                                        >
                                            Password
                                        </label>

                                        <div className="relative">
                                            <Lock
                                                size={15}
                                                className="
                                                    absolute
                                                    left-3
                                                    top-1/2
                                                    -translate-y-1/2
                                                    text-white/25
                                                "
                                            />

                                            <input
                                                id="password"
                                                name="password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    formData.password
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="••••••••"
                                                autoComplete="new-password"
                                                disabled={isLoading}
                                                className="
                                                    h-11
                                                    w-full
                                                    border
                                                    border-white/10
                                                    bg-white/[0.04]
                                                    pl-9
                                                    pr-9
                                                    text-xs
                                                    font-medium
                                                    text-white
                                                    outline-none
                                                    transition
                                                    placeholder:text-white/20
                                                    hover:border-white/20
                                                    focus:border-[#FF8F00]
                                                    focus:bg-white/[0.07]
                                                "
                                            />

                                            <button
                                                type="button"
                                                tabIndex={-1}
                                                onClick={() =>
                                                    setShowPassword(
                                                        (value) =>
                                                            !value
                                                    )
                                                }
                                                className="
                                                    absolute
                                                    right-2
                                                    top-1/2
                                                    -translate-y-1/2
                                                    p-1
                                                    text-white/30
                                                    transition
                                                    hover:text-[#FF8F00]
                                                "
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={14} />
                                                ) : (
                                                    <Eye size={14} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password */}

                                    <div>
                                        <label
                                            htmlFor="confirmPassword"
                                            className="
                                                mb-1.5
                                                block
                                                font-mono
                                                text-[8px]
                                                font-bold
                                                uppercase
                                                tracking-[0.15em]
                                                text-white/45
                                            "
                                        >
                                            Confirm Password
                                        </label>

                                        <div className="relative">
                                            <Lock
                                                size={15}
                                                className="
                                                    absolute
                                                    left-3
                                                    top-1/2
                                                    -translate-y-1/2
                                                    text-white/25
                                                "
                                            />

                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    formData.confirmPassword
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="••••••••"
                                                autoComplete="new-password"
                                                disabled={isLoading}
                                                className="
                                                    h-11
                                                    w-full
                                                    border
                                                    border-white/10
                                                    bg-white/[0.04]
                                                    pl-9
                                                    pr-9
                                                    text-xs
                                                    font-medium
                                                    text-white
                                                    outline-none
                                                    transition
                                                    placeholder:text-white/20
                                                    hover:border-white/20
                                                    focus:border-[#FF8F00]
                                                    focus:bg-white/[0.07]
                                                "
                                            />

                                            <button
                                                type="button"
                                                tabIndex={-1}
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        (value) =>
                                                            !value
                                                    )
                                                }
                                                className="
                                                    absolute
                                                    right-2
                                                    top-1/2
                                                    -translate-y-1/2
                                                    p-1
                                                    text-white/30
                                                    transition
                                                    hover:text-[#FF8F00]
                                                "
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff size={14} />
                                                ) : (
                                                    <Eye size={14} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* =================================================
                                    PASSWORD STATUS
                                ================================================= */}

                                <div
                                    className="
                                        flex
                                        min-h-[18px]
                                        items-center
                                        justify-between
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-1.5
                                            font-mono
                                            text-[7px]
                                            uppercase
                                            tracking-[0.1em]
                                            text-white/30
                                        "
                                    >
                                        <span
                                            className={`
                                                h-1.5
                                                w-1.5
                                                rounded-full
                                                ${
                                                    passwordValid
                                                        ? "bg-[#FF8F00]"
                                                        : "bg-white/20"
                                                }
                                            `}
                                        />

                                        6+ Characters
                                    </div>

                                    {passwordLength > 0 && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                            }}
                                            animate={{
                                                opacity: 1,
                                            }}
                                            className={`
                                                flex
                                                items-center
                                                gap-1
                                                font-mono
                                                text-[7px]
                                                font-bold
                                                uppercase
                                                tracking-[0.1em]
                                                ${
                                                    passwordStrong
                                                        ? "text-[#FF8F00]"
                                                        : passwordValid
                                                        ? "text-white/50"
                                                        : "text-[#FF3B00]"
                                                }
                                            `}
                                        >
                                            {passwordStrong ? (
                                                <>
                                                    <CheckCircle2
                                                        size={10}
                                                    />
                                                    Strong
                                                </>
                                            ) : passwordValid ? (
                                                "Good"
                                            ) : (
                                                "Too Short"
                                            )}
                                        </motion.div>
                                    )}
                                </div>

                                {/* =================================================
                                    SUBMIT
                                ================================================= */}

                                <motion.button
                                    whileHover={
                                        !isLoading
                                            ? {
                                                  scale: 1.01,
                                              }
                                            : {}
                                    }
                                    whileTap={
                                        !isLoading
                                            ? {
                                                  scale: 0.985,
                                              }
                                            : {}
                                    }
                                    type="submit"
                                    disabled={isLoading}
                                    className="
                                        group
                                        relative
                                        flex
                                        h-12
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        overflow-hidden
                                        bg-[#FF8F00]
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.18em]
                                        text-black
                                        shadow-[0_8px_30px_rgba(255,143,0,0.15)]
                                        transition
                                        hover:bg-[#FFA21A]
                                        hover:shadow-[0_8px_35px_rgba(255,143,0,0.3)]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >
                                    <span
                                        className="
                                            absolute
                                            inset-y-0
                                            -left-20
                                            w-12
                                            skew-x-[-20deg]
                                            bg-white/30
                                            transition-all
                                            duration-700
                                            group-hover:left-[110%]
                                        "
                                    />

                                    {isLoading ? (
                                        <>
                                            <span
                                                className="
                                                    h-4
                                                    w-4
                                                    animate-spin
                                                    rounded-full
                                                    border-2
                                                    border-black/20
                                                    border-t-black
                                                "
                                            />

                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={15} />

                                            Create My Garage

                                            <ArrowRight
                                                size={15}
                                                className="
                                                    transition-transform
                                                    duration-300
                                                    group-hover:translate-x-1
                                                "
                                            />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            {/* =================================================
                                LOGIN LINK
                            ================================================= */}

                            <div
                                className="
                                    mt-4
                                    flex
                                    items-center
                                    justify-center
                                    gap-1.5
                                    text-[9px]
                                    text-white/35
                                "
                            >
                                <span>
                                    Already a member?
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/login")
                                    }
                                    className="
                                        font-bold
                                        text-white
                                        underline
                                        decoration-[#FF8F00]
                                        decoration-2
                                        underline-offset-3
                                        transition
                                        hover:text-[#FF8F00]
                                    "
                                >
                                    Sign In
                                </button>
                            </div>
                        </div>

                        {/* =================================================
                            CARD FOOTER
                        ================================================= */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                border-t
                                border-white/10
                                bg-white/[0.025]
                                px-6
                                py-3
                                sm:px-8
                                md:px-10
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-1.5
                                "
                            >
                                <span
                                    className="
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        bg-[#FF8F00]
                                        shadow-[0_0_8px_rgba(255,143,0,0.8)]
                                    "
                                />

                                <span
                                    className="
                                        font-mono
                                        text-[7px]
                                        font-bold
                                        uppercase
                                        tracking-[0.16em]
                                        text-white/25
                                    "
                                >
                                    Secure Registration
                                </span>
                            </div>

                            <span
                                className="
                                    font-mono
                                    text-[7px]
                                    font-bold
                                    uppercase
                                    tracking-[0.16em]
                                    text-white/20
                                "
                            >
                                EST. GARAGE 01
                            </span>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* =====================================================
                BOTTOM DECORATION
            ===================================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    bottom-2
                    left-1/2
                    z-20
                    hidden
                    -translate-x-1/2
                    font-mono
                    text-[7px]
                    uppercase
                    tracking-[0.3em]
                    text-white/15
                    sm:block
                "
            >
                PREMIUM DIE-CAST · EST. GARAGE 01
            </div>
        </div>
    );
}

