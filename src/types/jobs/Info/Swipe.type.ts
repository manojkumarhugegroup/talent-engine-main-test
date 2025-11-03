export interface SwipeCandidateType {
    id: number;
    name: string;
    data_uniq_id?: string;  
    rrcandidate_name: string;
    current_role?: string;     
    candidate_id: string;   
    avatar: string;
    role: string;
    experience: string;
    location: string;
    current_rate?: number;     
    expected_rate?: number;   
    currentRateBillingFrequency?: string;
    expectedRateBillingFrequency?: string;
    currentRateCurrency?: string;
    expectedRateCurrency?: string;
    expectedRateBillingCurrency?: string; 
    currentRate?: number;     
    expectedRate?: number;    
    available_date: string;
    match_score?: number;      // Assuming this is the same as match_percentage
    key_skills: { name: string; value: 0 | 1; type: 0 | 1 }[];
    summary: string;
    // match_score: number;          // Remove if not used
    skills: { name: string}[];
    certifications: { name: string}[];
    projects: { name: string}[];
    work_experience?: string[];    // Not in data, optional
    salary_currency?: string;       // Missing in data, optional
    expected_salary: number;
    salary: number;
    match_percentage: number;
    currentRateBillingCurrency: string;
}
