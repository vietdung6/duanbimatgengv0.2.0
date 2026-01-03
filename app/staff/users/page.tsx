"use client";

import UserManagementTab from "../components/UserManagementTab";
import { useAuth } from "@/lib/auth/AuthContext";

export default function UsersPage() {
    const { user } = useAuth();
    return <UserManagementTab currentUser={user} />;
}
