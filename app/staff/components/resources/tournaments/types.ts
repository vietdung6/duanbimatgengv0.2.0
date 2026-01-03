export interface OpponentGroup {
  id: number;
  name: string;
}

export interface TournamentType {
  id: number;
  name: string;
  logo: string | null;
  category: "MAJOR" | "FRIENDLY";
  description: string | null;
}

export interface TournamentResource {
  id: number;
  name: string;
  year: number;
  type_id: number | null;
  is_official: boolean;
  is_current: boolean;
  opponent_group_id?: number | null;
  opponent_group?: OpponentGroup;
}
