import { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Mail,
    MapPin,
    MessageCircle,
    Clock,
} from "lucide-react";

import Footer from "../components/footer";
import Header from "../components/header";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const fadeUp = {
        hidden: {
            opacity: 0,
            y: 30,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (submitted) {
            setSubmitted(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setSubmitted(true);

        setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
        });
    };

    const contactDetails = [
        {
            icon: Mail,
            title: "Email",
            value: "hello@metalgarage.com",
            description: "For general questions and support.",
        },
        {
            icon: MessageCircle,
            title: "Collector Support",
            value: "support@metalgarage.com",
            description: "Need help with an order or product?",
        },
        {
            icon: Clock,
            title: "Response Time",
            value: "Within 24 hours",
            description: "We usually reply within one business day.",
        },
        {
            icon: MapPin,
            title: "The Garage",
            value: "Sri Lanka",
            description: "Built for collectors, wherever they are.",
        },
    ];

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-[#F4F0E3] text-[#0A0A0A]">

            {/* =====================================================
                GLOBAL STYLES
            ====================================================== */}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&display=swap');

                html {
                    scroll-behavior: smooth;
                }

                .mg-title {
                    font-family: 'Oswald', sans-serif;
                    text-transform: uppercase;
                    font-weight: 700;
                    line-height: 0.95;
                }

                .mg-body {
                    font-family: 'DM Sans', sans-serif;
                }
            `}</style>


            {/* =====================================================
                HEADER
            ====================================================== */}

            <Header />


            <main className="mg-body pt-[78px]">

                {/* =====================================================
                    HERO
                ====================================================== */}

                <section className="relative overflow-hidden bg-[#0A0A0A] text-[#F4F0E3]">

                    {/* Background texture */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            bg-[radial-gradient(ellipse_at_80%_20%,rgba(255,143,0,0.12),transparent_50%),repeating-linear-gradient(115deg,rgba(245,245,220,0.025)_0_1px,transparent_1px_64px)]
                        "
                    />

                    <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">

                        {/* Breadcrumb */}

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            className="mb-7 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-[#F4F0E3]/45"
                        >
                            <span>Home</span>

                            <span>/</span>

                            <span className="text-[#FF8F00]">
                                Contact
                            </span>
                        </motion.div>


                        <div className="grid items-end gap-12 lg:grid-cols-[1.3fr_0.7fr]">

                            {/* LEFT */}

                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeUp}
                            >
                                <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[#FF8F00]">
                                    Get in touch
                                </p>

                                <h1 className="mg-title text-6xl sm:text-7xl lg:text-8xl">
                                    Let's talk
                                    <br />

                                    <span className="text-[#FF8F00]">
                                        cars.
                                    </span>
                                </h1>

                                <p className="mt-7 max-w-2xl text-base leading-8 text-[#F4F0E3]/60 sm:text-lg">
                                    Have a question about a model, an order,
                                    or something happening in the garage?
                                    Send us a message and we'll get back to you.
                                </p>
                            </motion.div>


                            {/* RIGHT */}

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    x: 30,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                }}
                                transition={{
                                    duration: 0.7,
                                    delay: 0.15,
                                }}
                                className="hidden justify-end lg:flex"
                            >
                                <div className="border border-[#F4F0E3]/10 p-7">

                                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#FF8F00]">
                                        GARAGE / CONTACT
                                    </p>

                                    <p className="mt-5 max-w-[240px] text-sm leading-7 text-[#F4F0E3]/45">
                                        Questions, feedback, collector
                                        stories — we're always happy to
                                        hear from fellow car lovers.
                                    </p>

                                </div>
                            </motion.div>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    CONTACT CONTENT
                ====================================================== */}

                <section className="bg-[#F4F0E3] py-20 sm:py-24">

                    <div className="mx-auto max-w-6xl px-5 sm:px-8">

                        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">


                            {/* =================================================
                                CONTACT INFORMATION
                            ================================================= */}

                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{
                                    once: true,
                                    amount: 0.2,
                                }}
                                variants={fadeUp}
                            >

                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF8F00]">
                                    The Garage
                                </p>

                                <h2 className="mg-title mt-4 text-5xl sm:text-6xl">
                                    Contact
                                    <br />

                                    <span className="text-[#FF8F00]">
                                        details.
                                    </span>
                                </h2>

                                <p className="mt-7 max-w-md leading-8 text-black/55">
                                    Whether you're looking for a specific
                                    casting or simply want to talk cars,
                                    we're here to help.
                                </p>


                                {/* Details */}

                                <div className="mt-10 space-y-7">

                                    {contactDetails.map((item) => {
                                        const Icon = item.icon;

                                        return (
                                            <div
                                                key={item.title}
                                                className="flex gap-5"
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        h-11
                                                        w-11
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        border
                                                        border-black/10
                                                        bg-white/30
                                                    "
                                                >
                                                    <Icon
                                                        size={19}
                                                        strokeWidth={1.7}
                                                        className="text-[#FF8F00]"
                                                    />
                                                </div>


                                                <div>

                                                    <h3 className="font-semibold uppercase tracking-[0.08em]">
                                                        {item.title}
                                                    </h3>

                                                    <p className="mt-1 text-sm font-medium">
                                                        {item.value}
                                                    </p>

                                                    <p className="mt-1 text-sm leading-6 text-black/45">
                                                        {item.description}
                                                    </p>

                                                </div>

                                            </div>
                                        );
                                    })}

                                </div>


                                {/* Social */}

                                <div className="mt-10 border-t border-black/10 pt-7">

                                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-black/45">
                                        Follow the garage
                                    </p>

                                    <div className="mt-4 flex gap-3">

                                        {/* Instagram */}

                                        <a
                                            href="#"
                                            aria-label="Instagram"
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                border
                                                border-black/10
                                                transition-all
                                                duration-200
                                                hover:-translate-y-1
                                                hover:border-[#FF8F00]
                                                hover:text-[#FF8F00]
                                            "
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-[18px] w-[18px]"
                                                aria-hidden="true"
                                            >
                                                <rect
                                                    x="3"
                                                    y="3"
                                                    width="18"
                                                    height="18"
                                                    rx="5"
                                                />

                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="4"
                                                />

                                                <circle
                                                    cx="17.5"
                                                    cy="6.5"
                                                    r="1"
                                                    fill="currentColor"
                                                    stroke="none"
                                                />
                                            </svg>
                                        </a>


                                        {/* Message */}

                                        <a
                                            href="#"
                                            aria-label="Message"
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                border
                                                border-black/10
                                                transition-all
                                                duration-200
                                                hover:-translate-y-1
                                                hover:border-[#FF8F00]
                                                hover:text-[#FF8F00]
                                            "
                                        >
                                            <MessageCircle size={18} />
                                        </a>

                                    </div>

                                </div>

                            </motion.div>


                            {/* =================================================
                                CONTACT FORM
                            ================================================= */}

                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{
                                    once: true,
                                    amount: 0.15,
                                }}
                                variants={fadeUp}
                                className="border border-black/10 bg-white/25 p-6 sm:p-9"
                            >

                                <div className="mb-8">

                                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#FF8F00]">
                                        Send a message
                                    </p>

                                    <h2 className="mg-title mt-3 text-4xl sm:text-5xl">
                                        Talk to
                                        <span className="text-[#FF8F00]">
                                            {" "}us.
                                        </span>
                                    </h2>

                                </div>


                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >

                                    {/* Name + Email */}

                                    <div className="grid gap-6 sm:grid-cols-2">

                                        <div>

                                            <label
                                                htmlFor="name"
                                                className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-black/55"
                                            >
                                                Your Name
                                            </label>

                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="John Doe"
                                                className="
                                                    w-full
                                                    border
                                                    border-black/15
                                                    bg-transparent
                                                    px-4
                                                    py-3.5
                                                    text-sm
                                                    outline-none
                                                    transition-colors
                                                    placeholder:text-black/25
                                                    focus:border-[#FF8F00]
                                                "
                                            />

                                        </div>


                                        <div>

                                            <label
                                                htmlFor="email"
                                                className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-black/55"
                                            >
                                                Email Address
                                            </label>

                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="you@example.com"
                                                className="
                                                    w-full
                                                    border
                                                    border-black/15
                                                    bg-transparent
                                                    px-4
                                                    py-3.5
                                                    text-sm
                                                    outline-none
                                                    transition-colors
                                                    placeholder:text-black/25
                                                    focus:border-[#FF8F00]
                                                "
                                            />

                                        </div>

                                    </div>


                                    {/* Subject */}

                                    <div>

                                        <label
                                            htmlFor="subject"
                                            className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-black/55"
                                        >
                                            Subject
                                        </label>

                                        <input
                                            id="subject"
                                            name="subject"
                                            type="text"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            placeholder="How can we help?"
                                            className="
                                                w-full
                                                border
                                                border-black/15
                                                bg-transparent
                                                px-4
                                                py-3.5
                                                text-sm
                                                outline-none
                                                transition-colors
                                                placeholder:text-black/25
                                                focus:border-[#FF8F00]
                                            "
                                        />

                                    </div>


                                    {/* Message */}

                                    <div>

                                        <label
                                            htmlFor="message"
                                            className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-black/55"
                                        >
                                            Message
                                        </label>

                                        <textarea
                                            id="message"
                                            name="message"
                                            rows="7"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            placeholder="Tell us what's on your mind..."
                                            className="
                                                w-full
                                                resize-none
                                                border
                                                border-black/15
                                                bg-transparent
                                                px-4
                                                py-3.5
                                                text-sm
                                                leading-7
                                                outline-none
                                                transition-colors
                                                placeholder:text-black/25
                                                focus:border-[#FF8F00]
                                            "
                                        />

                                    </div>


                                    {/* Submit */}

                                    <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">

                                        <button
                                            type="submit"
                                            className="
                                                inline-flex
                                                items-center
                                                justify-center
                                                gap-3
                                                bg-[#0A0A0A]
                                                px-7
                                                py-4
                                                text-sm
                                                font-bold
                                                uppercase
                                                tracking-[0.08em]
                                                text-[#F4F0E3]
                                                transition-all
                                                duration-300
                                                hover:-translate-y-0.5
                                                hover:bg-[#FF8F00]
                                                hover:text-[#0A0A0A]
                                            "
                                        >
                                            Send Message

                                            <ArrowRight size={17} />
                                        </button>


                                        {submitted && (
                                            <p className="text-sm font-medium text-[#26734D]">
                                                Message received. We'll be in touch.
                                            </p>
                                        )}

                                    </div>

                                </form>

                            </motion.div>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    FAQ / HELP STRIP
                ====================================================== */}

                <section className="bg-[#DCD7C6] py-20 sm:py-24">

                    <div className="mx-auto max-w-6xl px-5 sm:px-8">

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{
                                once: true,
                                amount: 0.2,
                            }}
                            variants={fadeUp}
                            className="grid items-center gap-10 lg:grid-cols-[1fr_auto]"
                        >

                            <div>

                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF8F00]">
                                    Need something else?
                                </p>

                                <h2 className="mg-title mt-4 text-5xl sm:text-6xl">
                                    Check the
                                    <br />

                                    <span className="text-[#FF8F00]">
                                        garage.
                                    </span>
                                </h2>

                                <p className="mt-6 max-w-xl leading-8 text-black/55">
                                    Looking for information about shipping,
                                    returns, orders or frequently asked
                                    questions? We've got you covered.
                                </p>

                            </div>


                            <a
                                href="/products"
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-3
                                    bg-[#0A0A0A]
                                    px-7
                                    py-4
                                    text-sm
                                    font-bold
                                    uppercase
                                    tracking-[0.08em]
                                    text-[#F4F0E3]
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:bg-[#FF8F00]
                                    hover:text-[#0A0A0A]
                                "
                            >
                                Explore Collection

                                <ArrowRight size={17} />

                            </a>

                        </motion.div>

                    </div>

                </section>


                {/* =====================================================
                    FINAL CTA
                ====================================================== */}

                <section className="bg-[#FF8F00] py-20 sm:py-24">

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                            amount: 0.3,
                        }}
                        variants={fadeUp}
                        className="mx-auto max-w-4xl px-5 text-center sm:px-8"
                    >

                        <p className="mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-black/55">
                            METAL GARAGE / EST. GARAGE 01
                        </p>

                        <h2 className="mg-title text-5xl sm:text-6xl lg:text-7xl">
                            Keep collecting.
                            <br />
                            Keep driving.
                        </h2>

                        <p className="mx-auto mt-6 max-w-xl leading-7 text-black/60">
                            Every model has a story. Maybe the next one
                            belongs in your garage.
                        </p>

                        <a
                            href="/products"
                            className="
                                mt-8
                                inline-flex
                                items-center
                                gap-3
                                bg-[#0A0A0A]
                                px-7
                                py-4
                                text-sm
                                font-bold
                                uppercase
                                tracking-wide
                                text-[#F4F0E3]
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:bg-black/80
                            "
                        >
                            Start Collecting

                            <ArrowRight size={17} />

                        </a>

                    </motion.div>

                </section>

            </main>


            {/* =====================================================
                FOOTER
            ====================================================== */}

            <Footer />

        </div>
    );
}