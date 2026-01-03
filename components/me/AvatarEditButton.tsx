"use client";

import { useState } from "react";
import { Edit2 } from "lucide-react";
import AvatarUpdateModal from "./AvatarUpdateModal";

interface AvatarEditButtonProps {
    currentAvatarUrl: string | null;
    displayName: string;
}

export default function AvatarEditButton({ currentAvatarUrl, displayName }: AvatarEditButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="absolute bottom-0 right-0 bg-gold hover:bg-gold-light text-black p-2 rounded-full shadow-lg shadow-gold/20 transition-all hover:scale-110 animate-pulse-gold z-20 group"
                aria-label="Edit avatar"
            >
                <Edit2 size={16} className="group-hover:rotate-12 transition-transform" />
            </button>

            <AvatarUpdateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentAvatarUrl={currentAvatarUrl}
                displayName={displayName}
            />
        </>
    );
}
