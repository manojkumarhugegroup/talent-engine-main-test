import {
  KanbanAction,
  StageActionMap,
} from "@/types/jobs/Info/kanban/card.type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// utils/formatCurrency.ts
// export function formatCurrency(amount: number, currency: string = "USD") {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency,
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   }).format(amount);
// }

export function formatCurrency(
  amount: number | string | null | undefined,
  currency: string = "USD"
): string {
  // Safely convert to number
  const numericAmount = Number(amount);

  // If amount is not a valid number, return a safe default
  if (isNaN(numericAmount)) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(0);
  }

  // Format the valid amount
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

export function formatDate2Word(
  dateStr: string | Date | null | undefined
): string {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr); // fallback if invalid

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const timelineAssets: {
  [key: string]: { icon: string; color: string; bgColor: string };
} = {
  onboarding: {
    icon: "/assets/icons/job-info/Kanban/onboarding.svg",
    color: "onboarded",
    bgColor: "onboarded-light",
  },
  offer: {
    icon: "/assets/icons/job-info/Kanban/offer.svg",
    color: "offer",
    bgColor: "offer-light",
  },
  work_order: {
    icon: "/assets/icons/job-info/Kanban/work_order.svg",
    color: "workorder",
    bgColor: "workorder-light",
  },
  selected: {
    icon: "/assets/icons/job-info/Kanban/selected.svg",
    color: "selected",
    bgColor: "selected-light",
  },
  interview: {
    icon: "/assets/icons/job-info/Kanban/interview.svg",
    color: "interview",
    bgColor: "interview-light",
  },
  shortlisted: {
    icon: "/assets/icons/job-info/Kanban/shortlisted.svg",
    color: "shortlisted",
    bgColor: "shortlisted-light",
  },
  submitted: {
    icon: "/assets/icons/job-info/Kanban/blank.svg",
    color: "label",
    bgColor: "muted",
  },
  sourced: {
    icon: "/assets/icons/job-info/Kanban/blank.svg",
    color: "label",
    bgColor: "muted",
  },
  rejected: {
    icon: "/assets/icons/job-listing/rejected.svg",
    color: "rejected",
    bgColor: "rejected-light",
  },
  default: {
    icon: "",
    color: "gray-500",
    bgColor: "gray-200",
  },
};

// Actions palette (dummy icons, can be replaced later)
export const ACTIONS = {
  chat: { id: "chat", label: "Chat", icon: "chat" } as KanbanAction,
  reject: { id: "reject", label: "Reject", icon: "reject" } as KanbanAction,
  interview: {
    id: "interview",
    label: "Interview",
    icon: "interview",
  } as KanbanAction,
  interview_b: {
    id: "interview_b",
    label: "Interview B",
    icon: "interview_b",
  } as KanbanAction,
  selected: {
    id: "selected",
    label: "Selected",
    icon: "selected",
  } as KanbanAction,
  view: { id: "view", label: "View", icon: "view" } as KanbanAction,
  work_order: {
    id: "work_order",
    label: "Work Order",
    icon: "work_order",
  } as KanbanAction,
  work_order_pencil: {
    id: "work_order_pencil",
    label: "Work Order Pencil",
    icon: "work_order_pencil",
  } as KanbanAction,
  work_order_pencil_b: {
    id: "work_order_pencil_b",
    label: "Work Order Pencil b",
    icon: "work_order_pencil_b",
  } as KanbanAction,
  onboard: { id: "onboard", label: "Onboard", icon: "onboard" } as KanbanAction,
  offer: { id: "offer", label: "Offer", icon: "offer_pencil" } as KanbanAction,
};

export const stageActions: StageActionMap = {
  Shortlisted: {
    // Requested statuses
    Shortlisted: [ACTIONS.reject, ACTIONS.interview],
    "Awaiting Interview": [ACTIONS.reject, ACTIONS.interview],
    // Fallbacks for current demo data
    InProgress: [ACTIONS.reject, ACTIONS.interview],
    Pending: [ACTIONS.view],
    Completed: [ACTIONS.view],
    New: [ACTIONS.reject, ACTIONS.interview],
    Rejected: [],
    _default: [ACTIONS.reject, ACTIONS.interview],
  },
  Interview: {
    "Pending Interview Schedule": [ACTIONS.reject, ACTIONS.interview],
    "Awaiting Slot Acceptance": [ACTIONS.reject, ACTIONS.interview],
    "Awaiting Candidate Acceptance": [ACTIONS.reject, ACTIONS.interview],
    Scheduled: [ACTIONS.interview_b],
    "Awating Interviewer Feedback": [ACTIONS.interview_b],
    Rejected: [ACTIONS.view],
    "Interview Cleared": [ACTIONS.interview_b],
    Selected: [ACTIONS.selected],
    Accepted: [ACTIONS.selected],
    // Fallbacks
    InProgress: [ACTIONS.interview_b],
    Pending: [ACTIONS.interview],
    Completed: [ACTIONS.view],
    _default: [ACTIONS.interview_b],
  },
  Selected: {
    "Awaiting Candidate Acceptance": [ACTIONS.view],
    "Awaiting Customer Response": [ACTIONS.view],
    Accepted: [ACTIONS.view, ACTIONS.work_order],
    // Fallbacks
    InProgress: [ACTIONS.view],
    Pending: [ACTIONS.view],
    Completed: [ACTIONS.view],
    Rejected: [ACTIONS.view],
    _default: [ACTIONS.view],
  },
  "Work Order": {
    "Awaiting Customer Response": [ACTIONS.view],
    "Ready for Documentation": [ACTIONS.view],
    "Awaiting Customer Signature": [ACTIONS.view],
    "Document Signed": [ACTIONS.view, ACTIONS.offer],
    "Ready to Onboard": [ACTIONS.view, ACTIONS.work_order],
    // Fallbacks
    Draft: [ACTIONS.view, ACTIONS.work_order_pencil_b],
    InProgress: [ACTIONS.view],
    Pending: [ACTIONS.view],
    Completed: [ACTIONS.view],
    Rejected: [ACTIONS.view],
    _default: [ACTIONS.view],
  },
  Onboarding: {
    "Onboarding InProgress": [ACTIONS.view, ACTIONS.onboard],
    Onboarded: [ACTIONS.view],
    // Fallbacks
    InProgress: [ACTIONS.view, ACTIONS.onboard],
    Completed: [ACTIONS.view],
    Rejected: [ACTIONS.view],
    _default: [ACTIONS.view],
  },
  Offer: {
    "Document Signed": [ACTIONS.view, ACTIONS.onboard],
    "Onboard Progress": [ACTIONS.onboard],
    // Fallbacks
    Rejected: [ACTIONS.view],
    _default: [ACTIONS.offer],
  },
};

export function getActionsFor(stage: string, status?: string): KanbanAction[] {
  const table = stageActions[stage];
  console.log(stage, "fadsfsdf", status, table);
  if (!table) return [];
  if (status && table[status]) return table[status] as KanbanAction[];
  return table._default ?? [];
}

// Status-to-color mapping and helper
export const STATUS_COLORS: Record<string, string> = {
  "Pending Interview Schedule": "#00BABA",
  "Awaiting Candidate Acceptance": "#FF6200",
  Scheduled: "#D718DA",
  "Awaiting Interviewer Feedback": "#1B95EB",
  "Interview Cleared": "#10B981",
  Accepted: "#009765",
  "Awaiting Customer Response": "#D718DA",
  "Document Signed": "#D718DA",
  "Awaiting Customer Signature": "#4338CA",
  Onboarded: "#009765",
  "Onboarding InProgress": "#FF6200",
  "Ready to Onboard": "#009765",
  "Ready for Documentation": "#1B95EB",
  Draft: "#7B7B7B",
};

export const ACTION_COLORS: Record<string, { base: string; hover: string }> = {
  chat: {
    base: "bg-blue-500/10",
    hover: "hover:bg-blue-500/10",
  },
  reject: {
    base: "bg-red-500/5",
    hover: "hover:bg-red-500/10",
  },
  interview: {
    base: "bg-yellow-500/5",
    hover: "hover:bg-yellow-500/10",
  },
  interview_b: {
    base: "bg-purple-500/5",
    hover: "hover:bg-purple-500/10",
  },
  selected: {
    base: "bg-green-500/5",
    hover: "hover:bg-green-500/10",
  },
  view: {
    base: "bg-gray-500/5",
    hover: "hover:bg-gray-500/10",
  },
  work_order: {
    base: "bg-indigo-500/5",
    hover: "hover:bg-indigo-500/10",
  },
  work_order_pencil: {
    base: "bg-indigo-500/5",
    hover: "hover:bg-indigo-500/10",
  },
  work_order_pencil_b: {
    base: "bg-indigo-500/5",
    hover: "hover:bg-indigo-500/10",
  },
  offer_pencil: {
    base: "bg-indigo-500/5",
    hover: "hover:bg-indigo-500/10",
  },
  onboard: {
    base: "bg-emerald-500/5",
    hover: "hover:bg-emerald-500/10",
  },
};

export const getTodayMinDate = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day
  return today;
};

export const getCurrentDate = (): Date => {
  return new Date();
};
export const getCurrentTime = (): string => {
  const now = new Date();
  return now.toTimeString().slice(0, 5); // Returns "HH:MM" format
};
