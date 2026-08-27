import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
} from "lucide-react";

export default function LoginPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    async function handleLogin() {

        try {

            const response = await axios.post(
                import.meta.env.VITE_API_URL + "api/users/login",
                {
                    username: username,
                    password: password
                }
            );

            toast.success("Login successful!");

            localStorage.setItem("token", response.data.token);

            const user = response.data.user;

            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }

        } catch (error) {
            toast.error("Invalid username or password");
            console.log(error);
        }

    }

    return (
        <div className="h-screen w-full overflow-hidden bg-[#050504] text-[#0A0A0A]">

            {/* Background */}
            <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_900px_620px_at_22%_20%,rgba(255,143,0,0.10),transparent_60%),radial-gradient(ellipse_700px_600px_at_82%_78%,rgba(232,185,104,0.06),transparent_55%),radial-gradient(ellipse_1200px_900px_at_50%_50%,#14110b_0%,#050504_72%)]" />

            {/* Main screen */}
            <div className="relative z-10 flex h-screen w-full flex-col">

                {/* Top bar */}
                <div className="flex h-[20px] shrink-0 items-center justify-between px-5 sm:px-8 lg:px-10">

                </div>

                {/* Content */}
                <div className="flex min-h-0 flex-1 items-stretch justify-center px-0 pb-0 sm:px-5 sm:pb-5 lg:px-8">

                    <div className="flex min-h-0 w-full max-w-[1180px] flex-1 overflow-hidden border border-[#F5F5DC]/5 shadow-[0_35px_80px_rgba(0,0,0,0.55)] sm:rounded-[20px]">

                        {/* LEFT SIDE */}
                        <div className="relative hidden min-h-0 flex-1 flex-col overflow-hidden bg-[radial-gradient(ellipse_520px_420px_at_30%_22%,rgba(255,143,0,0.16),transparent_60%),radial-gradient(ellipse_460px_420px_at_90%_90%,rgba(232,185,104,0.08),transparent_55%),linear-gradient(160deg,#171410_0%,#0A0906_60%,#050403_100%)] px-8 py-6 text-[#F7F5EC] md:flex lg:px-11">

                            {/* Grid */}
                            <div
                                className="pointer-events-none absolute inset-0 opacity-30"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(rgba(245,245,220,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,220,0.035) 1px, transparent 1px)",
                                    backgroundSize: "40px 40px",
                                    maskImage:
                                        "radial-gradient(ellipse at 40% 45%, black 20%, transparent 72%)",
                                    WebkitMaskImage:
                                        "radial-gradient(ellipse at 40% 45%, black 20%, transparent 72%)",
                                }}
                            />

                            {/* Vertical line */}
                            <div className="pointer-events-none absolute right-[12%] top-0 h-full w-px bg-gradient-to-b from-transparent via-[#FF8F00]/20 to-transparent" />

                            {/* Logo */}
                            <div className="relative z-10 flex shrink-0 items-center justify-between">

                                <img
                                    src="/logo.png"
                                    alt="Metal Garage"
                                    className="h-[38px] w-[100px] object-contain mb-1"
                                />

                                <div className="flex items-center gap-2 rounded-full border border-[#F5F5DC]/15 bg-[#F5F5DC]/[0.03] px-2.5 py-1.5">

                                    <div className="h-3.5 w-3.5 animate-[spin_12s_linear_infinite] rounded-full border-[1.5px] border-dashed border-[#FF8F00]" />

                                    <span className="text-[8.5px] tracking-[0.13em] text-[#F7F5EC]/50">
                                        COLLECTOR ACCESS
                                    </span>

                                </div>

                            </div>

                            {/* Heading */}
                            <div className="relative z-10 mt-3 max-w-[470px] shrink-0">

                                <div className="mb-2.5 flex items-center gap-2.5">

                                    <div className="h-1.5 w-1.5 rounded-full bg-[#FF8F00] shadow-[0_0_10px_rgba(255,143,0,0.7)]" />

                                    <span className="text-[10px] tracking-[0.22em] text-[#FFB04D]">
                                        THE COLLECTOR'S GARAGE
                                    </span>

                                </div>

                                <h1 className="mb-2 font-sans text-[28px] font-bold leading-[1.05] tracking-tight lg:text-[34px]">

                                    Welcome to{" "}

                                    <span className="bg-gradient-to-r from-[#E8B968] via-[#FF8F00] to-[#FFB04D] bg-clip-text text-transparent">
                                        Metal Garage
                                    </span>

                                </h1>

                                <p className="max-w-[390px] text-[12.5px] leading-[1.55] text-[#F7F5EC]/65">
                                    Your collection starts here. Discover rare castings,
                                    built for true collectors.
                                </p>

                            </div>

                            {/* Hot Wheels Card Showcase — now has real room to breathe */}
                            <div className="relative z-10 my-2 flex min-h-0 flex-1 items-center justify-center">

                                {/* Glow */}
                                <div className="absolute h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(255,143,0,0.16)_0%,transparent_68%)] lg:h-[360px] lg:w-[360px]" />

                                {/* Collector rings */}
                                <div className="absolute h-[230px] w-[230px] rounded-full border border-[#FF8F00]/20 lg:h-[290px] lg:w-[290px]" />

                                <div className="absolute h-[290px] w-[290px] animate-[spin_40s_linear_infinite] rounded-full border border-dashed border-[#FF8F00]/10 lg:h-[350px] lg:w-[350px]" />

                                {/* Hot Wheels image */}
                                <div className="relative z-10 flex h-full w-full items-center justify-center mb-5">

                                    <img
                                        src="/loginbg.png"
                                        alt="Hot Wheels Collector Collection"
                                        className="h-full max-h-[260px] w-auto max-w-[85%] object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.65)] transition-transform duration-500 hover:scale-[1.04] lg:max-h-[320px]"
                                    />

                                </div>

                                {/* Labels */}
                                <span className="absolute left-0 top-[2%] hidden font-mono text-[8px] tracking-[0.1em] text-[#FFB04D] lg:flex lg:items-center lg:gap-1.5">

                                    <span className="h-px w-3.5 bg-[#FFB04D]" />

                                    PRECISION CASTING

                                </span>

                                <span className="absolute bottom-[8%] right-0 hidden flex-row-reverse items-center gap-1.5 font-mono text-[8px] tracking-[0.1em] text-[#FFB04D] lg:flex">

                                    <span className="h-px w-3.5 bg-[#FFB04D]" />

                                    1:64 SCALE

                                </span>

                            </div>

                            {/* Stats */}
                            <div className="relative z-10 shrink-0">

                                <div className="mb-3 h-px w-[70%] bg-gradient-to-r from-[#F5F5DC]/15 to-transparent" />

                                <div className="flex gap-7">

                                    <div>
                                        <div className="font-sans text-[17px] font-semibold">
                                            4,200+
                                        </div>

                                        <div className="mt-1 text-[8px] uppercase tracking-[0.1em] text-[#F7F5EC]/45">
                                            Models Catalogued
                                        </div>
                                    </div>

                                    <div>
                                        <div className="font-sans text-[17px] font-semibold">
                                            18K+
                                        </div>

                                        <div className="mt-1 text-[8px] uppercase tracking-[0.1em] text-[#F7F5EC]/45">
                                            Collectors
                                        </div>
                                    </div>

                                    <div>
                                        <div className="font-sans text-[17px] font-semibold">
                                            180+
                                        </div>

                                        <div className="mt-1 text-[8px] uppercase tracking-[0.1em] text-[#F7F5EC]/45">
                                            Rare Castings
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* RIGHT SIDE */}
                        <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#F7F5EC] md:flex-[0_0_43%]">

                            {/* Top bar — pinned to top of right side only, doesn't affect content below */}
                            <div className="relative z-5 flex h-[54px] shrink-0 items-center px-6 sm:px-10 lg:px-12 mt-5">

                                <button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    className="group flex items-center gap-2 text-[12px] tracking-wide text-[#0A0A0A]/50 transition-colors duration-200 hover:text-[#CC7000]"
                                >
                                    <ArrowLeft
                                        size={15}
                                        className="transition-transform duration-200 group-hover:-translate-x-1"
                                    />

                                    Back to Metal Garage
                                </button>

                            </div>

                            {/* Pattern */}
                            <div
                                className="pointer-events-none absolute inset-0"
                                style={{
                                    backgroundImage:
                                        "repeating-linear-gradient(125deg, rgba(10,10,10,0.012) 0 1px, transparent 1px 46px)",
                                }}
                            />

                            {/* Content — centered in remaining space below the top bar */}
                            <div className="relative flex min-h-0 flex-1 items-center justify-center px-6 pb-6 sm:px-10 sm:pb-10 lg:px-12">

                                <div className="relative z-10 w-full max-w-[350px]">

                                    {/* Header */}
                                    <div className="mb-8">

                                        <div className="mb-2.5 flex items-center gap-2">

                                            <div className="h-0.5 w-[20px] rounded-full bg-[#FF8F00]" />

                                            <span className="font-mono text-[15px] tracking-[0.2em] text-[#CC7000]">
                                                SIGN IN
                                            </span>

                                        </div>

                                        <h2 className="mb-1.5 font-sans text-[25px] font-bold leading-tight">
                                            Welcome back
                                        </h2>

                                        <p className="text-[12px] text-[#0A0A0A]/60">
                                            New to Metal Garage?{" "}
                                            <button
                                                type="button"
                                                className="font-semibold text-[#CC7000] transition-colors hover:text-[#FF8F00]"
                                            >
                                                Create an account
                                            </button>
                                        </p>

                                    </div>

                                    {/* Form */}
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleLogin();
                                        }}
                                    >

                                        {/* Username */}
                                        <div className="group relative mb-6">

                                            <input
                                                type="text"
                                                placeholder=" "
                                                required
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="peer w-full border-0 border-b-[1.5px] border-[#0A0A0A]/10 bg-transparent px-0 pb-2.5 pt-2 pr-8 text-[14px] text-[#0A0A0A] outline-none transition-colors duration-300 focus:border-[#FF8F00]"
                                            />

                                            <label className="pointer-events-none absolute left-0 top-2 text-[13.5px] text-[#0A0A0A]/40 transition-all duration-200 peer-focus:-top-2 peer-focus:font-mono peer-focus:text-[9px] peer-focus:uppercase peer-focus:tracking-[0.08em] peer-focus:text-[#CC7000] peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:font-mono peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.08em] peer-[:not(:placeholder-shown)]:text-[#CC7000]">
                                                Username
                                            </label>

                                            <Mail
                                                size={16}
                                                strokeWidth={1.8}
                                                className="pointer-events-none absolute right-0 top-2 text-[#0A0A0A]/30 transition-colors group-focus-within:text-[#CC7000]"
                                            />

                                            <div className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#CC7000] to-[#FF8F00] transition-all duration-300 group-focus-within:w-full" />

                                        </div>

                                        {/* Password */}
                                        <div className="group relative mb-4">

                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder=" "
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="peer w-full border-0 border-b-[1.5px] border-[#0A0A0A]/10 bg-transparent px-0 pb-2.5 pt-2 pr-8 text-[14px] text-[#0A0A0A] outline-none transition-colors duration-300 focus:border-[#FF8F00]"
                                            />

                                            <label className="pointer-events-none absolute left-0 top-2 text-[13.5px] text-[#0A0A0A]/40 transition-all duration-200 peer-focus:-top-2 peer-focus:font-mono peer-focus:text-[9px] peer-focus:uppercase peer-focus:tracking-[0.08em] peer-focus:text-[#CC7000] peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:font-mono peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.08em] peer-[:not(:placeholder-shown)]:text-[#CC7000]">
                                                Password
                                            </label>

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={
                                                    showPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                                className="absolute right-0 top-1.5 text-[#0A0A0A]/35 transition-colors hover:text-[#CC7000]"
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={16} strokeWidth={1.8} />
                                                ) : (
                                                    <Eye size={16} strokeWidth={1.8} />
                                                )}
                                            </button>

                                            <div className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#CC7000] to-[#FF8F00] transition-all duration-300 group-focus-within:w-full" />

                                        </div>

                                        {/* Remember */}
                                        <div className="mb-5 mt-8 flex items-center justify-between">

                                            <label className="flex cursor-pointer items-center gap-2">

                                                <input
                                                    type="checkbox"
                                                    defaultChecked
                                                    className="peer sr-only"
                                                />

                                                <span className="relative h-3.5 w-3.5 rounded border-[1.5px] border-[#0A0A0A]/10 transition-all peer-checked:border-[#FF8F00] peer-checked:bg-[#FF8F00] after:absolute after:left-[3px] after:top-0.5 after:hidden after:h-2 after:w-1 after:rotate-45 after:border-b-2 after:border-r-2 after:border-[#0A0A0A] peer-checked:after:block" />

                                                <span className="text-[11.5px] text-[#0A0A0A]/65">
                                                    Remember me
                                                </span>

                                            </label>

                                            <button
                                                type="button"
                                                className="text-[11.5px] font-semibold text-[#CC7000] transition-colors hover:text-[#FF8F00]"
                                            >
                                                Forgot password?
                                            </button>

                                        </div>

                                        {/* Login */}
                                        <button
                                            type="submit"
                                            className="group relative flex w-full items-center justify-center overflow-hidden rounded-md bg-[#0A0A0A] px-4 py-3.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#F7F5EC] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(0,0,0,0.25)]"
                                        >

                                            <span className="absolute left-[-40%] top-0 h-full w-[35%] -skew-x-[20deg] bg-gradient-to-r from-transparent via-[#FF8F00]/55 to-transparent transition-all duration-[550ms] group-hover:left-[120%]" />

                                            <span className="relative z-10 flex items-center gap-2.5">

                                                Sign In

                                                <ArrowRight
                                                    size={14}
                                                    className="transition-transform duration-200 group-hover:translate-x-1"
                                                />

                                            </span>

                                        </button>

                                    </form>

                                    {/* Divider */}
                                    <div className="my-5 flex items-center gap-3">

                                        <div className="h-px flex-1 bg-[#0A0A0A]/10" />

                                        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#0A0A0A]/40">
                                            Or continue with
                                        </span>

                                        <div className="h-px flex-1 bg-[#0A0A0A]/10" />

                                    </div>

                                    {/* Google */}
                                    <button
                                        type="button"
                                        className="mb-5 flex w-full items-center justify-center gap-2 rounded-md border-[1.5px] border-[#0A0A0A]/10 bg-transparent px-3 py-2.5 text-[12px] font-semibold text-[#0A0A0A] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0A0A0A] hover:bg-[#0A0A0A]/[0.03]"
                                    >

                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-[16px] w-[16px]"
                                        >

                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />

                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />

                                            <path
                                                fill="#FBBC05"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />

                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />

                                        </svg>

                                        Google

                                    </button>


                                    {/* Terms */}
                                    <p className="text-center text-[10.5px] leading-[1.4] text-[#0A0A0A]/50">

                                        By continuing, you agree to Metal Garage's{" "}

                                        <button
                                            type="button"
                                            className="font-semibold text-[#CC7000] hover:text-[#FF8F00]"
                                        >
                                            Terms
                                        </button>

                                        {" & "}

                                        <button
                                            type="button"
                                            className="font-semibold text-[#CC7000] hover:text-[#FF8F00]"
                                        >
                                            Privacy Policy
                                        </button>

                                        .

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* Animations */}
            <style>{`
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }

                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>

        </div>
    );
}