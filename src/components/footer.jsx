import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="w-full">

            {/* =====================================================
                NEWSLETTER / STAY IN THE FAST LANE
            ====================================================== */}
            <section className="bg-[#E8E5C8] text-[#0A0A0A]">
                <div
                    className="
                        mx-auto
                        flex
                        w-full
                        max-w-[1320px]
                        flex-col
                        items-start
                        justify-between
                        gap-10
                        px-5
                        py-[70px]
                        sm:px-10
                        lg:flex-row
                        lg:items-center
                    "
                >

                    {/* Newsletter Text */}
                    <div>
                        <h2
                            className="
                                max-w-[360px]
                                font-['Oswald',sans-serif]
                                text-[32px]
                                font-bold
                                uppercase
                                leading-[1.1]
                                tracking-[-0.02em]
                                sm:text-[36px]
                            "
                        >
                            Stay in the fast lane.
                        </h2>

                        <p
                            className="
                                mt-3
                                max-w-[650px]
                                font-['Work_Sans',sans-serif]
                                text-[14.5px]
                                leading-[1.6]
                                text-[rgba(10,10,10,0.6)]
                            "
                        >
                            Get notified about new arrivals, rare finds,
                            exclusive drops, and collector news.
                        </p>
                    </div>


                    {/* Newsletter Form */}
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="
                            flex
                            w-full
                            max-w-[550px]
                            overflow-hidden
                            rounded-[2px]
                            border-[1.5px]
                            border-[#0A0A0A]
                        "
                    >
                        <input
                            type="email"
                            placeholder="your@email.com"
                            required
                            className="
                                min-w-0
                                flex-1
                                bg-transparent
                                px-[18px]
                                py-4
                                font-['Work_Sans',sans-serif]
                                text-[14px]
                                text-[#0A0A0A]
                                outline-none
                                placeholder:text-[rgba(10,10,10,0.45)]
                            "
                        />

                        <button
                            type="submit"
                            className="
                                shrink-0
                                bg-[#0A0A0A]
                                px-[26px]
                                py-4
                                font-['Work_Sans',sans-serif]
                                text-[12.5px]
                                font-semibold
                                uppercase
                                tracking-[0.1em]
                                text-[#F5F5DC]
                                transition-colors
                                duration-200
                                hover:bg-[#FF8F00]
                                hover:text-[#0A0A0A]
                            "
                        >
                            Subscribe
                        </button>
                    </form>

                </div>
            </section>


            {/* =====================================================
                MAIN FOOTER
            ====================================================== */}
            <section
                className="
                    w-full
                    bg-[#0A0A0A]
                    px-5
                    pt-[70px]
                    pb-[30px]
                    text-[#F5F5DC]
                    sm:px-10
                    lg:pt-[90px]
                "
            >
                <div className="mx-auto w-full max-w-[1320px]">

                    {/* Footer Grid */}
                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-10
                            border-b
                            border-[rgba(245,245,220,0.14)]
                            pb-[60px]
                            sm:grid-cols-2
                            lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]
                            lg:gap-10
                        "
                    >

                        {/* =================================================
                            BRAND
                        ================================================== */}
                        <div className="lg:pr-5">

                            <Link
                                to="/"
                                className="inline-flex items-center"
                            >
                                <img
                                    src="/logo.png"
                                    alt="Metal Garage"
                                    className="
                                        block
                                        h-auto
                                        w-[190px]
                                        object-contain
                                    "
                                />
                            </Link>

                            <p
                                className="
                                    mt-4
                                    max-w-[240px]
                                    font-['Work_Sans',sans-serif]
                                    text-[13.5px]
                                    leading-[1.6]
                                    text-[rgba(245,245,220,0.5)]
                                "
                            >
                                A garage for collectors — legendary
                                die-cast cars, rare releases, and everyday
                                favorites, curated with obsessive detail.
                            </p>

                        </div>


                        {/* =================================================
                            SHOP
                        ================================================== */}
                        <FooterColumn title="SHOP">
                            <FooterLink to="/shop">
                                All Products
                            </FooterLink>

                            <FooterLink to="/shop?category=new-arrivals">
                                New Arrivals
                            </FooterLink>

                            <FooterLink to="/shop?category=premium">
                                Premium
                            </FooterLink>

                            <FooterLink to="/shop?category=rare-finds">
                                Rare Finds
                            </FooterLink>

                            <FooterLink to="/collections">
                                Collections
                            </FooterLink>
                        </FooterColumn>


                        {/* =================================================
                            COMPANY
                        ================================================== */}
                        <FooterColumn title="COMPANY">
                            <FooterLink to="/about">
                                About Us
                            </FooterLink>

                            <FooterLink to="/contact">
                                Contact
                            </FooterLink>

                            <FooterLink to="/faq">
                                FAQ
                            </FooterLink>

                            <FooterLink to="/shipping">
                                Shipping
                            </FooterLink>

                            <FooterLink to="/returns">
                                Returns
                            </FooterLink>
                        </FooterColumn>


                        {/* =================================================
                            ACCOUNT
                        ================================================== */}
                        <FooterColumn title="ACCOUNT">
                            <FooterLink to="/account">
                                My Account
                            </FooterLink>

                            <FooterLink to="/orders">
                                Orders
                            </FooterLink>

                            <FooterLink to="/wishlist">
                                Wishlist
                            </FooterLink>

                            <FooterLink to="/cart">
                                Cart
                            </FooterLink>
                        </FooterColumn>


                        {/* =================================================
                            FOLLOW
                        ================================================== */}
                        <FooterColumn title="FOLLOW">
                            <FooterLink to="#">
                                Facebook
                            </FooterLink>

                            <FooterLink to="#">
                                Instagram
                            </FooterLink>

                            <FooterLink to="#">
                                TikTok
                            </FooterLink>

                            <FooterLink to="#">
                                YouTube
                            </FooterLink>
                        </FooterColumn>

                    </div>


                    {/* =====================================================
                        FOOTER BOTTOM
                    ====================================================== */}
                    <div
                        className="
                            flex
                            flex-col
                            items-start
                            justify-between
                            gap-4
                            pt-[26px]
                            sm:flex-row
                            sm:items-center
                        "
                    >

                        <p
                            className="
                                font-['Work_Sans',sans-serif]
                                text-[12.5px]
                                text-[rgba(245,245,220,0.5)]
                            "
                        >
                            © 2026 Metal Garage. All rights reserved.
                        </p>


                        <div className="flex items-center gap-6">

                            <Link
                                to="/privacy"
                                className="
                                    font-['Work_Sans',sans-serif]
                                    text-[12.5px]
                                    text-[rgba(245,245,220,0.5)]
                                    transition-colors
                                    duration-200
                                    hover:text-[#FF8F00]
                                "
                            >
                                Privacy Policy
                            </Link>

                            <Link
                                to="/terms"
                                className="
                                    font-['Work_Sans',sans-serif]
                                    text-[12.5px]
                                    text-[rgba(245,245,220,0.5)]
                                    transition-colors
                                    duration-200
                                    hover:text-[#FF8F00]
                                "
                            >
                                Terms &amp; Conditions
                            </Link>

                        </div>

                    </div>

                </div>
            </section>

        </footer>
    );
}


/* =============================================================
   FOOTER COLUMN
============================================================= */

function FooterColumn({ title, children }) {
    return (
        <div>
            <h4
                className="
                    mb-[18px]
                    font-['JetBrains_Mono',monospace]
                    text-[12px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-[#FF8F00]
                "
            >
                {title}
            </h4>

            <ul className="flex list-none flex-col gap-[11px] p-0 m-0">
                {children}
            </ul>
        </div>
    );
}


/* =============================================================
   FOOTER LINK
============================================================= */

function FooterLink({ to, children }) {
    return (
        <li>
            <Link
                to={to}
                className="
                    font-['Work_Sans',sans-serif]
                    text-[13.5px]
                    text-[rgba(245,245,220,0.7)]
                    transition-colors
                    duration-200
                    hover:text-[#FF8F00]
                "
            >
                {children}
            </Link>
        </li>
    );
}