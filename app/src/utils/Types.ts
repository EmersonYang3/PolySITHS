export type Timestamptz = string;
export type OptionKey = 'Option1' | 'Option2';

export interface Review {
    Reviewer: string;
    Title: string;
    Review: string;
    Rating: number;
}

export interface Market {
    marketid: string;
    title: string;
    question: string;
    creator: string;
    resolver: string;
    options: Record<OptionKey, string>;
    shares: Record<OptionKey, Array<{
        UserId: string;
        BoughtValue: number;
    }>>;
    history: { [TimeStamp: Timestamptz]: { [Option: number]: number } };
    projected_end: Timestamptz;
    created_at: Timestamptz;
}

export interface Prediction {
    predictionid: string; 
    predictor: string; 
    marketid: string; 
    option: number;
    wager: number; 
    win: number | null;
    created_at: Timestamptz;
}

export interface UserData {
    userid: string;
    biggest_win: string | null;
    biggest_prediction: string | null;
    biggest_loss: string | null;
    awaiting_market_approval: boolean;
    balance: number;
    created_at: Timestamptz;
}