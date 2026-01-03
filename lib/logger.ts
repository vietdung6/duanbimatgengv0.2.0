import { prisma } from "@/lib/prisma";
import { SystemLogLevel, SystemLogType } from "@prisma/client";

/**
 * Core function to write a log to the database.
 * Wrapped in try-catch to ensure logging failure doesn't crash the app.
 */
export async function createLog(
    level: SystemLogLevel,
    type: SystemLogType,
    message: string,
    metadata?: any,
    userId?: number,
    ip?: string,
    path?: string
) {
    try {
        // Run in background (fire and forget) to not block request
        // But in Next.js serverless, we might need to await it to ensure execution.
        // Given low traffic, awaiting is safer.
        await prisma.systemLog.create({
            data: {
                level,
                type,
                message,
                metadata: metadata ?? null,
                user_id: userId ?? null,
                ip_address: ip ?? null,
                path: path ?? null,
            },
        });
    } catch (error) {
        // Fallback: log to console if DB fails
        console.error(`[LOGGER_FAILURE] Could not write log: ${message}`, error);
    }
}

// === Helper Functions ===

export async function logSecurity(message: string, metadata?: any, ip?: string, path?: string, userId?: number) {
    return createLog('CRITICAL', SystemLogType.SECURITY, message, metadata, userId, ip, path);
}

export async function logError(message: string, metadata?: any, path?: string, userId?: number) {
    return createLog('ERROR', SystemLogType.API_ERROR, message, metadata, userId, undefined, path);
}

export async function logSystem(message: string, metadata?: any) {
    return createLog('INFO', SystemLogType.SYSTEM, message, metadata);
}

export async function logStaffAction(message: string, userId: number, metadata?: any) {
    return createLog('INFO', SystemLogType.STAFF_ACTION, message, metadata, userId);
}
