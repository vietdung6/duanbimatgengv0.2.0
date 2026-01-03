"use client";

import { useState, useEffect } from "react";
import { FormSection } from "./FormSection";

interface GeneralInfoProps {
  value: any;
  onChange: (data: any) => void;
  onTournamentSelect?: (tournament: Tournament) => void;
}

interface TournamentType {
  id: number;
  name: string;
}

interface Tournament {
  id: number;
  name: string;
  type_id: number | null;
  type: TournamentType | null;
  opponent_group_id: number | null;
}

export function GeneralInfo({ value, onChange, onTournamentSelect }: GeneralInfoProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/staff/resources/tournaments")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTournaments(data);

          // If a tournament is already selected, set the type
          if (value.tournamentId) {
            const selected = data.find((t: Tournament) => t.id === Number(value.tournamentId));
            if (selected) {
              if (selected.type_id) {
                setSelectedTypeId(selected.type_id);
              }
              if (onTournamentSelect) {
                onTournamentSelect(selected);
              }
            }
          }
        }
      })
      .catch(err => console.error(err));
  }, []); // Run once on mount

  // Sync type AND NAME when value.tournamentId changes (e.g. from parent or external update)
  useEffect(() => {
    if (value.tournamentId && tournaments.length > 0) {
      const selected = tournaments.find(t => t.id === Number(value.tournamentId));
      if (selected) {
        if (selected.type_id && selected.type_id !== selectedTypeId) {
          setSelectedTypeId(selected.type_id);
        }
        // Auto-sync name if missing or mismatch allows for self-healing, 
        // but be careful not to override custom user edits if we allowed them. 
        // Since this is a strict select, syncing to the selected item's name is correct.
        if (value.tournament !== selected.name) {
          // Direct call to propagate name sync
          // Use function update style if possible to be safe, but here we just pass object
          onChange({ ...value, tournament: selected.name });
        }

        if (onTournamentSelect) {
          onTournamentSelect(selected);
        }
      }
    }
  }, [value.tournamentId, tournaments, selectedTypeId, value.tournament]);

  const handleChange = (field: string, val: string) => {
    onChange({ ...value, [field]: val });
  };

  // Extract unique types
  const types = Array.from(new Map(
    tournaments
      .filter(t => t.type)
      .map(t => [t.type!.id, t.type!])
  ).values());

  // Filter tournaments by selected type
  const filteredTournaments = selectedTypeId
    ? tournaments.filter(t => t.type_id === selectedTypeId)
    : tournaments;

  return (
    <FormSection title="Thông tin cơ bản" required>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ngày giờ thi đấu */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Ngày thi đấu</label>
          <input
            type="date"
            value={value.date || ""}
            onChange={(e) => handleChange("date", e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400">Giờ (KST)</label>
          <input
            type="time"
            value={value.time || "17:00"}
            onChange={(e) => handleChange("time", e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none"
          />
        </div>

        {/* Giải đấu Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Loại giải đấu</label>
            <select
              value={selectedTypeId || ""}
              onChange={(e) => {
                const newTypeId = Number(e.target.value) || null;
                setSelectedTypeId(newTypeId);
                onChange({ ...value, tournamentId: "", tournament: "" }); // Reset ID and Name
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none"
            >
              <option value="">-- Chọn loại giải đấu --</option>
              {types.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Giải đấu cụ thể</label>
            <select
              value={value.tournamentId || ""}
              onChange={(e) => {
                const id = e.target.value;
                const tournamentCallback = filteredTournaments.find(t => t.id === Number(id));
                const name = tournamentCallback ? tournamentCallback.name : "";
                onChange({ ...value, tournamentId: id, tournament: name });
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none"
            >
              <option value="">-- Chọn giải đấu --</option>
              {filteredTournaments.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Giai đoạn (Stage)</label>
            <input
              type="text"
              placeholder="VD: Regular Season"
              value={value.stage || ""}
              onChange={(e) => handleChange("stage", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Vòng đấu (Round)</label>
            <input
              type="text"
              placeholder="VD: Week 1"
              value={value.round_name || ""}
              onChange={(e) => handleChange("round_name", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400">Thể thức</label>
          <select
            value={value.matchType || "BO3"}
            onChange={(e) => handleChange("matchType", e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none"
          >
            <option value="BO1">BO1</option>
            <option value="BO3">BO3</option>
            <option value="BO5">BO5</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400">Patch (Optional)</label>
          <input
            type="text"
            placeholder="VD: 14.23"
            value={value.patch || ""}
            onChange={(e) => handleChange("patch", e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none"
          />
        </div>
      </div>
    </FormSection>
  );
}
