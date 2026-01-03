// Full history including Samsung era
import achievementsData from "@/data/achievements.json";

export interface AchievementItem {
  title: string;
  titleVi?: string;
  type: "gold" | "silver" | "bronze" | "legendary" | "info";
  icon: string;
  major?: boolean;
  players?: string[];
  mvp?: string;
}

export interface AchievementYear {
  year: number;
  era: string;
  items: AchievementItem[];
}

export const achievements: AchievementYear[] = achievementsData as AchievementYear[];
