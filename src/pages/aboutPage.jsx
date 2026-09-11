import Footer from "../components/footer";
import Header from "../components/header";
import { motion } from "framer-motion";
import {
    ArrowRight,
    BadgeCheck,
    Car,
    Heart,
    Package,
    ShieldCheck,
    Target,
    Users,
    Wrench,
} from "lucide-react";

export default function AboutPage() {
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

    const values = [
        {
            icon: BadgeCheck,
            title: "Authentic",
            text: "We care about realistic details and quality die-cast models.",
        },
        {
            icon: Heart,
            title: "Passionate",
            text: "Metal Garage is built for people who genuinely love cars and collecting.",
        },
        {
            icon: Target,
            title: "Curated",
            text: "We focus on interesting models instead of filling the store with random products.",
        },
        {
            icon: Users,
            title: "Community",
            text: "Our goal is to create a place where collectors can discover and enjoy cars.",
        },
    ];

    const features = [
        {
            icon: Car,
            title: "Great Cars",
            text: "JDM legends, classics, muscle cars and modern supercars.",
        },
        {
            icon: Package,
            title: "Quality Models",
            text: "Carefully selected die-cast models for collectors.",
        },
        {
            icon: ShieldCheck,
            title: "Easy Shopping",
            text: "A simple and convenient experience from browsing to checkout.",
        },
        {
            icon: Wrench,
            title: "Collector Focused",
            text: "Everything is designed with car collectors in mind.",
        },
    ];

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-[#F4F0E3] text-[#0A0A0A]">

            {/* =====================================================
                GLOBAL STYLES
            ===================================================== */}

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
            ===================================================== */}

            <Header />

            <main className="mg-body">

                {/* =====================================================
                    HERO
                ===================================================== */}

                <section className="bg-[#0A0A0A] text-[#F4F0E3]">
                    <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">

                        <div className="grid items-center gap-12 lg:grid-cols-2">

                            {/* TEXT */}

                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeUp}
                            >
                                <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#FF8F00]">
                                    About Metal Garage
                                </p>

                                <h1 className="mg-title text-6xl sm:text-7xl lg:text-8xl">
                                    Cars
                                    <br />

                                    <span className="text-[#FF8F00]">
                                        become
                                    </span>

                                    <br />

                                    memories.
                                </h1>

                                <p className="mt-7 max-w-xl text-base leading-7 text-[#F4F0E3]/60 sm:text-lg">
                                    Metal Garage is a place for people who love
                                    cars, die-cast models and collecting.
                                    We bring iconic vehicles into a smaller
                                    world that you can keep on your shelf.
                                </p>

                                <a
                                    href="/products"
                                    className="mt-8 inline-flex items-center gap-3 bg-[#FF8F00] px-6 py-4 text-sm font-bold uppercase tracking-wide text-[#0A0A0A] transition hover:bg-[#ffa733]"
                                >
                                    Explore Collection

                                    <ArrowRight size={17} />
                                </a>
                            </motion.div>

                            {/* IMAGE */}

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.95,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                }}
                                transition={{
                                    duration: 0.8,
                                }}
                                className="flex justify-center"
                            >
                                <img
                                    src="/home4.png"
                                    alt="Metal Garage collectible car"
                                    className="w-full max-w-xl object-contain"
                                />
                            </motion.div>

                        </div>
                    </div>
                </section>

                {/* =====================================================
                    SIMPLE INTRO
                ===================================================== */}

                <section className="bg-[#F4F0E3] py-20 sm:py-24">

                    <div className="mx-auto max-w-6xl px-5 sm:px-8">

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            variants={fadeUp}
                            className="mx-auto max-w-3xl text-center"
                        >
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF8F00]">
                                Our Story
                            </p>

                            <h2 className="mg-title mt-4 text-5xl sm:text-6xl">
                                Built by car lovers
                            </h2>

                            <p className="mt-7 text-base leading-8 text-black/60 sm:text-lg">
                                Every collector has a story. Maybe it started
                                with a favourite car, a childhood memory or
                                the excitement of finding a rare model.
                            </p>

                            <p className="mt-5 text-base leading-8 text-black/60 sm:text-lg">
                                Metal Garage was created to celebrate that
                                feeling. We want to make discovering and
                                collecting die-cast cars simple, enjoyable
                                and exciting.
                            </p>
                        </motion.div>

                    </div>

                </section>

                {/* =====================================================
                    IMAGE + STORY
                ===================================================== */}

                <section className="bg-[#DCD7C6] py-20 sm:py-24">

                    <div className="mx-auto max-w-6xl px-5 sm:px-8">

                        <div className="grid items-center gap-12 lg:grid-cols-2">

                            {/* IMAGE */}

                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                                variants={fadeUp}
                                className="overflow-hidden bg-[#0A0A0A]"
                            >
                                <img
                                    src="/hero.png"
                                    alt="Metal Garage collection"
                                    className="w-full object-contain p-8 transition duration-500 hover:scale-105 sm:p-12"
                                />
                            </motion.div>

                            {/* CONTENT */}

                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                                variants={fadeUp}
                            >
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF8F00]">
                                    Why Metal Garage
                                </p>

                                <h2 className="mg-title mt-4 text-5xl sm:text-6xl">
                                    Small cars.
                                    <br />

                                    <span className="text-[#FF8F00]">
                                        Big stories.
                                    </span>
                                </h2>

                                <p className="mt-7 leading-8 text-black/60">
                                    A 1:64 scale model may be small, but the
                                    memories behind it can be huge.
                                </p>

                                <p className="mt-5 leading-8 text-black/60">
                                    From legendary Japanese cars to classic
                                    muscle cars and modern supercars, every
                                    model represents something special.
                                </p>

                                <p className="mt-5 leading-8 text-black/60">
                                    That's why we created Metal Garage —
                                    a simple digital garage for discovering
                                    cars worth collecting.
                                </p>

                            </motion.div>

                        </div>

                    </div>

                </section>

                {/* =====================================================
                    VALUES
                ===================================================== */}

                <section className="bg-[#F4F0E3] py-20 sm:py-24">

                    <div className="mx-auto max-w-6xl px-5 sm:px-8">

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            variants={fadeUp}
                            className="mb-12 text-center"
                        >
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF8F00]">
                                Our Values
                            </p>

                            <h2 className="mg-title mt-4 text-5xl sm:text-6xl">
                                What we stand for
                            </h2>
                        </motion.div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                            {values.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <motion.div
                                        key={item.title}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{
                                            once: true,
                                            amount: 0.15,
                                        }}
                                        variants={fadeUp}
                                        className="border border-black/10 bg-white/30 p-7 transition duration-300 hover:-translate-y-1 hover:border-[#FF8F00]"
                                    >
                                        <Icon
                                            size={30}
                                            strokeWidth={1.7}
                                            className="text-[#FF8F00]"
                                        />

                                        <h3 className="mg-title mt-8 text-3xl">
                                            {item.title}
                                        </h3>

                                        <p className="mt-4 text-sm leading-7 text-black/55">
                                            {item.text}
                                        </p>
                                    </motion.div>
                                );
                            })}

                        </div>

                    </div>

                </section>

                {/* =====================================================
                    FEATURES
                ===================================================== */}

                <section className="bg-[#0A0A0A] py-20 text-[#F4F0E3] sm:py-24">

                    <div className="mx-auto max-w-6xl px-5 sm:px-8">

                        <div className="grid gap-12 lg:grid-cols-2">

                            {/* LEFT */}

                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                                variants={fadeUp}
                            >
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF8F00]">
                                    The Metal Garage Experience
                                </p>

                                <h2 className="mg-title mt-4 text-5xl sm:text-6xl">
                                    Made for
                                    <br />

                                    <span className="text-[#FF8F00]">
                                        collectors.
                                    </span>
                                </h2>

                                <p className="mt-7 max-w-lg leading-8 text-[#F4F0E3]/55">
                                    We want finding your next favourite model
                                    to be simple and enjoyable. Browse the
                                    collection, discover something special and
                                    add another story to your garage.
                                </p>

                                <a
                                    href="/products"
                                    className="mt-8 inline-flex items-center gap-3 border-b border-[#FF8F00] pb-2 text-sm font-bold uppercase tracking-wide text-[#F4F0E3] transition hover:text-[#FF8F00]"
                                >
                                    View Collection

                                    <ArrowRight size={16} />
                                </a>
                            </motion.div>

                            {/* RIGHT */}

                            <div className="grid gap-4 sm:grid-cols-2">

                                {features.map((feature) => {
                                    const Icon = feature.icon;

                                    return (
                                        <motion.div
                                            key={feature.title}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{
                                                once: true,
                                                amount: 0.15,
                                            }}
                                            variants={fadeUp}
                                            className="border border-[#F4F0E3]/10 p-6 transition duration-300 hover:border-[#FF8F00]/50"
                                        >
                                            <Icon
                                                size={28}
                                                strokeWidth={1.6}
                                                className="text-[#FF8F00]"
                                            />

                                            <h3 className="mg-title mt-7 text-2xl">
                                                {feature.title}
                                            </h3>

                                            <p className="mt-3 text-sm leading-6 text-[#F4F0E3]/45">
                                                {feature.text}
                                            </p>
                                        </motion.div>
                                    );
                                })}

                            </div>

                        </div>

                    </div>

                </section>

                {/* =====================================================
                    FINAL CTA
                ===================================================== */}

                <section className="bg-[#FF8F00] py-20 sm:py-24">

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeUp}
                        className="mx-auto max-w-4xl px-5 text-center sm:px-8"
                    >
                        <h2 className="mg-title text-5xl sm:text-6xl lg:text-7xl">
                            Find your next
                            <br />
                            favourite car.
                        </h2>

                        <p className="mx-auto mt-6 max-w-xl leading-7 text-black/60">
                            Explore our collection and discover the model
                            that deserves a place in your garage.
                        </p>

                        <a
                            href="/products"
                            className="mt-8 inline-flex items-center gap-3 bg-[#0A0A0A] px-7 py-4 text-sm font-bold uppercase tracking-wide text-[#F4F0E3] transition hover:bg-black/80"
                        >
                            Start Collecting

                            <ArrowRight size={17} />
                        </a>
                    </motion.div>

                </section>

            </main>

            {/* =====================================================
                FOOTER
            ===================================================== */}

            <Footer />

        </div>
    );
}