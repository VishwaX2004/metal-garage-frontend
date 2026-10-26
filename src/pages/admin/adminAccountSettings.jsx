import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    FaArrowLeft,
    FaSave,
    FaTimes,
    FaLock,
    FaUser,
    FaEnvelope,
    FaImage,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DEFAULT_PROFILE_IMAGE =
    "https://training.allsoftsolutions.in/images/avtar.png";

export default function AdminAccountSettings() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        profileImage: DEFAULT_PROFILE_IMAGE,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        fetchAdminData();
    }, []);

    async function fetchAdminData() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Authentication required");
                navigate("/admin");
                return;
            }

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/users/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const admin = response.data?.user || response.data;
            setForm((prev) => ({
                ...prev,
                firstName: admin.firstName || "",
                lastName: admin.lastName || "",
                email: admin.email || "",
                profileImage:
                    admin.profileImage ||
                    admin.profilePicture ||
                    DEFAULT_PROFILE_IMAGE,
            }));
        } catch (error) {
            console.error("Error fetching admin data:", error);
            toast.error("Failed to load account information");
        } finally {
            setIsLoading(false);
        }
    }

    function handleFieldChange(field, value) {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    async function handleSave() {
        if (!form.firstName.trim()) {
            toast.error("First name is required");
            return;
        }

        if (!form.lastName.trim()) {
            toast.error("Last name is required");
            return;
        }

        if (!form.email.trim()) {
            toast.error("Email is required");
            return;
        }

        if (form.newPassword || form.confirmPassword) {
            if (!form.currentPassword) {
                toast.error(
                    "Current password is required to change password"
                );
                return;
            }

            if (form.newPassword.length < 6) {
                toast.error(
                    "New password must be at least 6 characters"
                );
                return;
            }

            if (form.newPassword !== form.confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }
        }

        setIsSaving(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Authentication required");
                return;
            }

            const payload = {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim().toLowerCase(),
                profileImage:
                    form.profileImage.trim() ||
                    DEFAULT_PROFILE_IMAGE,
            };

            if (form.newPassword) {
                payload.currentPassword =
                    form.currentPassword;
                payload.newPassword =
                    form.newPassword;
            }

            const response = await axios.put(
                `${
                    import.meta.env.VITE_API_URL
                }/api/users/me`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                response.data?.message ||
                    "Account updated successfully"
            );

            // Clear password fields after successful update
            setForm((prev) => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            }));

            // Refresh admin data
            await fetchAdminData();
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(
                error.response?.data?.message ||
                    "Failed to update account"
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#ECE8D6]">
            {/* HEADER */}
            <div className="border-b border-black/[0.14] bg-[#F5F5DC] px-6 py-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() =>
                            navigate("/admin")
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-black/50 transition hover:bg-[#ECE8D6] hover:text-[#0A0A0A]"
                    >
                        <FaArrowLeft />
                    </button>

                    <div>
                        <h1 className="text-2xl font-bold text-[#0A0A0A]">
                            Account Settings
                        </h1>

                        <p className="mt-1 text-sm text-black/50">
                            Manage your profile and account settings
                        </p>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="mx-auto max-w-2xl p-6">
                {isLoading ? (
                    <div className="flex h-96 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ECE8D6] border-t-[#0A0A0A]" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* PROFILE IMAGE SECTION */}
                        <div className="rounded-[12px] border border-black/[0.14] bg-[#F5F5DC] p-6">
                            <h2 className="mb-4 text-lg font-semibold">
                                Profile Picture
                            </h2>

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="flex h-[100px] w-[100px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/[0.12] bg-[#ECE8D6]">
                                    <img
                                        src={
                                            form.profileImage ||
                                            DEFAULT_PROFILE_IMAGE
                                        }
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                        onError={(
                                            event
                                        ) => {
                                            event.currentTarget.src =
                                                DEFAULT_PROFILE_IMAGE;
                                        }}
                                    />
                                </div>

                                <div className="flex-1">
                                    <div className="relative">
                                        <FaImage className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />

                                        <input
                                            type="url"
                                            value={
                                                form.profileImage
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleFieldChange(
                                                    "profileImage",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="https://example.com/profile.jpg"
                                            className="w-full rounded-[7px] border border-black/[0.14] bg-[#ECE8D6] py-[11px] pl-9 pr-3 text-[12px] outline-none focus:border-[#FF8F00]"
                                        />
                                    </div>

                                    <p className="mt-2 text-[10px] text-black/40">
                                        Enter a public image URL
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* PERSONAL INFORMATION */}
                        <div className="rounded-[12px] border border-black/[0.14] bg-[#F5F5DC] p-6">
                            <h2 className="mb-4 text-lg font-semibold">
                                Personal Information
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.06em] text-black/50">
                                        First Name
                                    </label>

                                    <div className="relative">
                                        <FaUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/30 text-[12px]" />

                                        <input
                                            type="text"
                                            value={
                                                form.firstName
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleFieldChange(
                                                    "firstName",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="First name"
                                            className="w-full rounded-[7px] border border-black/[0.14] bg-[#ECE8D6] py-[11px] pl-9 pr-3 text-[12px] outline-none focus:border-[#FF8F00]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.06em] text-black/50">
                                        Last Name
                                    </label>

                                    <div className="relative">
                                        <FaUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/30 text-[12px]" />

                                        <input
                                            type="text"
                                            value={
                                                form.lastName
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleFieldChange(
                                                    "lastName",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Last name"
                                            className="w-full rounded-[7px] border border-black/[0.14] bg-[#ECE8D6] py-[11px] pl-9 pr-3 text-[12px] outline-none focus:border-[#FF8F00]"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.06em] text-black/50">
                                        Email
                                    </label>

                                    <div className="relative">
                                        <FaEnvelope className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/30 text-[12px]" />

                                        <input
                                            type="email"
                                            value={
                                                form.email
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleFieldChange(
                                                    "email",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Email"
                                            className="w-full rounded-[7px] border border-black/[0.14] bg-[#ECE8D6] py-[11px] pl-9 pr-3 text-[12px] outline-none focus:border-[#FF8F00]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PASSWORD SECTION */}
                        <div className="rounded-[12px] border border-black/[0.14] bg-[#F5F5DC] p-6">
                            <h2 className="mb-4 text-lg font-semibold">
                                Change Password
                            </h2>

                            <p className="mb-4 text-[12px] text-black/50">
                                Leave empty if you don't want to change your password
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.06em] text-black/50">
                                        Current Password
                                    </label>

                                    <div className="relative">
                                        <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/30 text-[12px]" />

                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                form.currentPassword
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleFieldChange(
                                                    "currentPassword",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Current password"
                                            className="w-full rounded-[7px] border border-black/[0.14] bg-[#ECE8D6] py-[11px] pl-9 pr-10 text-[12px] outline-none focus:border-[#FF8F00]"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 transition hover:text-[#0A0A0A]"
                                            tabIndex="-1"
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="text-[12px]" />
                                            ) : (
                                                <FaEye className="text-[12px]" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.06em] text-black/50">
                                        New Password
                                    </label>

                                    <div className="relative">
                                        <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/30 text-[12px]" />

                                        <input
                                            type={
                                                showNewPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                form.newPassword
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleFieldChange(
                                                    "newPassword",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="New password (min 6 characters)"
                                            className="w-full rounded-[7px] border border-black/[0.14] bg-[#ECE8D6] py-[11px] pl-9 pr-10 text-[12px] outline-none focus:border-[#FF8F00]"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowNewPassword(
                                                    !showNewPassword
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 transition hover:text-[#0A0A0A]"
                                            tabIndex="-1"
                                        >
                                            {showNewPassword ? (
                                                <FaEyeSlash className="text-[12px]" />
                                            ) : (
                                                <FaEye className="text-[12px]" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.06em] text-black/50">
                                        Confirm Password
                                    </label>

                                    <div className="relative">
                                        <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/30 text-[12px]" />

                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                form.confirmPassword
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleFieldChange(
                                                    "confirmPassword",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Confirm password"
                                            className="w-full rounded-[7px] border border-black/[0.14] bg-[#ECE8D6] py-[11px] pl-9 pr-10 text-[12px] outline-none focus:border-[#FF8F00]"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 transition hover:text-[#0A0A0A]"
                                            tabIndex="-1"
                                        >
                                            {showConfirmPassword ? (
                                                <FaEyeSlash className="text-[12px]" />
                                            ) : (
                                                <FaEye className="text-[12px]" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex gap-3">
                            <button
                                onClick={() =>
                                    navigate("/admin")
                                }
                                className="flex-1 rounded-[7px] border border-black/[0.14] bg-[#F5F5DC] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#0A0A0A] transition hover:border-[#0A0A0A] hover:bg-[#ECE8D6]"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-[7px] bg-[#0A0A0A] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#F5F5DC] transition hover:bg-[#FF8F00] hover:text-[#0A0A0A] disabled:opacity-60"
                            >
                                {isSaving ? (
                                    <>
                                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#F5F5DC] border-t-transparent" />
                                        Saving
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
