// app/api/rr/info/kanban/meeting/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { InterviewDataType } from '@/types/jobs/Info/kanban/interview-meeting'

// Validation function
function validateInterviewData(data: any): data is InterviewDataType {
  if (!data || typeof data !== "object") return false;
  
  // Check if candidate exists
  if (!data.candidate || typeof data.candidate !== "object") return false;
  
  const candidate = data.candidate;
  
  // Validate candidate basic info
  if (!candidate.name || typeof candidate.name !== "string") return false;
  if (!candidate.profession || typeof candidate.profession !== "string") return false;
  if (!candidate.avatar || typeof candidate.avatar !== "string") return false;
  
  // Validate round data
  if (!candidate.round || typeof candidate.round !== "object") return false;
  if (typeof candidate.round.roundNumber !== "number") return false;
  if (!candidate.round.type || typeof candidate.round.type !== "string") return false;
  if (!candidate.round.interviewer || typeof candidate.round.interviewer !== "string") return false;
  if (!candidate.round.date || typeof candidate.round.date !== "string") return false;
  if (!candidate.round.time || typeof candidate.round.time !== "string") return false;
  if (!candidate.round.mode || typeof candidate.round.mode !== "string") return false;
  
  // Validate meeting data
  if (!candidate.meeting || typeof candidate.meeting !== "object") return false;
  if (!candidate.meeting.link || typeof candidate.meeting.link !== "string") return false;
  if (!candidate.meeting.agenda || typeof candidate.meeting.agenda !== "string") return false;
  
  return true;
}

// Database save function (replace with your actual database logic)
async function saveInterviewToDatabase(data: InterviewDataType): Promise<{ id: string; submittedAt: string }> {
  try {
    // Replace this with your actual database save logic
    // Examples:
    // - Prisma: const result = await prisma.interview.create({ data });
    // - MongoDB: const result = await db.collection('interviews').insertOne(data);
    // - MySQL: const result = await query('INSERT INTO interviews...', data);
    
    const savedInterview = {
      id: `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      submittedAt: new Date().toISOString(),
      candidateName: data.candidate?.name,
      interviewType: data.candidate?.round?.type,
      scheduledDate: data.candidate?.round?.date,
      ...data
    };
    
    // Log the data being saved (remove in production)
    console.log("Interview data to be saved:", JSON.stringify(savedInterview, null, 2));
    
    // Simulate database save delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      id: savedInterview.id,
      submittedAt: savedInterview.submittedAt
    };
    
  } catch (error) {
    console.error("Database save error:", error);
    throw new Error("Failed to save interview data to database");
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: InterviewDataType = await request.json()
    
    console.log('Received interview data:', JSON.stringify(data, null, 2))
    
    // Validate request data structure
    if (!validateInterviewData(data)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid interview data structure. Please check all required fields.",
          error: "Validation failed"
        },
        { status: 400 }
      );
    }

    // Additional business logic validation
    if (data.candidate) {
      const currentDate = new Date();
      const interviewDate = new Date(data.candidate.round.date);
      
      // Check if interview date is in the past
      if (interviewDate < currentDate) {
        return NextResponse.json(
          {
            success: false,
            message: "Interview date cannot be in the past",
            error: "Invalid date"
          },
          { status: 400 }
        );
      }

      // Validate round number is positive
      if (data.candidate.round.roundNumber <= 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Round number must be a positive number",
            error: "Invalid round number"
          },
          { status: 400 }
        );
      }

      // Validate meeting link format (basic URL validation)
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(data.candidate.meeting.link)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid meeting link format. Please provide a valid URL.",
            error: "Invalid URL format"
          },
          { status: 400 }
        );
      }
    }

    // Save to database
    const savedData = await saveInterviewToDatabase(data);
    
    // Return success response
    return NextResponse.json(
      { 
        success: true,
        message: `Interview scheduled successfully for ${data.candidate?.name}! Round ${data.candidate?.round?.roundNumber} (${data.candidate?.round?.type}) with ${data.candidate?.round?.interviewer}.`,
        data: {
          id: savedData.id,
          submittedAt: savedData.submittedAt,
          candidate: data.candidate?.name,
          interviewType: data.candidate?.round?.type,
          scheduledDate: data.candidate?.round?.date,
          scheduledTime: data.candidate?.round?.time
        }
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Error processing interview data:', error)
    
    // Handle different types of errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid JSON format in request body',
          message: 'Please check your request data format'
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process interview data',
        message: error instanceof Error ? error.message : 'Internal server error. Please try again later.'
      },
      { status: 500 }
    )
  }
}


