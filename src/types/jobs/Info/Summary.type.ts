export type CountType = {
    all: number;
    received: number;
    shortlisted: number;
    interview: number;
    selected: number;
    onboarded: number;
    rejected: number;
};


export type StatKey = keyof CountType;

export interface CandidateStat {
    label: string;
    key: StatKey;
    color: string;
    bgColor: string;
    icon?: string;
}
