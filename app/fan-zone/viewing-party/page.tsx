import Link from "next/link";
import { getActiveSessions } from "@/lib/models/ViewingSession";
import { Calendar, Clock } from "lucide-react";
import { obfuscateId } from "@/lib/viewing-party/obfuscation";

export const dynamic = "force-dynamic";

export default async function ViewingPartyListPage() {
  const sessions = await getActiveSessions();

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gold mb-4 uppercase tracking-wider">
            Viewing Party
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Tham gia xem chung các trận đấu của Gen.G cùng cộng đồng fan hâm mộ.
            Cổ vũ, bình luận và nhận quà!
          </p>
        </header>

        {sessions.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded-2xl bg-[#111]">
            <div className="text-6xl mb-6">📺</div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">
              Hiện chưa có buổi xem chung nào
            </h3>
            <p className="text-gray-500">
              Hãy quay lại sau hoặc theo dõi thông báo trên Fanpage nhé!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessions.map((session) => {
              const CardContent = (
                <>
                  {/* Thumbnail Placeholder */}
                  <div className="aspect-video bg-black relative flex items-center justify-center border-b border-white/10 group-hover:bg-[#1a1a1a] transition-colors">
                    <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      🐯
                    </span>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                      {session.status === "live" ? (
                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-white" />
                          LIVE
                        </span>
                      ) : (
                        <span className="bg-gold text-black text-xs font-bold px-3 py-1 rounded-full">
                          SCHEDULED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors mb-2 line-clamp-2">
                      {session.title}
                    </h3>

                    <div className="flex flex-col gap-2 text-sm text-gray-400">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>
                            {new Date(session.start_time).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} />
                          <span>
                            {new Date(session.start_time).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );

              return (
                <Link
                  href={`/fan-zone/viewing-party/${obfuscateId(session.id)}`}
                  key={session.id}
                  className="group relative block bg-[#111] border border-white/10 rounded-xl overflow-hidden transition-all hover:border-gold/50 hover:shadow-[0_0_20px_rgba(170,128,44,0.2)]"
                >
                  {CardContent}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
