import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
    FaRegEdit,
    FaRegTrashAlt,
    FaUsers,
    FaUserShield,
    FaUserCheck,
    FaUserSlash,
    FaSearch,
    FaPlus,
    FaChevronLeft,
    FaChevronRight,
    FaTimes,
    FaSave,
    FaBan,
    FaCheckCircle,
    FaEnvelope,
    FaLock,
    FaImage,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { Loader } from "../../components/loader";

/* =========================================================
   DEFAULT PROFILE IMAGE
========================================================= */

const DEFAULT_PROFILE_IMAGE =
    "https://training.allsoftsolutions.in/images/avtar.png";

/* =========================================================
   AXIOS CONFIG
========================================================= */

function getAuthHeaders() {
    const token = localStorage.getItem("token");

    return {
        Authorization: `Bearer ${token}`,
    };
}

/* =========================================================
   DELETE CONFIRM MODAL
========================================================= */

function AdminUserDeleteConfirm({
    user,
    onClose,
    refresh,
}) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        if (!user?.userID) {
            toast.error("User ID is required");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login again");
            return;
        }

        setIsDeleting(true);

        try {
            const response = await axios.delete(
                `${
                    import.meta.env.VITE_API_URL
                }/api/users/admin/${encodeURIComponent(
                    user.userID
                )}`,
                {
                    headers: getAuthHeaders(),
                }
            );

            toast.success(
                response.data?.message ||
                    "User deleted successfully"
            );

            await refresh();
            onClose();
        } catch (error) {
            console.error(
                "Delete user error:",
                error.response?.data || error
            );

            toast.error(
                error.response?.data?.message ||
                    "Error deleting user"
            );

            setIsDeleting(false);
        }
    }

    const fullName =
        `${user?.firstName || ""} ${
            user?.lastName || ""
        }`.trim() || "Unknown User";

    return (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-[#0A0A0A]/[0.62] px-5 backdrop-blur-[4px]">
            <div className="w-full max-w-[620px] overflow-hidden rounded-[14px] border border-black/15 bg-[#F5F5DC] shadow-[0_30px_70px_rgba(0,0,0,.25)]">

                <div className="flex items-center justify-between border-b border-black/[0.14] px-[22px] py-5">
                    <div>
                        <h3 className="text-base font-semibold text-[#0A0A0A]">
                            Delete User
                        </h3>

                        <p className="mt-1 text-[11px] text-black/40">
                            This action cannot be undone
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-black/50 transition hover:bg-[#ECE8D6] hover:text-[#0A0A0A]"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="px-[22px] py-6">
                    <div className="flex items-start gap-4 rounded-lg border border-[#FF3B00]/15 bg-[#FF3B00]/[0.05] p-4">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FF3B00]/10 text-[#FF3B00]">
                            <FaRegTrashAlt />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#0A0A0A]">
                                Are you sure you want to
                                delete this user?
                            </p>

                            <p className="mt-2 text-[13px] font-semibold">
                                {fullName}
                            </p>

                            <p className="mt-1 text-[11px] text-black/45">
                                {user?.email}
                            </p>

                            <p className="mt-2 font-mono text-[9px] text-black/40">
                                USER ID: {user?.userID}
                            </p>

                            <p className="mt-3 text-[11px] leading-5 text-[#FF3B00]">
                                Deleting this account will
                                permanently remove the user
                                from your database.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-[9px] border-t border-black/[0.14] px-[22px] py-4">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="rounded-[7px] border border-black/[0.14] bg-[#F5F5DC] px-[18px] py-[11px] text-[12px] font-semibold uppercase tracking-[0.06em] text-[#0A0A0A] transition hover:border-[#0A0A0A] hover:bg-[#ECE8D6]"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-2 rounded-[7px] bg-[#0A0A0A] px-[18px] py-[11px] text-[12px] font-semibold uppercase tracking-[0.06em] text-[#F5F5DC] transition hover:bg-[#FF3B00] hover:text-[#0A0A0A] disabled:opacity-60"
                    >
                        {isDeleting ? (
                            <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#F5F5DC] border-t-transparent" />
                                Deleting
                            </>
                        ) : (
                            <>
                                <FaRegTrashAlt className="text-[11px]" />
                                Delete
                            </>
                        )}
                    </button>

                </div>
            </div>
        </div>
    );
}

/* =========================================================
   USER FORM MODAL
========================================================= */

function AdminUserFormModal({
    user,
    onClose,
    refresh,
}) {
    const isEdit = Boolean(user);

    const [isSaving, setIsSaving] = useState(false);

    const [form, setForm] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        password: "",
        role: user?.role || "user",
        isBlock: Boolean(user?.isBlock),
        isEmailVerified: Boolean(
            user?.isEmailVerified
        ),
        profileImage:
            user?.profileImage ||
            DEFAULT_PROFILE_IMAGE,
    });

    function updateField(field, value) {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

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

        if (!isEdit && !form.password) {
            toast.error("Password is required");
            return;
        }

        if (
            form.password &&
            form.password.length < 6
        ) {
            toast.error(
                "Password must contain at least 6 characters"
            );
            return;
        }

        setIsSaving(true);

        try {
            const payload = {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim().toLowerCase(),
                role: form.role,
                isBlock: form.isBlock,
                isEmailVerified:
                    form.isEmailVerified,
                profileImage:
                    form.profileImage.trim() ||
                    DEFAULT_PROFILE_IMAGE,
            };

            if (form.password.trim()) {
                payload.password =
                    form.password.trim();
            }

            let response;

            if (isEdit) {
                response = await axios.put(
                    `${
                        import.meta.env.VITE_API_URL
                    }/api/users/admin/${encodeURIComponent(
                        user.userID
                    )}`,
                    payload,
                    {
                        headers: getAuthHeaders(),
                    }
                );
            } else {
                response = await axios.post(
                    `${
                        import.meta.env.VITE_API_URL
                    }/api/users/admin`,
                    {
                        ...payload,
                        password: form.password,
                    },
                    {
                        headers: getAuthHeaders(),
                    }
                );
            }

            toast.success(
                response.data?.message ||
                    (isEdit
                        ? "User updated successfully"
                        : "User created successfully")
            );

            await refresh();
            onClose();
        } catch (error) {
            console.error(
                "Save user error:",
                error.response?.data || error
            );

            toast.error(
                error.response?.data?.message ||
                    "Unable to save user"
            );

            setIsSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[1400] flex items-center justify-center overflow-y-auto bg-[#0A0A0A]/[0.62] px-4 py-8 backdrop-blur-[4px]">

            <div className="my-auto w-full max-w-[760px] overflow-hidden rounded-[14px] border border-black/15 bg-[#F5F5DC] shadow-[0_30px_70px_rgba(0,0,0,.25)]">

                {/* HEADER */}

                <div className="flex items-center justify-between border-b border-black/[0.14] px-[22px] py-5">
                    <div>
                        <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/35">
                            GARAGE / USERS
                        </div>

                        <h3 className="mt-1 text-base font-semibold text-[#0A0A0A]">
                            {isEdit
                                ? "Edit User"
                                : "Create User"}
                        </h3>

                        <p className="mt-1 text-[11px] text-black/40">
                            {isEdit
                                ? "Update account information and permissions"
                                : "Create a new Metal Garage account"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-black/50 transition hover:bg-[#ECE8D6] hover:text-[#0A0A0A]"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* FORM */}

                <form onSubmit={handleSubmit}>

                    <div className="max-h-[70vh] overflow-y-auto px-[22px] py-6">

                        {/* BASIC INFORMATION */}

                        <div className="mb-5">
                            <div className="mb-3 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-black/40">
                                Basic Information
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <FormInput
                                    label="First Name"
                                    value={form.firstName}
                                    onChange={(value) =>
                                        updateField(
                                            "firstName",
                                            value
                                        )
                                    }
                                    placeholder="First name"
                                    required
                                />

                                <FormInput
                                    label="Last Name"
                                    value={form.lastName}
                                    onChange={(value) =>
                                        updateField(
                                            "lastName",
                                            value
                                        )
                                    }
                                    placeholder="Last name"
                                    required
                                />

                                <div className="sm:col-span-2">
                                    <FormInput
                                        label="Email"
                                        value={form.email}
                                        onChange={(value) =>
                                            updateField(
                                                "email",
                                                value
                                            )
                                        }
                                        placeholder="user@example.com"
                                        type="email"
                                        required
                                    />
                                </div>

                            </div>
                        </div>

                        {/* PASSWORD */}

                        <div className="mb-5">
                            <div className="mb-3 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-black/40">
                                Password
                            </div>

                            <FormInput
                                label={
                                    isEdit
                                        ? "New Password"
                                        : "Password"
                                }
                                value={form.password}
                                onChange={(value) =>
                                    updateField(
                                        "password",
                                        value
                                    )
                                }
                                placeholder={
                                    isEdit
                                        ? "Leave empty to keep current password"
                                        : "Minimum 6 characters"
                                }
                                type="password"
                                icon={<FaLock />}
                                required={!isEdit}
                            />

                            {isEdit && (
                                <p className="mt-2 text-[10px] text-black/35">
                                    Leave this field empty
                                    if you do not want to
                                    change the password.
                                </p>
                            )}
                        </div>

                        {/* ACCOUNT SETTINGS */}

                        <div className="mb-5">
                            <div className="mb-3 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-black/40">
                                Account Settings
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.06em] text-black/50">
                                        Role
                                    </label>

                                    <select
                                        value={form.role}
                                        onChange={(event) =>
                                            updateField(
                                                "role",
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-[7px] border border-black/[0.14] bg-[#ECE8D6] px-[13px] py-[11px] text-[12px] outline-none focus:border-[#FF8F00]"
                                    >
                                        <option value="user">
                                            User
                                        </option>

                                        <option value="admin">
                                            Admin
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.06em] text-black/50">
                                        Account Status
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateField(
                                                "isBlock",
                                                !form.isBlock
                                            )
                                        }
                                        className={`flex w-full items-center justify-between rounded-[7px] border px-[13px] py-[10px] text-left transition ${
                                            form.isBlock
                                                ? "border-[#FF3B00]/30 bg-[#FF3B00]/[0.06]"
                                                : "border-[#2F7A45]/25 bg-[#2F7A45]/[0.05]"
                                        }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {form.isBlock ? (
                                                <FaBan className="text-[#FF3B00]" />
                                            ) : (
                                                <FaCheckCircle className="text-[#2F7A45]" />
                                            )}

                                            <span className="text-[12px] font-semibold">
                                                {form.isBlock
                                                    ? "Blocked"
                                                    : "Active"}
                                            </span>
                                        </span>

                                        <span className="font-mono text-[9px] uppercase tracking-[0.06em] text-black/35">
                                            Click to change
                                        </span>
                                    </button>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    updateField(
                                        "isEmailVerified",
                                        !form.isEmailVerified
                                    )
                                }
                                className="mt-4 flex w-full items-center gap-3 rounded-[8px] border border-black/[0.10] bg-[#ECE8D6] px-4 py-3 text-left transition hover:border-[#FF8F00]/40"
                            >
                                <span
                                    className={`flex h-8 w-8 items-center justify-center rounded-md ${
                                        form.isEmailVerified
                                            ? "bg-[#2F7A45]/10 text-[#2F7A45]"
                                            : "bg-black/[0.05] text-black/40"
                                    }`}
                                >
                                    <FaEnvelope />
                                </span>

                                <span className="flex-1">
                                    <span className="block text-[11px] font-semibold">
                                        Email Verification
                                    </span>

                                    <span className="mt-0.5 block text-[9px] text-black/40">
                                        {form.isEmailVerified
                                            ? "Email is verified"
                                            : "Email is not verified"}
                                    </span>
                                </span>

                                <span
                                    className={`font-mono text-[9px] font-semibold uppercase ${
                                        form.isEmailVerified
                                            ? "text-[#2F7A45]"
                                            : "text-black/35"
                                    }`}
                                >
                                    {form.isEmailVerified
                                        ? "Verified"
                                        : "Unverified"}
                                </span>
                            </button>
                        </div>

                        {/* PROFILE IMAGE */}

                        <div>
                            <div className="mb-3 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-black/40">
                                Profile Image
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                                <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/[0.12] bg-[#ECE8D6]">
                                    <img
                                        src={
                                            form.profileImage ||
                                            DEFAULT_PROFILE_IMAGE
                                        }
                                        alt="Profile preview"
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
                                                updateField(
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

                                    <p className="mt-2 text-[9px] text-black/35">
                                        Enter a public image
                                        URL.
                                    </p>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* FOOTER */}

                    <div className="flex justify-end gap-[9px] border-t border-black/[0.14] px-[22px] py-4">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="rounded-[7px] border border-black/[0.14] bg-[#F5F5DC] px-[18px] py-[11px] text-[12px] font-semibold uppercase tracking-[0.06em] text-[#0A0A0A] transition hover:border-[#0A0A0A] hover:bg-[#ECE8D6]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 rounded-[7px] bg-[#0A0A0A] px-[18px] py-[11px] text-[12px] font-semibold uppercase tracking-[0.06em] text-[#F5F5DC] transition hover:bg-[#FF8F00] hover:text-[#0A0A0A] disabled:opacity-60"
                        >
                            {isSaving ? (
                                <>
                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#F5F5DC] border-t-transparent" />
                                    Saving
                                </>
                            ) : (
                                <>
                                    <FaSave />
                                    {isEdit
                                        ? "Save Changes"
                                        : "Create User"}
                                </>
                            )}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}

/* =========================================================
   MAIN ADMIN USER PAGE
========================================================= */

export default function AdminUserPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [role, setRole] = useState("all");
    const [accountStatus, setAccountStatus] =
        useState("all");
    const [verificationStatus, setVerificationStatus] =
        useState("all");

    const [isFormVisible, setIsFormVisible] =
        useState(false);

    const [userToEdit, setUserToEdit] =
        useState(null);

    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] =
        useState(false);

    const [userToDelete, setUserToDelete] =
        useState(null);

    /* =====================================================
       FETCH USERS
    ===================================================== */

    async function fetchUsers() {
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please login again");
                setUsers([]);
                return;
            }

            const response = await axios.get(
                `${
                    import.meta.env.VITE_API_URL
                }/api/users/admin`,
                {
                    headers: getAuthHeaders(),
                }
            );

            const fetchedUsers =
                Array.isArray(response.data?.users)
                    ? response.data.users
                    : Array.isArray(response.data)
                    ? response.data
                    : [];

            setUsers(fetchedUsers);
        } catch (error) {
            console.error(
                "Error fetching users:",
                error.response?.data || error
            );

            if (
                error.response?.status === 401
            ) {
                toast.error(
                    "Your session has expired. Please login again."
                );
            } else if (
                error.response?.status === 403
            ) {
                toast.error(
                    "Admin access is required."
                );
            } else {
                toast.error(
                    error.response?.data?.message ||
                        "Failed to load users"
                );
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    /* =====================================================
       FILTER USERS
    ===================================================== */

    const filteredUsers = useMemo(() => {
        const searchText =
            search.toLowerCase().trim();

        return users.filter((user) => {
            const fullName =
                `${user.firstName || ""} ${
                    user.lastName || ""
                }`
                    .trim()
                    .toLowerCase();

            const email =
                String(user.email || "")
                    .toLowerCase();

            const userID =
                String(user.userID || user.id || "")
                    .toLowerCase();

            const matchesSearch =
                !searchText ||
                fullName.includes(searchText) ||
                email.includes(searchText) ||
                userID.includes(searchText);

            const matchesRole =
                role === "all" ||
                user.role === role;

            let matchesStatus = true;

            if (accountStatus === "active") {
                matchesStatus =
                    user.isBlock !== true;
            }

            if (accountStatus === "blocked") {
                matchesStatus =
                    user.isBlock === true;
            }

            let matchesVerification = true;

            if (
                verificationStatus ===
                "verified"
            ) {
                matchesVerification =
                    user.isEmailVerified === true;
            }

            if (
                verificationStatus ===
                "unverified"
            ) {
                matchesVerification =
                    user.isEmailVerified !== true;
            }

            return (
                matchesSearch &&
                matchesRole &&
                matchesStatus &&
                matchesVerification
            );
        });
    }, [
        users,
        search,
        role,
        accountStatus,
        verificationStatus,
    ]);

    /* =====================================================
       RESET FILTERS
    ===================================================== */

    function resetFilters() {
        setSearch("");
        setRole("all");
        setAccountStatus("all");
        setVerificationStatus("all");
    }

    /* =====================================================
       OPEN CREATE
    ===================================================== */

    function openCreateUser() {
        setUserToEdit(null);
        setIsFormVisible(true);
    }

    /* =====================================================
       OPEN EDIT
    ===================================================== */

    function openEditUser(user) {
        setUserToEdit(user);
        setIsFormVisible(true);
    }

    /* =====================================================
       OPEN DELETE
    ===================================================== */

    function openDeleteUser(user) {
        if (!user?.userID) {
            toast.error("User ID is required");
            return;
        }

        setUserToDelete(user);
        setIsDeleteConfirmVisible(true);
    }

    /* =====================================================
       USER COUNTS
    ===================================================== */

    const totalUsers = users.length;

    const totalAdmins = users.filter(
        (user) => user.role === "admin"
    ).length;

    const totalVerified = users.filter(
        (user) =>
            user.isEmailVerified === true
    ).length;

    const totalBlocked = users.filter(
        (user) => user.isBlock === true
    ).length;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

                .metal-garage-users {
                    font-family: 'Work Sans', sans-serif;
                    -webkit-font-smoothing: antialiased;
                }

                .display-font {
                    font-family: 'Oswald', sans-serif;
                    text-transform: uppercase;
                    letter-spacing: .01em;
                    font-weight: 700;
                    line-height: 1.05;
                }

                .mono-font {
                    font-family: 'JetBrains Mono', monospace;
                    letter-spacing: .03em;
                }

                @keyframes rowIn {
                    from {
                        opacity: 0;
                        transform: translateY(4px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .metal-row {
                    animation: rowIn .2s ease both;
                }
            `}</style>

            <div className="metal-garage-users min-h-screen w-full bg-[#ECE8D6] text-[#0A0A0A]">

                {/* =====================================================
                    FORM MODAL
                ===================================================== */}

                {isFormVisible && (
                    <AdminUserFormModal
                        user={userToEdit}
                        refresh={fetchUsers}
                        onClose={() => {
                            setIsFormVisible(
                                false
                            );
                            setUserToEdit(null);
                        }}
                    />
                )}

                {/* =====================================================
                    DELETE MODAL
                ===================================================== */}

                {isDeleteConfirmVisible && (
                    <AdminUserDeleteConfirm
                        user={userToDelete}
                        refresh={fetchUsers}
                        onClose={() => {
                            setIsDeleteConfirmVisible(
                                false
                            );
                            setUserToDelete(null);
                        }}
                    />
                )}

                <main className="w-full">

                    <section className="px-4 pb-12 pt-6 sm:px-6 lg:px-8 xl:px-10">

                        <div className="mx-auto max-w-[1700px]">

                            {/* =================================================
                                HEADER
                            ================================================= */}

                            <div className="mb-6 flex flex-wrap items-center justify-between gap-5">

                                <div>

                                    <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-black/40">
                                        GARAGE / USERS
                                    </div>

                                    <h1 className="display-font text-[30px] sm:text-[34px] lg:text-[38px]">
                                        User Management
                                    </h1>

                                    <p className="mt-[7px] max-w-[620px] text-[12px] leading-5 text-black/48">
                                        Manage Metal Garage
                                        accounts, permissions,
                                        verification and
                                        account status.
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        openCreateUser
                                    }
                                    className="group inline-flex items-center justify-center gap-2 rounded-[7px] bg-[#0A0A0A] px-[18px] py-[11px] text-[12px] font-semibold uppercase tracking-[0.06em] text-[#F5F5DC] transition hover:bg-[#FF8F00] hover:text-[#0A0A0A] max-sm:w-full"
                                >
                                    <FaPlus className="transition-transform duration-200 group-hover:rotate-90" />

                                    Add User
                                </button>

                            </div>

                            {/* =================================================
                                STAT CARDS
                            ================================================= */}

                            <div className="mb-[22px] grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-4">

                                <StatCard
                                    title="Total Users"
                                    value={
                                        totalUsers
                                    }
                                    description="Registered accounts"
                                    icon={
                                        <FaUsers />
                                    }
                                    iconType="black"
                                />

                                <StatCard
                                    title="Administrators"
                                    value={
                                        totalAdmins
                                    }
                                    description="Users with admin access"
                                    icon={
                                        <FaUserShield />
                                    }
                                    iconType="orange"
                                />

                                <StatCard
                                    title="Verified Users"
                                    value={
                                        totalVerified
                                    }
                                    description="Email verified accounts"
                                    icon={
                                        <FaUserCheck />
                                    }
                                    iconType="green"
                                />

                                <StatCard
                                    title="Blocked Users"
                                    value={
                                        totalBlocked
                                    }
                                    description="Accounts currently blocked"
                                    icon={
                                        <FaUserSlash />
                                    }
                                    iconType="red"
                                />

                            </div>

                            {/* =================================================
                                FILTERS
                            ================================================= */}

                            <div className="mb-[18px] flex flex-wrap items-center gap-3 rounded-[12px] border border-black/[0.14] bg-[#F5F5DC] p-[17px]">

                                {/* SEARCH */}

                                <div className="flex min-w-[230px] flex-1 items-center gap-2.5 rounded-[7px] border border-black/[0.14] bg-[#ECE8D6] px-[13px] py-[10px]">

                                    <FaSearch className="text-[14px] text-black/40" />

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(
                                            event
                                        ) =>
                                            setSearch(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Search name, email or user ID..."
                                        className="w-full border-none bg-transparent text-[13px] outline-none placeholder:text-black/40"
                                    />

                                </div>

                                {/* ROLE */}

                                <select
                                    value={role}
                                    onChange={(
                                        event
                                    ) =>
                                        setRole(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="min-w-[145px] cursor-pointer rounded-[7px] border border-black/[0.14] bg-[#ECE8D6] px-[13px] py-[10px] text-[12px] outline-none"
                                >
                                    <option value="all">
                                        All Roles
                                    </option>

                                    <option value="user">
                                        Users
                                    </option>

                                    <option value="admin">
                                        Admins
                                    </option>
                                </select>

                                {/* STATUS */}

                                <select
                                    value={
                                        accountStatus
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setAccountStatus(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="min-w-[155px] cursor-pointer rounded-[7px] border border-black/[0.14] bg-[#ECE8D6] px-[13px] py-[10px] text-[12px] outline-none"
                                >
                                    <option value="all">
                                        All Status
                                    </option>

                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="blocked">
                                        Blocked
                                    </option>
                                </select>

                                {/* VERIFICATION */}

                                <select
                                    value={
                                        verificationStatus
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setVerificationStatus(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="min-w-[165px] cursor-pointer rounded-[7px] border border-black/[0.14] bg-[#ECE8D6] px-[13px] py-[10px] text-[12px] outline-none"
                                >
                                    <option value="all">
                                        All Verification
                                    </option>

                                    <option value="verified">
                                        Verified
                                    </option>

                                    <option value="unverified">
                                        Unverified
                                    </option>
                                </select>

                                <button
                                    type="button"
                                    onClick={
                                        resetFilters
                                    }
                                    className="rounded-[7px] border border-black/[0.14] bg-[#F5F5DC] px-[18px] py-[11px] text-[12px] font-semibold uppercase tracking-[0.06em] transition hover:border-[#0A0A0A] hover:bg-[#ECE8D6]"
                                >
                                    Reset
                                </button>

                            </div>

                            {/* =================================================
                                TABLE
                            ================================================= */}

                            <div className="overflow-hidden rounded-[12px] border border-black/[0.14] bg-[#F5F5DC]">

                                {/* TABLE HEADER */}

                                <div className="flex items-center justify-between gap-3 border-b border-black/[0.14] px-[22px] py-5">

                                    <div>

                                        <h2 className="text-[15px] font-semibold">
                                            All Users
                                        </h2>

                                        <p className="mt-1 text-[11.5px] text-black/43">
                                            User accounts,
                                            roles and account
                                            status
                                        </p>

                                    </div>

                                    <div className="mono-font text-[11px] text-black/45">
                                        {
                                            filteredUsers.length
                                        }{" "}
                                        USERS
                                    </div>

                                </div>

                                {isLoading ? (
                                    <div className="flex min-h-[380px] items-center justify-center">
                                        <Loader />
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">

                                        <table className="w-full min-w-[1120px] border-collapse">

                                            <thead>
                                                <tr>

                                                    <TableHeader>
                                                        User
                                                    </TableHeader>

                                                    <TableHeader>
                                                        Role
                                                    </TableHeader>

                                                    <TableHeader>
                                                        Verification
                                                    </TableHeader>

                                                    <TableHeader>
                                                        Status
                                                    </TableHeader>

                                                    <TableHeader>
                                                        Created
                                                    </TableHeader>

                                                    <TableHeader>
                                                        Actions
                                                    </TableHeader>

                                                </tr>
                                            </thead>

                                            <tbody>

                                                {filteredUsers.length >
                                                0 ? (
                                                    filteredUsers.map(
                                                        (
                                                            item,
                                                            index
                                                        ) => {
                                                            const fullName =
                                                                `${item.firstName || ""} ${
                                                                    item.lastName ||
                                                                    ""
                                                                }`.trim() ||
                                                                "Unknown User";

                                                            const image =
                                                                item.profileImage ||
                                                                DEFAULT_PROFILE_IMAGE;

                                                            return (
                                                                <tr
                                                                    key={
                                                                        item.userID ||
                                                                        item.id ||
                                                                        item._id ||
                                                                        index
                                                                    }
                                                                    className="metal-row border-b border-black/[0.07] hover:bg-[#ECE8D6]"
                                                                    style={{
                                                                        animationDelay: `${index * 30}ms`,
                                                                    }}
                                                                >

                                                                    {/* USER */}

                                                                    <td className="px-[18px] py-[15px]">

                                                                        <div className="flex min-w-[280px] items-center gap-3">

                                                                            <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/[0.08] bg-[#ECE8D6]">

                                                                                <img
                                                                                    src={
                                                                                        image
                                                                                    }
                                                                                    alt={
                                                                                        fullName
                                                                                    }
                                                                                    className="h-full w-full object-cover"
                                                                                    onError={(
                                                                                        event
                                                                                    ) => {
                                                                                        event.currentTarget.src =
                                                                                            DEFAULT_PROFILE_IMAGE;
                                                                                    }}
                                                                                />

                                                                            </div>

                                                                            <div className="min-w-0">

                                                                                <div className="max-w-[250px] truncate text-[13px] font-semibold">
                                                                                    {
                                                                                        fullName
                                                                                    }
                                                                                </div>

                                                                                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-black/45">
                                                                                    <FaEnvelope className="text-[9px]" />

                                                                                    <span className="max-w-[230px] truncate">
                                                                                        {
                                                                                            item.email
                                                                                        }
                                                                                    </span>
                                                                                </div>

                                                                                <div className="mono-font mt-1 text-[8.5px] text-black/32">
                                                                                    ID:{" "}
                                                                                    {
                                                                                        item.userID
                                                                                    }
                                                                                </div>

                                                                            </div>

                                                                        </div>

                                                                    </td>

                                                                    {/* ROLE */}

                                                                    <td className="px-[18px] py-[15px]">

                                                                        <span
                                                                            className={`mono-font inline-flex items-center gap-1.5 rounded-[5px] px-[9px] py-[5px] text-[10px] font-semibold uppercase ${
                                                                                item.role ===
                                                                                "admin"
                                                                                    ? "bg-[#FF8F00]/12 text-[#CC7000]"
                                                                                    : "bg-black/[0.05] text-black/60"
                                                                            }`}
                                                                        >

                                                                            <span
                                                                                className={`h-[5px] w-[5px] rounded-full ${
                                                                                    item.role ===
                                                                                    "admin"
                                                                                        ? "bg-[#FF8F00]"
                                                                                        : "bg-black/30"
                                                                                }`}
                                                                            />

                                                                            {item.role ||
                                                                                "user"}

                                                                        </span>

                                                                    </td>

                                                                    {/* VERIFICATION */}

                                                                    <td className="px-[18px] py-[15px]">

                                                                        {item.isEmailVerified ? (
                                                                            <span className="mono-font inline-flex items-center gap-[6px] rounded-full bg-[#2F7A45]/10 px-[9px] py-[5px] text-[9.5px] font-semibold uppercase text-[#2F7A45]">

                                                                                <span className="h-[6px] w-[6px] rounded-full bg-[#2F7A45]" />

                                                                                Verified

                                                                            </span>
                                                                        ) : (
                                                                            <span className="mono-font inline-flex items-center gap-[6px] rounded-full bg-[#FF8F00]/12 px-[9px] py-[5px] text-[9.5px] font-semibold uppercase text-[#CC7000]">

                                                                                <span className="h-[6px] w-[6px] rounded-full bg-[#FF8F00]" />

                                                                                Pending

                                                                            </span>
                                                                        )}

                                                                    </td>

                                                                    {/* STATUS */}

                                                                    <td className="px-[18px] py-[15px]">

                                                                        {item.isBlock ? (
                                                                            <span className="mono-font inline-flex items-center gap-[6px] rounded-full bg-[#FF3B00]/[0.08] px-[9px] py-[5px] text-[9.5px] font-semibold uppercase text-[#FF3B00]">

                                                                                <span className="h-[6px] w-[6px] rounded-full bg-[#FF3B00]" />

                                                                                Blocked

                                                                            </span>
                                                                        ) : (
                                                                            <span className="mono-font inline-flex items-center gap-[6px] rounded-full bg-[#2F7A45]/10 px-[9px] py-[5px] text-[9.5px] font-semibold uppercase text-[#2F7A45]">

                                                                                <span className="h-[6px] w-[6px] rounded-full bg-[#2F7A45]" />

                                                                                Active

                                                                            </span>
                                                                        )}

                                                                    </td>

                                                                    {/* CREATED */}

                                                                    <td className="px-[18px] py-[15px]">

                                                                        <span className="mono-font text-[10.5px] text-black/55">
                                                                            {item.createdAt
                                                                                ? new Date(
                                                                                      item.createdAt
                                                                                  ).toLocaleDateString()
                                                                                : "—"}
                                                                        </span>

                                                                    </td>

                                                                    {/* ACTIONS */}

                                                                    <td className="px-[18px] py-[15px]">

                                                                        <div className="flex items-center gap-[5px]">

                                                                            <button
                                                                                type="button"
                                                                                title="Edit user"
                                                                                onClick={() =>
                                                                                    openEditUser(
                                                                                        item
                                                                                    )
                                                                                }
                                                                                className="flex h-[31px] w-[31px] items-center justify-center rounded-[6px] text-black/45 hover:bg-[#ECE8D6] hover:text-[#0A0A0A]"
                                                                            >
                                                                                <FaRegEdit />
                                                                            </button>

                                                                            <button
                                                                                type="button"
                                                                                title={
                                                                                    item.isBlock
                                                                                        ? "Unblock user"
                                                                                        : "Block user"
                                                                                }
                                                                                onClick={() =>
                                                                                    openEditUser(
                                                                                        item
                                                                                    )
                                                                                }
                                                                                className={`flex h-[31px] w-[31px] items-center justify-center rounded-[6px] ${
                                                                                    item.isBlock
                                                                                        ? "text-[#2F7A45] hover:bg-[#2F7A45]/10"
                                                                                        : "text-[#FF8F00] hover:bg-[#FF8F00]/10"
                                                                                }`}
                                                                            >
                                                                                {item.isBlock ? (
                                                                                    <FaCheckCircle />
                                                                                ) : (
                                                                                    <FaBan />
                                                                                )}
                                                                            </button>

                                                                            <button
                                                                                type="button"
                                                                                title="Delete user"
                                                                                onClick={() =>
                                                                                    openDeleteUser(
                                                                                        item
                                                                                    )
                                                                                }
                                                                                className="flex h-[31px] w-[31px] items-center justify-center rounded-[6px] text-black/45 hover:bg-[#ECE8D6] hover:text-[#FF3B00]"
                                                                            >
                                                                                <FaRegTrashAlt />
                                                                            </button>

                                                                        </div>

                                                                    </td>

                                                                </tr>
                                                            );
                                                        }
                                                    )
                                                ) : (
                                                    <tr>

                                                        <td
                                                            colSpan="6"
                                                            className="px-6 py-20 text-center"
                                                        >

                                                            <div className="flex flex-col items-center">

                                                                <FaUsers className="mb-4 text-3xl text-black/25" />

                                                                <p className="text-sm font-semibold">
                                                                    No users
                                                                    found
                                                                </p>

                                                                <p className="mt-1 text-[11px] text-black/40">
                                                                    Create
                                                                    your
                                                                    first
                                                                    user
                                                                    account
                                                                    to get
                                                                    started.
                                                                </p>

                                                            </div>

                                                        </td>

                                                    </tr>
                                                )}

                                            </tbody>

                                        </table>

                                    </div>
                                )}

                                {/* =================================================
                                    FOOTER
                                ================================================= */}

                                {!isLoading && (
                                    <div className="flex items-center justify-between border-t border-black/[0.14] px-[18px] py-[15px]">

                                        <div className="text-[11px] text-black/43">

                                            Showing{" "}

                                            <span className="font-semibold">
                                                {
                                                    filteredUsers.length
                                                }
                                            </span>{" "}

                                            user
                                            {filteredUsers.length !==
                                            1
                                                ? "s"
                                                : ""}

                                        </div>

                                        <div className="flex gap-[5px]">

                                            <button
                                                type="button"
                                                disabled
                                                className="flex h-[31px] w-[31px] items-center justify-center rounded-[6px] border border-black/[0.14] text-black/30"
                                            >
                                                <FaChevronLeft className="text-[9px]" />
                                            </button>

                                            <button
                                                type="button"
                                                className="flex h-[31px] w-[31px] items-center justify-center rounded-[6px] bg-[#0A0A0A] font-mono text-[10px] text-[#F5F5DC]"
                                            >
                                                1
                                            </button>

                                            <button
                                                type="button"
                                                disabled
                                                className="flex h-[31px] w-[31px] items-center justify-center rounded-[6px] border border-black/[0.14] text-black/30"
                                            >
                                                <FaChevronRight className="text-[9px]" />
                                            </button>

                                        </div>

                                    </div>
                                )}

                            </div>

                            {/* BOTTOM */}

                            <div className="mt-5 flex items-center justify-between text-[10px] text-black/35">

                                <span className="mono-font">
                                    METAL GARAGE / USER MANAGEMENT
                                </span>

                                <span className="mono-font">
                                    {users.length} USERS
                                </span>

                            </div>

                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}

/* =========================================================
   FORM INPUT
========================================================= */

function FormInput({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    required = false,
    icon = null,
}) {
    return (
        <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.06em] text-black/50">
                {label}
            </label>

            <div className="relative">
                {icon && (
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-black/30">
                        {icon}
                    </span>
                )}

                <input
                    type={type}
                    value={value}
                    required={required}
                    onChange={(event) =>
                        onChange(
                            event.target.value
                        )
                    }
                    placeholder={placeholder}
                    className={`w-full rounded-[7px] border border-black/[0.14] bg-[#ECE8D6] py-[11px] text-[12px] outline-none transition focus:border-[#FF8F00] ${
                        icon
                            ? "pl-9 pr-3"
                            : "px-[13px]"
                    }`}
                />
            </div>
        </div>
    );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
    title,
    value,
    description,
    icon,
    iconType,
}) {
    const iconClasses = {
        black: "bg-black/[0.06] text-[#0A0A0A]",
        orange:
            "bg-[#FF8F00]/[0.12] text-[#CC7000]",
        red: "bg-[#FF3B00]/10 text-[#FF3B00]",
        green:
            "bg-[#2F7A45]/[0.12] text-[#2F7A45]",
    };

    return (
        <div className="rounded-[12px] border border-black/[0.14] bg-[#F5F5DC] px-[21px] py-[19px] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(10,10,10,.07)]">

            <div className="mb-[14px]">
                <div
                    className={`flex h-[38px] w-[38px] items-center justify-center rounded-[9px] ${iconClasses[iconType]}`}
                >
                    {icon}
                </div>
            </div>

            <div className="mb-[5px] text-[12px] text-black/50">
                {title}
            </div>

            <div className="mono-font text-[25px] font-semibold">
                {value}
            </div>

            <div className="mt-[5px] text-[11px] text-black/40">
                {description}
            </div>

        </div>
    );
}

/* =========================================================
   TABLE HEADER
========================================================= */

function TableHeader({ children }) {
    return (
        <th className="whitespace-nowrap border-b border-black/[0.14] px-[18px] py-[13px] text-left font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-black/42">
            {children}
        </th>
    );
}