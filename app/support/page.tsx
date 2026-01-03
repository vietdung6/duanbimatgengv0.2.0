"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Copy, Check, CreditCard, Coffee, Server, ExternalLink, TrendingUp, Receipt } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function SupportPage() {
    const { t } = useLanguage();
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const [monthlyGoal, setMonthlyGoal] = useState(200000);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [amountRaised, setAmountRaised] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/finance');
                if (res.ok) {
                    const data = await res.json();
                    setMonthlyGoal(data.monthlyGoal);
                    setTransactions(data.transactions);

                    // Calculate Total Raised (Sum of all donations)
                    const totalRaised = data.transactions
                        .filter((t: any) => t.type === 'donation')
                        .reduce((sum: number, t: any) => sum + t.amount, 0);
                    setAmountRaised(totalRaised);
                }
            } catch (error) {
                console.error("Failed to fetch finance data", error);
            }
        };
        fetchData();
    }, []);

    // Progress Calculation
    const progressPercent = Math.min((amountRaised / monthlyGoal) * 100, 100);

    type Transaction = {
        date: string;
        type: 'donation' | 'expense';
        description: string;
        amount: number;
        proof: string;
    };

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen pt-24 pb-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* ... existing header code ... */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-2xl mx-auto mb-12"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-gold/10 rounded-full mb-12 ring-1 ring-gold/30">
                        <Coffee className="w-8 h-8 text-gold" />
                    </div>
                    <h1 className="font-heading text-4xl md:text-5xl text-gold mb-4 drop-shadow-lg filter">
                        {t.support.title}
                    </h1>
                    <p className="text-xl text-white font-medium mb-4">
                        {t.support.subtitle}
                    </p>
                    <p className="text-gray-400 leading-relaxed max-w-md mx-auto">
                        {t.support.description}
                    </p>
                </motion.div>

                {/* PROGRESS BAR SECTION */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card-dark max-w-3xl mx-auto mb-16 border border-gold/20 p-8"
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-heading text-gold text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            {t.support.progress.title}
                        </h3>
                        <span className="text-gray-400 text-sm font-mono">{formatCurrency(amountRaised)} / {formatCurrency(monthlyGoal)}</span>
                    </div>

                    {/* Bar */}
                    <div className="h-6 bg-black/50 rounded-full overflow-hidden border border-white/5 relative">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-gold/60 to-gold relative"
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                        {/* Percentage Text */}
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
                            {progressPercent.toFixed(1)}%
                        </div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>{t.support.progress.current}: {formatCurrency(amountRaised)}</span>
                        <span>{t.support.progress.goal}: {formatCurrency(monthlyGoal)}</span>
                    </div>
                </motion.div>

                {/* DONATION METHODS */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
                    {/* ... (Donation methods content unchanged, skipping for brevity in replacement but need to be careful with context) ... */}
                    {/* Actually, the file content is large. I should target specific blocks instead of rewriting the whole middle section. */}
                    {/* I will split this into smaller edits. 1. Helper function. 2. Type. 3. Table usage. */}
                </div>
                {/* DONATION METHODS */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
                    {/* Momo Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card-dark border border-pink-500/20 hover:border-pink-500/50 transition-colors group"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                                <CreditCard className="w-6 h-6 text-pink-500" />
                            </div>
                            <div>
                                <h3 className="font-heading text-xl text-white">{t.support.methods.momo.title}</h3>
                                <p className="text-sm text-gray-400">Scan QR or Transfer</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                                <p className="text-xs text-gray-500 mb-1">Account Name</p>
                                <p className="font-mono text-white tracking-wide">{t.support.methods.momo.accountName}</p>
                            </div>

                            <div className="bg-black/40 p-4 rounded-lg border border-white/5 flex items-center justify-between group/field">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                                    <p className="font-mono text-pink-400 text-lg tracking-wider">{t.support.methods.momo.number}</p>
                                </div>
                                <button
                                    onClick={() => handleCopy(t.support.methods.momo.number, 'momo')}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                                    title={t.support.copy}
                                >
                                    {copiedField === 'momo' ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Transfer Syntax Note */}
                            <div className="bg-pink-500/10 p-3 rounded-lg border border-pink-500/20 text-center space-y-1">
                                <p className="text-xs text-pink-400 font-medium">
                                    {t.support.methods.momo.syntax}
                                </p>
                                <p className="text-[10px] text-gray-400 italic">
                                    ({t.support.syntaxHelper})
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Bank Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card-dark border border-green-600/20 hover:border-green-600/50 transition-colors group"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-green-600/10 rounded-xl flex items-center justify-center group-hover:bg-green-600/20 transition-colors">
                                <Server className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-heading text-xl text-white">{t.support.methods.bank.title}</h3>
                                <p className="text-sm text-gray-400">Direct Bank Transfer</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-black/40 p-4 rounded-lg border border-white/5 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Bank</p>
                                    <p className="font-bold text-green-500">{t.support.methods.bank.bankName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Account Name</p>
                                    <p className="font-mono text-white text-sm truncate">{t.support.methods.bank.accountName}</p>
                                </div>
                            </div>

                            <div className="bg-black/40 p-4 rounded-lg border border-white/5 flex items-center justify-between group/field">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Account Number</p>
                                    <p className="font-mono text-green-500 text-lg tracking-wider">{t.support.methods.bank.accountNumber}</p>
                                </div>
                                <button
                                    onClick={() => handleCopy(t.support.methods.bank.accountNumber, 'bank')}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                                    title={t.support.copy}
                                >
                                    {copiedField === 'bank' ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Transfer Syntax Note */}
                            <div className="bg-green-900/10 p-3 rounded-lg border border-green-600/20 text-center space-y-1">
                                <p className="text-xs text-green-500 font-medium">
                                    {t.support.methods.bank.syntax}
                                </p>
                                <p className="text-[10px] text-gray-400 italic">
                                    ({t.support.syntaxHelper})
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* TRANSPARENCY LOG */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="font-heading text-2xl text-gold mb-6 text-center flex items-center justify-center gap-2">
                        <Receipt className="w-6 h-6" />
                        {t.support.transparency.title}
                    </h2>

                    <div className="card-dark overflow-hidden border border-white/5 p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-black/40 text-gold uppercase text-xs font-bold border-b border-white/10">
                                    <tr>
                                        <th className="p-4">{t.support.transparency.table.date}</th>
                                        <th className="p-4">{t.support.transparency.table.type}</th>
                                        <th className="p-4">{t.support.transparency.table.desc}</th>
                                        <th className="p-4 text-right">{t.support.transparency.table.amount}</th>
                                        <th className="p-4 text-center">{t.support.transparency.table.proof}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {transactions.length > 0 ? (
                                        transactions.map((tx, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4 text-gray-400 whitespace-nowrap">{formatDate(tx.date)}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase
                                                ${tx.type === 'donation' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                                            `}>
                                                        {tx.type === 'donation' ? t.support.transparency.types.donation : t.support.transparency.types.expense}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-white font-medium">{tx.description}</td>
                                                <td className={`p-4 text-right font-mono ${tx.type === 'donation' ? 'text-green-400' : 'text-red-400'}`}>
                                                    {tx.type === 'donation' ? '+' : ''}{formatCurrency(tx.amount)}
                                                </td>
                                                <td className="p-4 text-center">
                                                    {tx.proof ? (
                                                        <a href={tx.proof} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 inline-block p-1">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-600">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                                                Chưa có dữ liệu giao dịch tháng này.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-12 max-w-xl mx-auto"
                >
                    <p className="text-sm text-gold/60 italic border-t border-gold/10 pt-6">
                        {t.support.note}
                    </p>
                </motion.div>
            </div >
        </div >
    );
}
