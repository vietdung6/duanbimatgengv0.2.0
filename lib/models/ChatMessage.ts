import { prisma } from "@/lib/prisma";
import { IChatMessage, UserRole } from "../types/viewing-party";
import type { ChatMessage, ChatMessageType, User } from "@prisma/client";

// Helper type for the included user
type MessageWithUser = ChatMessage & {
  user: User | null;
};

export async function createChatMessage(
  sessionId: number,
  userId: number | null,
  content: string,
  type: "user" | "system" = "user"
): Promise<IChatMessage> {
  const message = await prisma.chatMessage.create({
    data: {
      session_id: sessionId,
      user_id: userId,
      content,
      type: type as ChatMessageType,
    },
    include: {
      user: true,
    },
  });

  return mapPrismaToMessage(message);
}

export async function getChatMessageById(id: number): Promise<IChatMessage | null> {
  const message = await prisma.chatMessage.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  if (!message) return null;
  return mapPrismaToMessage(message);
}

export async function getMessagesBySessionId(
  sessionId: number,
  limit: number = 50
): Promise<IChatMessage[]> {
  const messages = await prisma.chatMessage.findMany({
    where: { session_id: sessionId },
    include: {
      user: true,
    },
    orderBy: { created_at: "asc" },
    take: limit,
  });

  return messages.map(mapPrismaToMessage);
}

function mapPrismaToMessage(row: MessageWithUser): IChatMessage {
  const message: IChatMessage = {
    id: row.id,
    session_id: row.session_id,
    user_id: row.user_id,
    content: row.content,
    type: (row.type as "user" | "system") ?? "user",
    created_at: row.created_at ?? new Date(),
  };

  if (row.user) {
    message.user = {
      username: row.user.username ?? "",
      display_name: row.user.display_name ?? "",
      avatar_url: row.user.avatar_url,
      role: (row.user.role as UserRole) ?? "fan",
    };
  }

  return message;
}

