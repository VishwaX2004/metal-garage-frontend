import { NavLink } from "react-router-dom";
import {
    Search,
    Heart,
    ShoppingCart,
    UserRound,
    Menu,
} from "lucide-react";

export default function Header() {
    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Shop", path: "/shop" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
        { name: "Cart", path: "/cart" }
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-[1000] w-full bg-[#0A0A0A] border-b border-[rgba(245,245,220,0.14)]">
            <nav className="mx-auto flex h-[78px] w-full max-w-[1320px] items-center justify-between px-5 sm:px-10">

                {/* ================= LOGO ================= */}
                <NavLink
                    to="/"
                    className="flex items-center shrink-0"
                >
                    <img
                        src="/logo.png"
                        alt="Metal Garage"
                        className="block h-[36px] w-auto sm:h-[46px]"
                    />
                </NavLink>


                {/* ================= DESKTOP NAVIGATION ================= */}
                <div className="hidden min-[981px]:flex items-center">
                    <ul className="flex items-center gap-[34px] list-none m-0 p-0">

                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <NavLink
                                    to={link.path}
                                    className="group relative block px-0 py-[6px]"
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span
                                                className={`
                                                    font-['Work_Sans',sans-serif]
                                                    text-[13px]
                                                    font-medium
                                                    uppercase
                                                    tracking-[0.09em]
                                                    transition-colors
                                                    duration-200
                                                    ${
                                                        isActive
                                                            ? "text-[#F5F5DC]"
                                                            : "text-[rgba(245,245,220,0.7)] group-hover:text-[#F5F5DC]"
                                                    }
                                                `}
                                            >
                                                {link.name}
                                            </span>

                                            {/* Orange active / hover underline */}
                                            <span
                                                className={`
                                                    absolute
                                                    left-0
                                                    bottom-0
                                                    h-[2px]
                                                    bg-[#FF8F00]
                                                    transition-all
                                                    duration-300
                                                    ease-out
                                                    ${
                                                        isActive
                                                            ? "w-full"
                                                            : "w-0 group-hover:w-full"
                                                    }
                                                `}
                                            />
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}

                    </ul>
                </div>


                {/* ================= RIGHT SIDE ================= */}
                <div className="flex items-center gap-[22px]">

                    {/* Search */}
                    <button
                        type="button"
                        aria-label="Search"
                        className="
                            group
                            relative
                            flex
                            h-5
                            w-5
                            items-center
                            justify-center
                            text-[#F5F5DC]
                            opacity-90
                            transition-all
                            duration-200
                            hover:-translate-y-[1px]
                            hover:text-[#FF8F00]
                            hover:opacity-100
                        "
                    >
                        <Search
                            className="h-full w-full"
                            strokeWidth={2}
                        />
                    </button>


                    {/* Wishlist */}
                    <button
                        type="button"
                        aria-label="Wishlist"
                        className="
                            group
                            relative
                            flex
                            h-5
                            w-5
                            items-center
                            justify-center
                            text-[#F5F5DC]
                            opacity-90
                            transition-all
                            duration-200
                            hover:-translate-y-[1px]
                            hover:text-[#FF8F00]
                            hover:opacity-100
                        "
                    >
                        <Heart
                            className="h-full w-full"
                            strokeWidth={2}
                        />
                    </button>


                    {/* Shopping Cart */}
                    <NavLink
                        to="/cart"
                        aria-label="Shopping Cart"
                        className="
                            relative
                            flex
                            h-5
                            w-5
                            items-center
                            justify-center
                            text-[#F5F5DC]
                            opacity-90
                            transition-all
                            duration-200
                            hover:-translate-y-[1px]
                            hover:text-[#FF8F00]
                            hover:opacity-100
                        "
                    >
                        <ShoppingCart
                            className="h-full w-full"
                            strokeWidth={2}
                        />

                        {/* Cart Count */}
                        <span
                            className="
                                absolute
                                -right-[11px]
                                -top-[9px]
                                flex
                                h-4
                                w-4
                                items-center
                                justify-center
                                rounded-full
                                bg-[#FF8F00]
                                text-[10px]
                                font-bold
                                leading-none
                                text-[#0A0A0A]
                                font-['JetBrains_Mono',monospace]
                            "
                        >
                            3
                        </span>
                    </NavLink>


                    {/* Account */}
                    <NavLink
                        to="/account"
                        aria-label="Account"
                        className="
                            flex
                            h-5
                            w-5
                            items-center
                            justify-center
                            text-[#F5F5DC]
                            opacity-90
                            transition-all
                            duration-200
                            hover:-translate-y-[1px]
                            hover:text-[#FF8F00]
                            hover:opacity-100
                        "
                    >
                        <UserRound
                            className="h-full w-full"
                            strokeWidth={2}
                        />
                    </NavLink>


                    {/* Sign In */}
                    <NavLink
                        to="/login"
                        className="
                            hidden
                            min-[981px]:block
                            rounded-[2px]
                            border
                            border-[rgba(245,245,220,0.14)]
                            px-[18px]
                            py-[9px]
                            text-[12px]
                            font-['Work_Sans',sans-serif]
                            font-medium
                            uppercase
                            tracking-[0.09em]
                            text-[#F5F5DC]
                            transition-all
                            duration-200
                            hover:border-[#FF8F00]
                            hover:text-[#FF8F00]
                        "
                    >
                        Sign In
                    </NavLink>


                    {/* Mobile Menu */}
                    <button
                        type="button"
                        aria-label="Open menu"
                        className="
                            hidden
                            max-[980px]:flex
                            h-6
                            w-6
                            items-center
                            justify-center
                            text-[#F5F5DC]
                            transition-colors
                            duration-200
                            hover:text-[#FF8F00]
                        "
                    >
                        <Menu
                            className="h-6 w-6"
                            strokeWidth={2}
                        />
                    </button>

                </div>

            </nav>
        </header>
    );
}