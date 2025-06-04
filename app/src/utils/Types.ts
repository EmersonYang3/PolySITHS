export type Timestamptz = string;

export interface UserData {
  user_id: string;
  awaiting_market_approval: boolean;
  balance: number;            // int8 from PostgreSQL
  profile_url: string;        // TEXT NOT NULL
  display_name: string;       // TEXT NOT NULL
  created_at: Timestamptz;    // timestamptz
}
