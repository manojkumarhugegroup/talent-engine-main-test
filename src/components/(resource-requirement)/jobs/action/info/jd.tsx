import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';
import { JDEditDrawer } from "./jd/EditDrawer";
import { downloadStyledMarkdownPdf, } from "./jd/pdf";
import { toast } from "sonner";
import ScrollableShadowBox from "@/components/layout/ScrollableShadowBox";

const advertisedPosition = `
**Now Hiring:**  Logistics & Operations Coordinator  
**Location:**  Houston, TX | Full-Time | $75K-$90K/year  

6 Days/Week | 8 Hours/Day | 8 Weeks On / 2 Weeks Off | 24-Month Project | Start Date: June 10, 2025  

A national fuel distribution project is underway — a transformative, coast-to-coast initiative modernizing fuel logistics across the U.S. We're looking for a sharp, driven Logistics & Operations Coordinator to help power this mission.

**What You'll Do**  
- Coordinate multi-region fuel deliveries & routing  
- Optimize inventory levels using SAP Logistics  
- Ensure compliance with federal & environmental standards 
- Collaborate across transport teams, warehouses & external partners 
- Report KPIs & performance metrics to leadership  

**What You Bring**  
- 3-7 years in logistics, 2-8 years in inventory management
- Experience with SAP & route optimization tools
- Strong leadership, decision-making & communication Skills
- US Citizen or Green Card Holder
- CSCP Certification (preferred)

Bonus if you've worked in the fuel, oil & gas, or environmental logistics sector!
`;

const jobDescription = `

**Job Title:** Logistics & Operations Coordinator - National Fuel Distribution Project  
**Location:** Houston, TX  
**Employment Type:** Full-Time  
**Compensation:** $75,000 - $90,000 per year  
**Working Days / Week:** 6  
**Working Hours / Day:** 8  
**Rotation Cycle:** 8 Weeks On / 2 Weeks Off  
**Visa Requirement:** US Citizen or Green Card Holder  
**Start Date:** June 10, 2025  
**Project Duration:** 24 months  



**Overview**  
A high-impact National Fuel Distribution Project is underway — a transformative initiative aimed at elevating the efficiency, sustainability, and reliability of fuel logistics across the United States. We are seeking a proactive and detail-oriented **Logistics & Operations Coordinator** based in Houston, TX to join a multidisciplinary team dedicated to modernizing coast-to-coast fuel distribution through advanced delivery strategies, regional coordination, and integrated inventory systems.  

**Key Responsibilities**  
- Lead daily coordination of fuel delivery routes across regional hubs  
- Monitor and maintain inventory levels with a focus on optimization and accuracy  
- Develop efficient replenishment cycles based on consumption patterns and forecasts  
- Maintain rigorous compliance with safety, transportation, and environmental regulations  
- Serve as the central point of contact for transportation teams, warehouse operations, and partner vendors  
- Provide actionable insights and reports on KPIs, delivery timelines, and cost-efficiency metrics  
- Utilize advanced logistics tools such as SAP Logistics and route optimization platforms to streamline operations  



**Requirements**  
- 3-7 years of experience in logistics coordination  
- 2-8 years in inventory and supply chain management  
- 2-5 years managing or supporting fleet operations  
- Strong command of SAP Logistics  
- Familiarity with route optimization and tracking tools  
- Excellent communication, leadership, and decision-making skills  

**Preferred Qualifications**  
- Certified Supply Chain Professional (CSCP) - Preferred  
- Prior experience in the fuel, oil & gas, or environmental logistics sectors  

**Language Requirements**  
- Proficiency in English — reading, writing, and speaking  

**Why Join This Project?**  
This role offers a unique opportunity to contribute to a national initiative with real-world impact. By joining this team, you’ll help shape the future of fuel logistics in the U.S. and play a central role in advancing sustainable, efficient distribution infrastructure. As a key member of the project, you’ll be recognized for your contributions and have opportunities to grow professionally and personally throughout the project lifecycle.  

**Special Consideration**  
Due to the sensitive nature of the role and the critical infrastructure involved, only candidates meeting visa requirements and with a demonstrated history of logistics excellence will be considered.  



**Apply Today. Help shape the future of fuel logistics in the U.S.**
`

interface jdProps {
  setFullscreenSection?: (section: string | null) => void;
  isFull?: boolean;
}
export function JD({ setFullscreenSection, isFull }: jdProps) {
  const [activeTab, setActiveTab] = useState("0");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const advRef = useRef<HTMLDivElement>(null);
  const jdRef = useRef<HTMLDivElement>(null);

  const handleEditClick = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleDownload = () => {
    const content = activeTab === "0" ? advertisedPosition : jobDescription;
    const tabName = activeTab === "0" ? "Advertised Position" : "Job Description";

    downloadStyledMarkdownPdf(content, tabName, `${tabName}.pdf`);
  };

  const handleCopy = async () => {
    const content =
      activeTab === "0" ? advertisedPosition : jobDescription;

    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard!"); // optional feedback
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy"); // optional
    }
  };

  return (
    <ScrollableShadowBox>
      <div className="w-full min-w-0">
        <Tabs defaultValue="0" value={activeTab} onValueChange={setActiveTab} className="px-4 col-span-4 gap-0">
          <div className="flex justify-between items-center">
            <TabsList className="bg-(--login-bg) rounded h-10">
              <TabsTrigger value="0" className="data-[state=active]:bg-card data-[state=active]:text-label text-sm rounded cursor-pointer px-4 py-1"
              >Advertised Position</TabsTrigger>
              <TabsTrigger value="1" className="data-[state=active]:bg-card data-[state=active]:text-label text-sm rounded cursor-pointer px-4 py-1"
              >Job Description</TabsTrigger>
            </TabsList>
            <div className="flex w-full justify-end gap-2 px-2">
              <div className="bg-[var(--edit-bg)] rounded w-8 h-8 hover:bg-[var(--edit-bg)] flex items-center justify-center cursor-pointer" onClick={handleEditClick}>
                <img src="/assets/icons/job-info/edit.svg" alt="Edit" className="w-3 h-3" />
              </div>
              <div className="bg-[var(--copy-bg)] rounded w-8 h-8 hover:bg-[var(--copy-bg)] flex items-center justify-center cursor-pointer" onClick={handleCopy}>
                <img src="/assets/icons/job-info/copy.svg" alt="copy" className="w-4 h-4" />
              </div>
              <div className="bg-[var(--share-bg)] rounded w-8 h-8 hover:bg-[var(--share-bg)] flex items-center justify-center cursor-pointer">
                <img src="/assets/icons/job-info/share.svg" alt="share" className="w-4.5 h-4.5" />
              </div>
              <div className="bg-[var(--label)] rounded w-8 h-8 hover:bg-[var(--label)] flex items-center justify-center cursor-pointer" onClick={handleDownload}
                title="Download PDF">
                <img src="/assets/icons/job-info/download.svg" alt="download" className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
          <ScrollableShadowBox>
            <div className=" flex-1 flex-col h-[calc(80vh-6rem)]">
              <TabsContent value="0">
                <div className="prose max-w-none p-2.5 bg-card rounded text-sm">
                  <ReactMarkdown components={{
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-xs font-medium text-label mt-4"
                        {...props}
                      />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong
                        className="font-bold text-label text-xs"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="text-label  leading-relaxed text-xs mb-2"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li
                        className="list-disc ml-5 text-label  mt-1.5 text-xs mb-2.5"
                        {...props}
                      />
                    ),
                  }}>{advertisedPosition}</ReactMarkdown>
                </div>
              </TabsContent>

              <TabsContent value="1">
                <div className="prose max-w-none p-2.5 bg-card rounded text-sm">
                  <ReactMarkdown components={{
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-xs font-medium text-label mt-4"
                        {...props}
                      />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong
                        className="font-bold text-label text-xs"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="text-label  leading-relaxed text-xs mb-2"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li
                        className="list-disc ml-5 text-label  mt-1.5 text-xs mb-2.5"
                        {...props}
                      />
                    ),
                  }}>{jobDescription}</ReactMarkdown>
                </div>
              </TabsContent>
            </div>
          </ScrollableShadowBox>
        </Tabs>


      </div>
      <JDEditDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        activeTab={activeTab}
      />
    </ScrollableShadowBox>
  );
}
