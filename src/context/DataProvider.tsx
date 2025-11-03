import React, { createContext, useContext, useState } from "react";
import { Job } from "@/types/jobs/jobs.types";
import {
  currenciesType,
  LocationType,
  ProjectType,
} from "@/types/jobs/get.type";
import { CandidateDataType } from "@/types/jobs/Info/kanban/candidate";
import { CompensationPayload } from "@/types/jobs/Info/kanban/salary";
import { InterviewDataType } from "@/types/jobs/Info/kanban/interview-meeting";
import { OrderDataType } from "@/types/jobs/Info/kanban/orderdata";
import { Candidate } from "@/types/jobs/Info/kanban/interview-view";
import {
  CandidateType,
  HistoryItem,
  Onboarding,
  ResourceRequirement,
  WorkOrder,
} from "@/types/jobs/Info/candidate-details";
import {
  AdvertisedPositionType,
  JobDescription,
} from "@/types/jobs/Info/jd.types";
import { commonType, ReasonType } from "@/types/masters/masters.type";
import { InterviewerType } from "@/types/jobs/Info/kanban/interview-feedback";

interface DataContextType {
  jobs: Job[];
  currency: currenciesType[];
  projectTypes: ProjectType[];
  projects: ProjectType[];
  visaRequirement: ProjectType[];
  languageRequirements: ProjectType[];
  location: LocationType[];
  locationHasMore: boolean;
  locationLoading: boolean;
  candidateData: CandidateDataType | null;
  candidateDetails: CandidateType | null;
  resourceRequirement: ResourceRequirement | null;
  workOrder: WorkOrder | null;
  onboarding: Onboarding | null;
  history: HistoryItem[];
  compensationData: CompensationPayload | null;
  interview: InterviewDataType | null;
  orderData: OrderDataType | null;
  interviewEditData: InterviewDataType | null;
  jobDescription: JobDescription | null;
  adposition: AdvertisedPositionType | null;
  rejectReason: ReasonType[] | [];
  cancelReason: ReasonType[] | [];
  interviewMode: commonType | [];
  interviewer: InterviewerType | [];
  interviewType: commonType | [];
  scope: commonType | [];
  qualification: commonType | [];
  keySkills: ProjectType[];

  fetchJobs: (type?: number) => void;
  fetchCurrency: () => void;
  fetchProjectTypes: () => void;
  fetchProjects: () => void;
  fetchLocation: (pageNum?: number, searchInput?: string) => Promise<void>;
  fetchCandidateData: () => void;
  fetchCompensationData: () => void;
  fetchOrderData: () => void;
  fetchInterview: () => void;
  fetchInterviewEdit: () => void;
  fetchCandidateDetails: () => void;
  fetchResourceRequirement: () => void;
  fetchWorkOrder: () => void;
  fetchOnboarding: () => void;
  fetchHistory: () => void;
  fetchJdData: () => void;
  fetchAdPosition: () => void;
  fetchRejectReason: () => void;
  fetchCancelReason: () => void;
  fetchInterviewMode: () => void;
  fetchInterviewer: (name?: string) => Promise<void>;
  fetchInterviewType: () => void;
  fetchScope: () => void;
  fetchqualification: () => void;
  fetchVisaRequirement: () => void;
  fetchLanguageRequirements: () => void;
  fetchKeySkills: () => void;
  requestedPages: React.MutableRefObject<Set<string>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currency, setCurrency] = useState<currenciesType[]>([]);
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [visaRequirement, setvisaRequirement] = useState<ProjectType[]>([]);
  const [languageRequirements, setlanguageRequirements] = useState<
    ProjectType[]
  >([]);
  const [location, setLocation] = useState<LocationType[]>([]);
  const [locationHasMore, setlocationHasMore] = useState(true);
  const [locationLoading, setlocationLoading] = useState(true);
  const [candidateData, setCandidateData] = useState<CandidateDataType | null>(
    null
  );
  const [compensationData, setCompensationData] =
    useState<CompensationPayload | null>(null);
  const [interview, setInterview] = useState<InterviewDataType | null>(null);
  const [orderData, setOrderData] = useState<OrderDataType | null>(null);
  const [interviewEditData, setInterviewEditData] =
    useState<InterviewDataType | null>(null);
  const [candidateDetails, setCandidateDetails] =
    useState<CandidateType | null>(null);
  const [resourceRequirement, setResourceRequirement] =
    useState<ResourceRequirement | null>(null);
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [onboarding, setOnboarding] = useState<Onboarding | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(
    null
  );
  const [adposition, setAdPosition] = useState<AdvertisedPositionType | null>(
    null
  );
  const [interviewMode, setInterviewMode] = useState<commonType | []>([]);
  const [interviewer, setInterviewer] = useState<InterviewerType | []>([]);
  const [interviewType, setInterviewType] = useState<commonType | []>([]);
  const [rejectReason, setRejectReason] = useState<ReasonType[] | []>([]);
  const [cancelReason, setCancelReason] = useState<ReasonType[] | []>([]);
  const [scope, setScope] = useState<commonType | []>([]);
  const [qualification, setQualification] = useState<commonType | []>([]);
  const [keySkills, setkeySkills] = useState<ProjectType[]>([]);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`/api/rr`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setJobs(data.data);
    } catch {
      setJobs([]);
    }
  };
  const fetchCurrency = async () => {
    try {
      const response = await fetch(`/api/masters/currency`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCurrency(data.data.data);
    } catch {
      setCurrency([]);
    }
  };

  const fetchProjectTypes = async () => {
    try {
      const response = await fetch(`/api/masters/project-type`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProjectTypes(data.data?.options);
    } catch {
      setProjectTypes([]);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(`/api/masters/projects`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProjects(data.data?.options);
    } catch {
      setProjects([]);
    }
  };

  const fetchVisaRequirement = async () => {
    try {
      const response = await fetch(`/api/masters/visa_requirement`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setvisaRequirement(data.data?.options);
    } catch {
      setvisaRequirement([]);
    }
  };

  const fetchLanguageRequirements = async () => {
    try {
      const response = await fetch(`/api/masters/languagerequirements`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setlanguageRequirements(data.data?.options);
    } catch {
      setlanguageRequirements([]);
    }
  };

  const fetchKeySkills = async () => {
    try {
      const response = await fetch(`/api/masters/keyskills`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setkeySkills(data.data?.options);
    } catch {
      setkeySkills([]);
    }
  };

  const requestedPages = React.useRef<Set<string>>(new Set());

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Fetch locations from the API based on the given page number and search input.
   * If the given page number and search input have been requested before, the function will return immediately.
   * The function will also update the state of the location list and whether there are more locations to fetch.
   * @param {number} [pageNum=1] - The page number to fetch.
   * @param {string} [searchInput=""] - The search input to filter the locations by.
   */

  /*******  e7f8d450-0cb3-47a3-a0ce-083c50ef273b  *******/
  const fetchLocation = async (
    pageNum: number = 1,
    searchInput: string = ""
  ) => {
    try {
      const key_filter = `${pageNum}-${searchInput.trim().toLowerCase()}`;
      if (requestedPages.current.has(key_filter)) return;
      requestedPages.current.add(key_filter);
      setlocationLoading(true);
      const response = await fetch(
        `/api/masters/location?page=${pageNum}&name=${searchInput}`,
        {
          cache: "no-store",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newLocations = data.message?.data || [];
      if (pageNum === 1) setLocation(newLocations);
      else setLocation((prev) => [...prev, ...newLocations]);
      const totalPages = data?.message?.total_pages || 1;
      setlocationHasMore(pageNum < totalPages);
      setlocationLoading(false);
    } catch {
      setLocation([]);
      setlocationHasMore(false);
    }
  };

  const fetchCandidateData = async () => {
    try {
      const response = await fetch("/api/rr/info/kanban/candidate", {
        cache: "no-store",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCandidateData(data);
    } catch (error) {
      console.error("Error fetching candidate data:", error);
      setCandidateData(null);
    }
  };

  const fetchCompensationData = async () => {
    try {
      const response = await fetch("/api/rr/info/kanban/compensation", {
        cache: "no-store",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCompensationData(data);
    } catch (error) {
      console.error("Error fetching compensation data:", error);
      setCompensationData(null);
    }
  };

  const fetchOrderData = async () => {
    try {
      const response = await fetch("/api/rr/info/kanban/orderview", {
        cache: "no-store",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOrderData(data);
    } catch (error) {
      console.error("Error fetching candidate data:", error);
      setOrderData(null);
    }
  };

  const fetchInterview = async () => {
    try {
      const response = await fetch(`/api/rr/info/kanban/meeting`, {
        cache: "no-store",
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setInterview(data); // wrap in candidate object
    } catch (error) {
      console.error("Error fetching candidate data:", error);
      setInterview({ candidate: null });
    }
  };

  const fetchInterviewEdit = async () => {
    try {
      const response = await fetch(`/api/rr/info/kanban/meetingedit`, {
        cache: "no-store",
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: InterviewDataType = await response.json();
      setInterviewEditData(data); // This should now work correctly since data matches InterviewDataType
    } catch (error) {
      console.error("Error fetching interview data:", error);
      setInterviewEditData({ candidate: null }); // Provide fallback with correct structure
    }
  };
  

  const fetchCandidateDetails = async () => {
    try {
      const res = await fetch("/api/rr/info/candidatedetails/candidate", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: CandidateType = await res.json();
      setCandidateDetails(data);
    } catch (err) {
      console.error("Error fetching candidate details:", err);
      setCandidateDetails(null);
    }
  };

  const fetchResourceRequirement = async () => {
    try {
      const res = await fetch("/api/rr/info/candidatedetails/resource", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: ResourceRequirement = await res.json();
      setResourceRequirement(data);
    } catch (err) {
      console.error("Error fetching resource requirement:", err);
      setResourceRequirement(null);
    }
  };

  const fetchWorkOrder = async () => {
    try {
      const res = await fetch("/api/rr/info/candidatedetails/workorder", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: WorkOrder = await res.json();
      setWorkOrder(data);
    } catch (err) {
      console.error("Error fetching work order:", err);
      setWorkOrder(null);
    }
  };

  const fetchOnboarding = async () => {
    try {
      const res = await fetch("/api/rr/info/candidatedetails/onboarding", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: Onboarding = await res.json();
      setOnboarding(data);
    } catch (err) {
      console.error("Error fetching onboarding data:", err);
      setOnboarding(null);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/rr/info/candidatedetails/history", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: HistoryItem[] = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Error fetching history data:", err);
      setHistory([]);
    }
  };

  const fetchJdData = async () => {
    try {
      const res = await fetch("/api/rr/info/jddetails/jddata", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: JobDescription = await res.json();
      setJobDescription(data);
    } catch (err) {
      console.error("Error fetching candidate details:", err);
      setJobDescription(null);
    }
  };

  const fetchAdPosition = async () => {
    try {
      const res = await fetch("/api/rr/info/jddetails/adposition", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: AdvertisedPositionType = await res.json();
      setAdPosition(data);
    } catch (err) {
      console.error("Error fetching candidate details:", err);
      setAdPosition(null);
    }
  };

  const fetchCancelReason = async () => {
    try {
      const response = await fetch(`/api/masters/cancel`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCancelReason(data.message);
    } catch {
      setCancelReason([]);
    }
  };

  const fetchRejectReason = async () => {
    try {
      const response = await fetch(`/api/masters/reject`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setRejectReason(data.message);
    } catch {
      setRejectReason([]);
    }
  };

  const fetchInterviewMode = async () => {
    try {
      const response = await fetch(`/api/masters/interview-mode`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setInterviewMode(data.data);
    } catch {
      setInterviewMode([]);
    }
  };

  const fetchInterviewer = async (name?: string): Promise<void> => {
    try {
      const response = await fetch(`/api/masters/interviewers?name=${name}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data,'ssqweqw')
      setInterviewer(data.message.data);
    } catch {
      setInterviewer([]);
    }
  };

  const fetchInterviewType = async () => {
    try {
      const response = await fetch(`/api/masters/interview-type`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setInterviewType(data.data);
    } catch {
      setInterviewType([]);
    }
  };

  const fetchScope = async () => {
    try {
      const response = await fetch(`/api/masters/scope`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setScope(data.data);
    } catch {
      setScope([]);
    }
  };

  const fetchqualification = async () => {
    try {
      const response = await fetch(`/api/masters/qualification`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setQualification(data.data?.options);
    } catch {
      setQualification([]);
    }
  };

  const value: DataContextType = {
    jobs,
    currency,
    projectTypes,
    location,
    locationHasMore,
    locationLoading,
    candidateData,
    compensationData,
    orderData,
    interview,
    interviewEditData,
    candidateDetails,
    resourceRequirement,
    workOrder,
    onboarding,
    history,
    jobDescription,
    adposition,
    interviewMode,
    interviewer,
    interviewType,
    rejectReason,
    cancelReason,
    scope,
    qualification,
    projects,
    visaRequirement,
    languageRequirements,
    keySkills,
    fetchJobs,
    fetchCurrency,
    fetchProjectTypes,
    fetchLocation,
    fetchCandidateData,
    fetchCompensationData,
    fetchOrderData,
    fetchInterview,
    fetchInterviewEdit,
    fetchCandidateDetails,
    fetchResourceRequirement,
    fetchWorkOrder,
    fetchOnboarding,
    fetchHistory,
    fetchJdData,
    fetchAdPosition,
    fetchRejectReason,
    fetchCancelReason,
    fetchInterviewMode,
    fetchInterviewer,
    fetchInterviewType,
    fetchScope,
    fetchqualification,
    fetchProjects,
    fetchVisaRequirement,
    fetchLanguageRequirements,
    fetchKeySkills,
    requestedPages,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context)
    throw new Error("useDataContext must be used within a DataProvider");
  return context;
};
