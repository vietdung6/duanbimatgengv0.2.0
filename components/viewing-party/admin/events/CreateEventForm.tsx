"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { ViewingPartyEvent } from "@/lib/types/viewing-party";
import { createEvent } from "@/lib/actions/viewing-party-events";
import { useToast } from "@/components/ui/ToastContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface CreateEventFormProps {
  sessionId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateEventForm({ sessionId, onSuccess, onCancel }: CreateEventFormProps) {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<ViewingPartyEvent["type"]>("quiz");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(50);
  
  // Quiz specific
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);

  const handleAddOption = () => setOptions([...options, ""]);
  const handleRemoveOption = (idx: number) => setOptions(options.filter((_, i) => i !== idx));
  const handleOptionChange = (idx: number, val: string) => {
    const newOptions = [...options];
    newOptions[idx] = val;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createEvent(sessionId, {
        type,
        title,
        description,
        points,
        options: (type === "quiz" || type === "prediction") ? options.filter(o => o.trim()) : [],
        ...(type === "quiz" ? { correct_option_index: correctIndex } : {}),
      });

      if (result.success) {
        showToast(t.viewingParty.admin.eventManagement.createSuccess, "success");
        onSuccess();
      } else {
        showToast(result.message || t.viewingParty.admin.eventManagement.createError, "error");
      }
    } catch (error) {
      showToast(t.viewingParty.events.systemError, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-4 rounded-lg border border-white/10">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-gold">
          {t.viewingParty.admin.eventManagement.createEvent}
        </h3>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            {t.viewingParty.admin.eventManagement.eventType}
          </label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value as any)}
            className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm text-white focus:border-gold outline-none"
          >
            <option value="quiz">{t.viewingParty.events.quiz}</option>
            <option value="check_in">{t.viewingParty.events.checkIn}</option>
            <option value="prediction">{t.viewingParty.events.prediction}</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            {t.viewingParty.admin.eventManagement.points}
          </label>
          <input 
            type="number" 
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
            className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm text-white focus:border-gold outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">
          {t.viewingParty.admin.eventManagement.question}
        </label>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm text-white focus:border-gold outline-none"
          placeholder={t.viewingParty.admin.eventManagement.questionPlaceholder}
        />
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">
          {t.viewingParty.admin.eventManagement.description}
        </label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm text-white focus:border-gold outline-none h-20"
          placeholder={t.viewingParty.admin.eventManagement.detailsPlaceholder}
        />
      </div>

      {/* Options for Quiz and Prediction */}
      {(type === "quiz" || type === "prediction") && (
        <div className="space-y-2">
          <label className="block text-xs text-gray-400 mb-1">
            {t.viewingParty.admin.eventManagement.options}
          </label>
          {options.map((opt, idx) => (
            <div key={idx} className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  className={`w-full bg-black/50 border ${type === "quiz" && idx === correctIndex ? "border-green-500" : "border-white/10"} rounded p-2 text-sm text-white focus:border-gold outline-none pr-8`}
                  placeholder={t.viewingParty.admin.eventManagement.optionPlaceholder.replace('{index}', (idx + 1).toString())}
                />
                {type === "quiz" && (
                  <button
                    type="button"
                    onClick={() => setCorrectIndex(idx)}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border ${idx === correctIndex ? "bg-green-500 border-green-500" : "border-gray-500 hover:border-white"}`}
                    title={t.viewingParty.admin.eventManagement.correctOption}
                  >
                    {idx === correctIndex && <span className="block w-2 h-2 bg-white rounded-full mx-auto" />}
                  </button>
                )}
              </div>
              {options.length > 2 && (
                <button 
                  type="button" 
                  onClick={() => handleRemoveOption(idx)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            onClick={handleAddOption}
            className="flex items-center gap-1 text-xs text-gold hover:underline mt-1"
          >
            <Plus size={14} /> 
            {t.viewingParty.admin.eventManagement.addOption}
          </button>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-3 py-2 text-xs font-bold text-gray-400 hover:text-white"
        >
          {t.viewingParty.admin.eventManagement.cancel}
        </button>
        <button 
          type="submit" 
          disabled={isLoading}
          className="px-4 py-2 bg-gold hover:bg-white text-black text-xs font-bold rounded transition-colors disabled:opacity-50"
        >
          {isLoading ? t.viewingParty.admin.eventManagement.creating : t.viewingParty.admin.eventManagement.create}
        </button>
      </div>
    </form>
  );
}
