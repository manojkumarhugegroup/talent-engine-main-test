
export type CandidateSummaryTypes = {
    current_company: string;
    current_role: string;
    candidate_id: string;
    data_uniq_id: string;
    name: string;
    avatar: string;
    matchScore: number;
    projects: string;
    available_date: string;
    processing_stage: string;
    status: string;
    key_skills: { name: string; value: 0 | 1; type: 0 | 1 }[];
    keySkills: { name: string; value: 0 | 1; type: 0 | 1 }[];
    summary: string;
    experience: string;
    role: string;
    expected_rate: number;
    current_rate: number;
    location: string;
    certifications: string;
    rrcandidate_name: string;
    skills: string[];
}