"use client";

import { useMemo } from "react";
import { FormSection } from "../shared/FormSection";
import { HomeTeamIdentity, getIdentityLogo } from "@/lib/utils/teamIdentity";

interface IdentitySectionProps {
  identity: string;
  options?: string[];
  onIdentityChange: (identity: string) => void;
}

export function IdentitySection({ identity, options, onIdentityChange }: IdentitySectionProps) {
  
  const displayInfo = useMemo(() => {
    const logo = getIdentityLogo(identity);
    switch (identity) {
      case "Samsung Ozone":
        return { era: "2013 - 2014", logo };
      case "Samsung White":
        return { era: "2014", logo };
      case "Samsung Blue":
        return { era: "2014", logo };
      case "Samsung Galaxy":
        return { era: "2014 - 2017", logo };
      case "KSV":
        return { era: "Early 2018", logo };
      case "Gen.G":
      case "Gen.G Esports":
        return { era: "2018 - Present", logo };
      default:
        return { era: "Unknown", logo };
    }
  }, [identity]);

  return (
    <FormSection title="Danh tính Đội nhà" className="h-full">
      <div className="flex flex-col items-center justify-center h-full min-h-[120px] bg-black/20 rounded border border-dashed border-gray-700 p-4">
        {/* Logo Placeholder */}
        <div className="w-16 h-16 bg-gray-800 rounded-full mb-3 flex items-center justify-center text-xs text-gray-500 overflow-hidden">
           {/* In real app, use next/image with actual paths */}
           <img src={displayInfo.logo} alt={identity} className="w-full h-full object-contain p-2" />
        </div>
        
        <div className="text-xl font-bold text-gold text-center">
          {identity}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {displayInfo.era}
        </div>
        
        {options && options.length > 1 ? (
          <div className="mt-3 flex flex-col items-center gap-2 w-full">
             <div className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                Cần chọn thủ công
             </div>
             <div className="flex gap-2">
               {options.map(opt => (
                 <button
                   key={opt}
                   type="button"
                   onClick={() => onIdentityChange(opt)}
                   className={`px-3 py-1 text-xs rounded border transition-colors ${
                     identity === opt 
                       ? "bg-gold text-black border-gold font-bold" 
                       : "bg-transparent text-gray-400 border-gray-600 hover:border-gray-400"
                   }`}
                 >
                   {opt.replace("Samsung ", "")}
                 </button>
               ))}
             </div>
          </div>
        ) : (
          <div className="mt-2 text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
            Tự động xác định theo ngày thi đấu
          </div>
        )}
      </div>
    </FormSection>
  );
}
