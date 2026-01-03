import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyAuthToken, isStaff } from "@/lib/auth";
import { getViewingSessionById } from "@/lib/models/ViewingSession";
import { getMessagesBySessionId } from "@/lib/models/ChatMessage";
import { isUserBanned } from "@/lib/models/ViewingPartyBan";
import ViewingPartyContainer from "@/components/viewing-party/ViewingPartyContainer";
import { ViewingPartyProvider } from "@/components/viewing-party/ViewingPartyContext";
import { UserRole } from "@/lib/types/viewing-party";
import { deobfuscateId } from "@/lib/viewing-party/obfuscation";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("geng_auth")?.value;
  if (!token) return null;
  return verifyAuthToken(token);
}

export default async function ViewingPartyRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessionId = deobfuscateId(id);

  if (isNaN(sessionId)) {
    notFound();
  }

  const [session, messages, user] = await Promise.all([
    getViewingSessionById(sessionId),
    getMessagesBySessionId(sessionId, 50),
    getUser(),
  ]);

  let events: any[] = [];
  if (session) {
    const { getEventsBySessionId } = await import("@/lib/actions/viewing-party-events");
    events = await getEventsBySessionId(sessionId);
  }

  if (!session) {
    notFound();
  }

  // Check if user has already checked in for this session
  let hasCheckedIn = false;
  let isBanned = false;
  if (user) {
    const { getUserHistory } = await import("@/lib/history/historyService");
    const [history, banned] = await Promise.all([
      getUserHistory(user.id),
      isUserBanned(sessionId, user.id)
    ]);
    hasCheckedIn = history.some(h => h.title === `Check-in VP #${sessionId}`);
    isBanned = banned;
  }

  const isStaffUser = isStaff(user);

  return (
    <ViewingPartyProvider
      sessionId={sessionId}
      initialChatEnabled={session.is_chat_enabled ?? true}
      initialSlowModeDuration={session.slow_mode_duration ?? 0}
      currentUser={user ? { ...user, role: user.role as UserRole } : null}
      initialCheckInStatus={hasCheckedIn}
      initialIsBanned={isBanned}
    >
      <ViewingPartyContainer
        session={session}
        messages={messages}
        user={user}
        isStaff={isStaffUser}
        sessionId={sessionId}
        initialEvents={events}
      />
    </ViewingPartyProvider>
  );
}
