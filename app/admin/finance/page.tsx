"use client";

import { useState, useEffect } from "react";
import { useRequireAdmin } from "@/lib/auth/useRequireAdmin";
import { useAuth } from "@/lib/auth/AuthContext";
import {
    TrendingUp,
    Plus,
    Trash2,
    Save,
    Loader2,
    Calendar,
    FileText,
    DollarSign,
    ArrowLeft
} from "lucide-react";
import Link from "next/link";
import Loading from "@/components/ui/Loading";

type Transaction = {
    id: number;
    date: string;
    type: string;
    amount: number;
    description: string;
    proof: string | null;
    created_at: string;
};

export default function AdminFinancePage() {
    const ready = useRequireAdmin();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [monthlyGoal, setMonthlyGoal] = useState(200000);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [newTrans, setNewTrans] = useState({
        date: new Date().toISOString().split('T')[0],
        type: "donation",
        amount: 0,
        description: "",
        proof: ""
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/finance');
            if (res.ok) {
                const data = await res.json();
                setMonthlyGoal(data.monthlyGoal);
                setTransactions(data.transactions);
            }
        } catch (error) {
            console.error("Failed to fetch finance data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (ready) {
            fetchData();
        }
    }, [ready]);

    const handleUpdateGoal = async () => {
        try {
            setIsSubmitting(true);
            const res = await fetch('/api/finance', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ monthlyGoal })
            });
            if (res.ok) {
                alert("Đã cập nhật mục tiêu tháng!");
            }
        } catch (error) {
            alert("Lỗi cập nhật!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            // Adjust amount for expense (negative)
            const finalAmount = newTrans.type === 'expense' ? -Math.abs(newTrans.amount) : Math.abs(newTrans.amount);

            const res = await fetch('/api/finance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newTrans, amount: finalAmount })
            });

            if (res.ok) {
                setNewTrans({
                    date: new Date().toISOString().split('T')[0],
                    type: "donation",
                    amount: 0,
                    description: "",
                    proof: ""
                });
                fetchData(); // Refresh list
            }
        } catch (error) {
            alert("Lỗi thêm giao dịch!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa dòng này không?")) return;
        try {
            const res = await fetch(`/api/finance/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setTransactions(prev => prev.filter(t => t.id !== id));
            }
        } catch (error) {
            alert("Lỗi xóa!");
        }
    };

    if (!ready) return <Loading />;

    return (
        <div className="min-h-screen bg-black text-white font-body p-8">
            <Link href="/admin" className="inline-flex items-center gap-2 text-gray-400 hover:text-gold mb-8 transition-colors">
                <ArrowLeft size={18} />
                Quay lại Admin Dashboard
            </Link>

            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="font-heading text-4xl text-gradient-gold">Quản Lý Donate & Tài Chính</h1>

                {/* Goal Setting */}
                <div className="card-dark bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="text-gold" size={24} />
                        Mục Tiêu Tháng (VND)
                    </h2>
                    <div className="flex gap-4">
                        <input
                            type="number"
                            value={monthlyGoal}
                            onChange={(e) => setMonthlyGoal(parseInt(e.target.value) || 0)}
                            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none font-mono text-lg"
                        />
                        <button
                            onClick={handleUpdateGoal}
                            disabled={isSubmitting}
                            className="bg-gold text-black font-bold px-6 py-3 rounded-xl hover:bg-gold-light transition-colors flex items-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                            Lưu
                        </button>
                    </div>
                </div>

                {/* Add Transaction */}
                <div className="card-dark bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Plus className="text-green-500" size={24} />
                        Thêm Giao Dịch Mới
                    </h2>
                    <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Ngày</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    type="date"
                                    required
                                    value={newTrans.date}
                                    onChange={e => setNewTrans({ ...newTrans, date: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-gold/50 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Loại</label>
                            <select
                                value={newTrans.type}
                                onChange={e => setNewTrans({ ...newTrans, type: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none appearance-none"
                            >
                                <option value="donation">Nhận Donate (+)</option>
                                <option value="expense">Chi Tiêu (-)</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Số Tiền (VND)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    type="number"
                                    required
                                    placeholder="0"
                                    value={newTrans.amount}
                                    onChange={e => setNewTrans({ ...newTrans, amount: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-gold/50 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Minh Chứng (Link Ảnh - Tùy chọn)</label>
                            <input
                                type="text"
                                placeholder="https://imgur.com/..."
                                value={newTrans.proof}
                                onChange={e => setNewTrans({ ...newTrans, proof: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Nội Dung / Mô Tả</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    type="text"
                                    required
                                    placeholder="Ví dụ: Ủng hộ từ bạn A, Gia hạn domain..."
                                    value={newTrans.description}
                                    onChange={e => setNewTrans({ ...newTrans, description: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-gold/50 outline-none"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-white/10 hover:bg-gold hover:text-black text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
                                Thêm Giao Dịch
                            </button>
                        </div>
                    </form>
                </div>

                {/* Transaction History */}
                <div className="card-dark bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-xl font-bold text-white">Lịch Sử Giao Dịch</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Ngày</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Loại</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Nội Dung</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Số Tiền</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">Đang tải...</td></tr>
                                ) : transactions.length === 0 ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">Chưa có giao dịch nào.</td></tr>
                                ) : transactions.map(t => (
                                    <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-gray-400 font-mono text-sm">
                                            {new Date(t.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${t.type === 'donation' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                                                }`}>
                                                {t.type === 'donation' ? 'Donate' : 'Chi Tiêu'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-white text-sm">{t.description}</td>
                                        <td className={`p-4 text-right font-mono font-bold ${t.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(t.amount)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleDelete(t.id)}
                                                className="text-gray-500 hover:text-red-500 transition-colors"
                                                title="Xóa"
                                            >
                                                <Trash2 size={16} />
                                            </button>
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
