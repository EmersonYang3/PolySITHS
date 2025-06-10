export type Timestamptz = string;

export interface UserData {
  user_id:                  string;   
  balance:                  number;          
  profile_url:              string;      
  display_name:             string;  
  awaiting_market_approval: boolean;    
  created_at:               Timestamptz;   
}

export interface UserBalanceHistory {
  history_id: string;
  user_id:    string;   
  balance:    number;
  created_at: Timestamptz;    
}

export interface Market {
  market_id:   string;
  title:       string;
  creator_id:  string;
  resolver_id: string;
  question:    string;
  end_time:    Timestamptz;
  created_at:  Timestamptz
}

export interface MarketOptionVolumeHistory {
  market_history_id: string;
  market_id: string;
  option_id: string;
  total_volume: number;
  created_at: Timestamptz
}


export interface Option {
  option_id:  string;     
  market_id:  string;      
  text:       string;          
  created_at: Timestamptz;
}

export interface Prediction {
  prediction_id: string;       
  predictor_id:  string;        
  option_id:     string;       
  wager:         number;       
  win:           number | null;  
  created_at:    Timestamptz;  
}

export interface OptionStats {
  id: string
  name: string
  percentage: number
  shares: number
  volume: number
}

export interface MarketWithStats {
  market_id: string
  title: string
  question: string
  creator_id: string
  resolver_id: string
  end_time: string
  total_volume: number
  total_shares: number
  options: OptionStats[]
  created_at: Timestamptz
}