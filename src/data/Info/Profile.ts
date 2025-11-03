import { ProfileDataType } from "@/types/jobs/Info/profile.type";

export const ProfileData: ProfileDataType = {
    skills: [
        {
            skill: "Inventory Control",
            experienceMonths: 18,
            reference: "https://example.com/report1"
        },
        {
            skill: "Route Optimization",
            experienceMonths: 15,
            reference: "https://example.com/report2"
        },
        {
            skill: "Safety Regulations",
            experienceMonths: 24,
            reference: "https://example.com/certificate"
        }
    ],
    education: [{
        course: "B.Tech in Industrial Engineering",
        institute: "Zenith University",
        graduationYear: 2017,
        specialization: "Operations Management",
        score: "3.8 GPA"
    }],
    certifications: [
        {
            certificateName: "Supply Chain Specialist",
            issuingOrganization: "Global Logistics Council",
            id: "SCS-90876",
            issuedDate: "Mar 2021",
            expiration: "Mar 2026",
            url: "https://example.com/verify1"
        },
        {
            certificateName: "Workplace Safety",
            issuingOrganization: "National Safety Board",
            id: "WPS-44110",
            issuedDate: "Jun 2020",
            expiration: "Jun 2025",
            url: "https://example.com/verify2"
        }
    ],
    name: "John Doe",
    experience: "12+ yrs",
    location: "Houston, South, US",
    currentRate: "$8,000/month",
    expectedRate: "$9,500/month",
    summary:
        "Experienced operations leader specializing in fuel logistics and supply chain efficiency. Reduced delivery lead times by 22% and led IoT fuel monitoring implementation.",
    keySkills: [
        { name: "Fuel Logistics", type: "match" },
        { name: "Supply Chain", type: "match" },
        { name: "Fleet Management", type: "match" },
        { name: "Fuel Monitoring", type: "match" },
        { name: "Route Optimization", type: "match" },
        { name: "Inventory Control", type: "match" },
        { name: "Logistics Coordination", type: "match" },
        { name: "ERP Systems", type: "match" },
        { name: "Compliance Management", type: "match" },
        { name: "Distribution Planning", type: "noMatch" }
    ],
    professionalDetails: {
        title: "Senior Operations Manager",
        Experience: "12 years 3 months",
        summary:
            "Over 12 years of experience in logistics and supply chain management. Proven track record in leading cross-functional teams, optimizing delivery operations, and implementing technology solutions to reduce costs and improve efficiency."
    },
 
  projects: [
    {
      title: "Fuel Cell Efficiency Study",
      description: "Researched and modeled fuel cell performance under various load scenarios.",
      customer: "Texas A&M",
      role: "Research Assistant",
      duration: "4 months",
      technologies: ["MATLAB", "Simulink"]
    }
  ],

  workExperience: {
    company: "PetroTrans Logistics",
    jobTitle: "Fuel Operations Manager",
    employmentType: "Full-time",
    salary: "$8,000/Monthly",
    location: "Houston, TX",
    startDate: "March 2017",
    endDate: "Present",
    summary: "Overseeing end-to-end fuel operations for southern US territories. Managing supply, delivery, and compliance with federal HAZMAT standards."
  },

  achievements: [
    "Reduced fuel waste by 18% using optimized routing algorithms.",
    "Led a team of 12 for emergency HAZMAT response readiness drills.",
    "Awarded Logistics Leader of the Year (2022)."
  ]
};
