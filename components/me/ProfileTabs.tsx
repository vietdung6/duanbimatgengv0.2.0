"use client";

import { useState, ReactNode } from "react";
import { Shield, Activity } from "lucide-react";
import TwoFactorSettings from "./TwoFactorSettings";

interface Tab {
    id: string;
    label: string;
    icon: React.ElementType;
}

interface ProfileTabsProps {
    overviewContent: ReactNode;
    securityContent: ReactNode;
    twoFactorEnabled: boolean;
}

export default function ProfileTabs({
    overviewContent,
    securityContent,
    twoFactorEnabled
}: ProfileTabsProps) {
    const [activeTab, setActiveTab] = useState("overview");

    const tabs: Tab[] = [
        { id: "overview", label: "Tổng quan", icon: Activity },
        { id: "security", label: "Bảo mật", icon: Shield },
    ];

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-2 border-b border-gray-800">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all
                border-b-2 -mb-[2px]
                ${isActive
                                    ? "border-gold text-gold"
                                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
                                }
              `}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[500px]">
                {activeTab === "overview" ? (
                    overviewContent
                ) : (
                    <div className="space-y-4">
                        {securityContent}
                        <TwoFactorSettings initialEnabled={twoFactorEnabled} />
                    </div>
                )}
            </div>
        </div>
    );
}
