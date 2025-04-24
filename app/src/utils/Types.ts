export type Timestamptz = string;

export interface Review {
    Reviewer: string;
    Title: string;
    Review: string;
    Rating: number;
}

export interface Market {
    marketid: string;
    title: string; 
    creator: string;
    resolver: string; 
    options: { [Option: number]: string }; 
    shares: { [UserID: string]: { [Option: number]: number } }; 
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
