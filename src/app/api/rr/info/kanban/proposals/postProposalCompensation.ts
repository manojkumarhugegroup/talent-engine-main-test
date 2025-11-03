// src/lib/api/postProposalCompensation.ts

import { ProposalFormData } from "@/types/jobs/Info/kanban/interview";

export async function postProposalCompensation(data: ProposalFormData) {
  try {
    const response = await fetch("/api/rr/info/kanban/proposals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to post proposal: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}
