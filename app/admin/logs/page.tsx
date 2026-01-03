import { prisma } from "@/lib/prisma";
import { getAuthTokenCookies, verifyAuthToken, isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLogsPage() {
    // 1. Security Check
    const token = await getAuthTokenCookies();
    const user = token ? verifyAuthToken(token) : null;

    if (!user || !isAdmin(user)) {
        redirect("/portal-login");
    }

    // 2. Fetch Logs
    const logs = await prisma.systemLog.findMany({
        orderBy: { created_at: "desc" },
        take: 100, // Limit to last 100 logs
        include: {
            user: {
                select: { username: true, email: true }
            }
        }
    });

    // Helper for badges
    const getLevelColor = (level: string) => {
        switch (level) {
            case "CRITICAL": return "bg-red-600 text-white animate-pulse";
            case "ERROR": return "bg-red-500 text-white";
            case "WARN": return "bg-yellow-500 text-black";
            default: return "bg-blue-500 text-white";
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gold">Nhật Ký Lỗi & Bảo Mật</h1>
                        <p className="text-gray-400">Theo dõi hoạt động hệ thống và các mối đe dọa.</p>
                    </div>
                    <div className="flex gap-4">
                        <form action={async () => { "use server"; await prisma.systemLog.deleteMany({}); }} >
                            <button className="px-4 py-2 bg-red-900/50 hover:bg-red-800 border border-red-700 rounded text-red-200 text-sm transition-colors">
                                Xóa Hết Log
                            </button>
                        </form>
                        <Link href="/admin/dashboard" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-gray-300 text-sm transition-colors">
                            Quay lại Dashboard
                        </Link>
                    </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                                    <th className="p-4 border-b border-gray-700">Thời Gian</th>
                                    <th className="p-4 border-b border-gray-700">Mức Độ</th>
                                    <th className="p-4 border-b border-gray-700">Loại</th>
                                    <th className="p-4 border-b border-gray-700 w-1/3">Nội Dung</th>
                                    <th className="p-4 border-b border-gray-700">User / IP</th>
                                    <th className="p-4 border-b border-gray-700">Path</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500 italic">
                                            Chưa có dữ liệu nhật ký nào.
                                        </td>
                                    </tr>
                                ) : logs.map((log: any) => (
                                    <tr key={log.id} className="hover:bg-gray-700/30 transition-colors">
                                        <td className="p-4 text-sm text-gray-400 whitespace-nowrap">
                                            {new Date(log.created_at).toLocaleString("vi-VN")}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                                                {log.level}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs font-mono text-gray-300 bg-gray-900 px-2 py-1 rounded">
                                                {log.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-gray-200">{log.message}</p>
                                            {log.metadata && (
                                                <details className="mt-1">
                                                    <summary className="text-xs text-blue-400 cursor-pointer hover:underline">Chi tiết JSON</summary>
                                                    <pre className="text-[10px] bg-black p-2 rounded mt-1 overflow-x-auto text-green-500 font-mono">
                                                        {JSON.stringify(log.metadata, null, 2)}
                                                    </pre>
                                                </details>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm">
                                            {log.user ? (
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gold">{log.user.username}</span>
                                                    <span className="text-xs text-gray-500">{log.user.email}</span>
                                                </div>
                                            ) : (
                                                <span className="font-mono text-xs text-gray-400">{log.ip_address || "N/A"}</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs text-gray-500 font-mono break-all">{log.path || "-"}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
