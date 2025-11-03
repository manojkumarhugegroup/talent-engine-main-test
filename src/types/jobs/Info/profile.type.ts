export interface Skill {
  skill: string;
  experienceMonths: number;
  reference: string;
}

export interface Certification {
  certificateName: string;
  issuingOrganization: string;
  id: string;
  issuedDate: string;
  expiration: string;
  url: string;
}

export interface KeySkill {
  name: string;
  type: "match" | "noMatch";
}

export interface Education {
  course: string;
  institute: string;
  graduationYear: number;
  specialization: string;
  score: string;
}
export interface ProfessionalDetails {
  title: string;
  Experience: string;
  summary: string;
}

export interface Project {
  title: string;
  description: string;
  customer: string;
  role: string;
  duration: string;
  technologies: string[];
}

export interface WorkExperience {
  jobTitle: string;
  title?: string;
  company: string;
  employmentType: string;
  salary: string;
  location: string;
  startDate: string;
  endDate: string;
  summary: string;
}

export interface ProfileDataType {
  name: string;
  experience: string;
  location: string;
  currentRate: string;
  expectedRate: string;
  summary: string;
  skills: Skill[];
  keySkills: KeySkill[];
  education: Education[];
  certifications: Certification[];
  professionalDetails: ProfessionalDetails;
  projects: Project[];
  workExperience: WorkExperience;
  achievements: string[];
  avatar?: string;
}
