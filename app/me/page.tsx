import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Trophy, History, LogOut, Shield, User, Mail, Link as LinkIcon, Crown, LayoutDashboard } from "lucide-react";

import { verifyAuthToken, type AuthUser, isAdmin, isStaff } from "@/lib/auth";
import { getAuthUserById } from "@/lib/auth/userService";
import { getUserHistory } from "@/lib/history/historyService";
import UserAvatar from "@/components/shared/UserAvatar";
import HistoryList from "@/components/me/HistoryList";
import ChangePasswordForm from "@/components/me/ChangePasswordForm";
import AvatarEditButton from "@/components/me/AvatarEditButton";
import DisplayNameEdit from "@/components/me/DisplayNameEdit";
import ProfileTabs from "@/components/me/ProfileTabs";

async function logoutAction() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete("geng_auth");

  redirect("/login");
}


export default async function MePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("geng_auth")?.value || null;

  const authUserPayload: AuthUser | null = token ? verifyAuthToken(token) : null;

  if (!authUserPayload) {
    redirect("/login");
  }

  // Fetch fresh user data from DB to get latest points
  const user = await getAuthUserById(authUserPayload.id);

  if (!user) {
    redirect("/login");
  }

  const displayName =
    user.displayName || user.username || user.email.split("@")[0] || "User";
  const fallbackAvatar =
    "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(displayName) +
    "&background=2a2a2a&color=ffd700";
  const avatarUrl = user.avatarUrl || fallbackAvatar;

  const history = await getUserHistory(user.id);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">

          {/* Left Column: Profile Card */}
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gray-900/50 backdrop-blur-sm p-6 shadow-2xl shadow-gold/5">
              {/* Decorative Elements */}
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gold/10 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <UserAvatar
                    src={avatarUrl}
                    alt={displayName}
                    fallback={displayName.charAt(0).toUpperCase()}
                    className="h-28 w-28 rounded-full border-2 border-gold shadow-[0_0_15px_rgba(170,128,24,0.3)] bg-black"
                  />
                  {/* Avatar Edit Button */}
                  <AvatarEditButton currentAvatarUrl={user.avatarUrl} displayName={displayName} />

                  <div className="absolute -bottom-2 -left-2 bg-black border border-gold/50 rounded-full p-1.5 shadow-lg">
                    {user.role === "admin" ? (
                      <Crown size={16} className="text-red-500" />
                    ) : user.role === "staff" ? (
                      <Shield size={16} className="text-gold" />
                    ) : (
                      <User size={16} className="text-gold" />
                    )}
                  </div>
                </div>

                <DisplayNameEdit
                  initialDisplayName={displayName}
                  lastDisplayNameChange={user.lastDisplayNameChange}
                />
                <div className="flex items-center gap-2 mb-6">
                  <span className={`px-3 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${user.role === "admin"
                    ? "bg-red-500/10 text-red-500 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                    : user.role === "staff"
                      ? "bg-gold text-black shadow-[0_0_10px_rgba(170,128,24,0.4)]"
                      : "bg-gray-800 text-gray-300 border border-gray-700"
                    }`}>
                    {user.role === "admin" ? "Administrator" : user.role === "staff" ? "Staff Member" : "Gen.G Fan"}
                  </span>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-3 w-full mb-6">
                  <div className="rounded-xl bg-black/40 border border-gold/20 p-3 flex flex-col items-center">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Points</span>
                    <span className="font-heading text-xl text-gold">{user.points?.toLocaleString() ?? 0}</span>
                  </div>
                  <div className="rounded-xl bg-black/40 border border-gray-800 p-3 flex flex-col items-center">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total</span>
                    <span className="font-mono text-lg text-gray-300">{user.totalPoints?.toLocaleString() ?? 0}</span>
                  </div>
                </div>

                {/* Info List */}
                <div className="w-full space-y-3 text-sm text-gray-300 bg-black/20 rounded-xl p-4 border border-gray-800/50">
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 text-gray-500">
                      <Mail size={14} />
                      <span className="text-xs">Email</span>
                    </div>
                    <span className="text-xs font-medium truncate max-w-[180px]">{user.email}</span>
                  </div>

                  {user.username && (
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-3 text-gray-500">
                        <User size={14} />
                        <span className="text-xs">Username</span>
                      </div>
                      <span className="text-xs font-medium">{user.username}</span>
                    </div>
                  )}

                  {user.proof && (
                    <div className="flex items-start justify-between gap-4 group">
                      <div className="flex items-center gap-3 text-gray-500 mt-0.5">
                        <LinkIcon size={14} />
                        <span className="text-xs">Proof</span>
                      </div>
                      <span className="text-xs text-right text-gray-400 break-all line-clamp-2">{user.proof}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="w-full mt-6 space-y-3">
                  {isAdmin(user) && (
                    <a
                      href="/admin"
                      className="flex items-center justify-center gap-2 w-full rounded-lg bg-red-500/10 border border-red-500/50 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                      <Shield size={14} />
                      Admin Portal
                    </a>
                  )}

                  {isStaff(user) && (
                    <a
                      href="/staff"
                      className="flex items-center justify-center gap-2 w-full rounded-lg bg-gold/10 border border-gold/50 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-gold hover:bg-gold hover:text-black transition-all duration-300"
                    >
                      <LayoutDashboard size={14} />
                      Staff Dashboard
                    </a>
                  )}

                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 w-full rounded-lg border border-gray-800 bg-transparent px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                    >
                      <LogOut size={14} />
                      Đăng xuất
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tabbed Content */}
          <div>
            <ProfileTabs
              twoFactorEnabled={user.twoFactorEnabled}
              overviewContent={
                <div className="rounded-2xl border border-gray-800 bg-gray-900/30 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-gold/10">
                      <History size={20} className="text-gold" />
                    </div>
                    <div>
                      <h2 className="font-heading text-xl text-gray-100">Lịch sử hoạt động</h2>
                      <p className="text-xs text-gray-500">Theo dõi biến động điểm và thông báo</p>
                    </div>
                  </div>

                  <HistoryList history={history} />
                </div>
              }
              securityContent={
                <div className="rounded-2xl border border-gray-800 bg-gray-900/30 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <Shield size={20} className="text-red-500" />
                    </div>
                    <div>
                      <h2 className="font-heading text-xl text-gray-100">Bảo mật</h2>
                      <p className="text-xs text-gray-500">Quản lý mật khẩu và cài đặt bảo mật</p>
                    </div>
                  </div>

                  <ChangePasswordForm twoFactorEnabled={user.twoFactorEnabled} />
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
