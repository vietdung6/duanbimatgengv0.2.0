"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/ToastContext";

interface SquadPreset {
  id: number;
  name: string;
  top: string | null;
  jungle: string | null;
  mid: string | null;
  ad: string | null;
  support: string | null;
  coach: string | null;
  sub: string | null;
}

interface SquadSelectorProps {
  onChange?: (data: any) => void;
  initialData?: any;
}

export function SquadSelector({ onChange, initialData }: SquadSelectorProps) {
  const { showToast } = useToast();
  const [presets, setPresets] = useState<SquadPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");

  const [squad, setSquad] = useState({
    top: "",
    jungle: "",
    mid: "",
    ad: "",
    support: "",
    coach: "",
    sub: ""
  });

  useEffect(() => {
    fetchPresets();
  }, []);

  useEffect(() => {
    if (initialData) {
      setSquad(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const fetchPresets = async () => {
    try {
      const res = await fetch("/api/staff/resources/squads");
      const data = await res.json();
      if (res.ok) {
        setPresets(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch squad presets");
    } finally {
      setLoading(false);
    }
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedPresetId(id);
    
    if (id) {
      const preset = presets.find(p => p.id.toString() === id);
      if (preset) {
        const newSquad = {
          top: preset.top || "",
          jungle: preset.jungle || "",
          mid: preset.mid || "",
          ad: preset.ad || "",
          support: preset.support || "",
          coach: preset.coach || "",
          sub: preset.sub || ""
        };
        setSquad(newSquad);
        onChange?.(newSquad);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const newSquad = { ...squad, [field]: value };
    setSquad(newSquad);
    onChange?.(newSquad);
  };

  return (
    <div className="space-y-4">
      {/* Preset Selector */}
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm text-gray-400">Chọn đội hình mẫu (Preset):</label>
        <select 
          value={selectedPresetId}
          onChange={handlePresetChange}
          className="flex-1 bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none"
        >
          <option value="">-- Tùy chỉnh (Nhập tay) --</option>
          {presets.map(preset => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
        <button type="button" className="text-xs text-gold hover:underline">
          Quản lý Preset
        </button>
      </div>

      {/* Lineup Inputs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { key: 'top', label: 'Top' },
          { key: 'jungle', label: 'Jungle' },
          { key: 'mid', label: 'Mid' },
          { key: 'ad', label: 'AD' },
          { key: 'support', label: 'Support' }
        ].map((role) => (
          <div key={role.key} className="space-y-1">
            <label className="text-xs text-gray-500 uppercase">{role.label}</label>
            <input 
              type="text" 
              value={squad[role.key as keyof typeof squad]}
              onChange={(e) => handleInputChange(role.key, e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none"
            />
          </div>
        ))}
      </div>
      
      {/* Sub/Coach */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="space-y-1">
          <label className="text-xs text-gray-500 uppercase">Coach</label>
          <input 
            type="text" 
            value={squad.coach}
            onChange={(e) => handleInputChange('coach', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-500 uppercase">Sub</label>
          <input 
            type="text" 
            value={squad.sub}
            onChange={(e) => handleInputChange('sub', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none"
          />
        </div>
      </div>
    </div>
  );
}
