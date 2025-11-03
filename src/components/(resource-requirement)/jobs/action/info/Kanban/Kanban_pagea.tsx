"use client";

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { GripVertical, Calendar, DollarSign, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Candidate {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar: string;
  baseSalary: string;
  totalDailyCost?: string;
  proposedJoiningDate: string;
  actualJoiningDate?: string;
  experience?: string;
  
  skills: string[];
  phone?: string;
  email?: string;
  location?: string;
  status?: 'technical' | 'rejected' | 'selected';
  round?: number;
  feedback?: string;
}

interface Column {
  id: string;
  title: string;
  count: number;
  color: string;
  candidates: Candidate[];
}

const initialData: { columns: Column[] } = {
  columns: [
    {
      id: 'shortlisted',
      title: 'Shortlisted',
      count: 3,
      color: 'bg-gray-100 text-gray-800',
      candidates: [
        {
          id: 'maddy',
          name: 'Maddy',
          role: 'Mechanical Engineer',
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
          baseSalary: '',
          experience: '5+ years of experience in oil and gas operations, specializing in equipment maintenance and process optimization',
          skills: ['Mechanical Design', 'Process Optimization', 'Equipment Maintenance'],
          proposedJoiningDate: 'Aug 01, 2025'
        },
        {
          id: 'jack',
          name: 'Jack',
          role: 'Mechanical Engineer',
          avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150',
          baseSalary: '',
          experience: '8+ years of experience in designing and optimizing mechanical systems',
          skills: ['System Design', 'CAD/CAM', 'Project Management'],
          proposedJoiningDate: 'Aug 01, 2025'
        },
        {
          id: 'sam',
          name: 'Sam',
          role: 'Mechanical Engineer',
          avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150',
          baseSalary: '',
          experience: '3+ years of experience in oil and gas operations, specializing in equipment maintenance and process optimization',
          skills: ['Equipment Maintenance', 'Process Control', 'Safety Protocols'],
          proposedJoiningDate: 'Aug 01, 2025'
        }
      ]
    },
    {
      id: 'interview',
      title: 'Interview',
      count: 4,
      color: 'bg-blue-100 text-blue-800',
      candidates: [
        {
          id: 'lilly',
          name: 'Lilly',
          role: 'Procurement Specialist',
          company: 'Awaiting Interview feedback',
          avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
          round: 1,
          skills: ['Strategic Sourcing', 'Vendor Management'],
          baseSalary: '',
          proposedJoiningDate: 'Aug 01, 2025',
          status: 'technical'
        },
        {
          id: 'wang',
          name: 'Wang',
          role: 'Procurement Specialist',
          avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
          round: 1,
          baseSalary: '',
          proposedJoiningDate: 'Aug 01, 2025',
          skills: ['Contract Negotiation', 'Supply Chain'],
          status: 'technical'
        },
        {
          id: 'chan',
          name: 'Chan',
          role: 'Procurement Specialist',
          company: 'Awaiting Interview feedback',
          avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
          round: 1,
          baseSalary: '',
          proposedJoiningDate: 'Aug 01, 2025',
          skills: ['Cost Analysis', 'Vendor Relations'],
          status: 'technical'
        },
        {
          id: 'anna',
          name: 'Anna',
          role: 'Procurement Specialist',
          company: 'Awaiting Interview feedback',
          avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150',
          baseSalary: '',
          proposedJoiningDate: 'Aug 01, 2025',
          skills: ['Strategic Procurement', 'Risk Management'],
          status: 'rejected'
        }
      ]
    },
    {
      id: 'selected',
      title: 'Selected',
      count: 5,
      color: 'bg-orange-100 text-orange-800',
      candidates: [
        {
          id: 'lucas',
          name: 'Lucas',
          role: 'Procurement Specialist',
          company: 'Awaiting customer acceptance',
          avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
          baseSalary: '$2100/Month',
          proposedJoiningDate: 'Aug 01, 2025',
          skills: ['Vendor Management', 'Contract Negotiation']
        },
        {
          id: 'banner',
          name: 'Banner',
          role: 'Procurement Specialist',
          company: 'Awaiting customer acceptance',
          avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
          baseSalary: '$2300/Month',
          proposedJoiningDate: 'Aug 01, 2025',
          skills: ['Strategic Sourcing', 'Cost Optimization']
        },
        {
          id: 'joe-selected',
          name: 'Joe',
          role: 'Procurement Specialist',
          company: 'Awaiting customer acceptance',
          avatar: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=150',
          baseSalary: '$2300/Month',
          proposedJoiningDate: 'Aug 01, 2025',
          skills: ['Supply Chain', 'Risk Assessment']
        },
        {
          id: 'may',
          name: 'May',
          role: 'Procurement Specialist',
          company: 'Awaiting customer response',
          avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
          baseSalary: '$2400/Month',
          proposedJoiningDate: 'Aug 01, 2025',
          skills: ['Vendor Relations', 'Quality Assurance']
        },
        {
          id: 'steve',
          name: 'Steve',
          role: 'Procurement Specialist',
          company: 'Accepted',
          avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150',
          baseSalary: '$2400/Month',
          totalDailyCost: '$173',
          proposedJoiningDate: 'Aug 01, 2025',
          skills: ['Contract Management', 'Supplier Development']
        }
      ]
    },
    {
      id: 'work-order',
      title: 'Work Order',
      count: 5,
      color: 'bg-red-100 text-red-800',
      candidates: [
        {
          id: 'bruce',
          name: 'Bruce',
          role: 'Procurement Specialist',
          company: 'Work Order for Resume',
          avatar: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150',
          baseSalary: '$2400/Month',
          totalDailyCost: '$193',
          proposedJoiningDate: 'Aug 01, 2025',
          skills: ['Resume Writing', 'Profile Optimization']
        },
        {
          id: 'mona',
          name: 'Mona',
          role: 'Procurement Specialist',
          company: 'Work for Documentation',
          avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150',
          baseSalary: '$2500/Month',
          totalDailyCost: '$193',
          proposedJoiningDate: 'Aug 01, 2025',
          skills: ['Documentation', 'Process Documentation']
        },
        {
          id: 'monika',
          name: 'Monika',
          role: 'Procurement Specialist',
          company: 'Awaiting Customer Signature',
          avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150',
          baseSalary: '$2500/Month',
          totalDailyCost: '$193',
          proposedJoiningDate: 'Aug 01, 2025',
          skills: ['Contract Signature', 'Legal Documentation']
        },
        {
          id: 'walter',
          name: 'Walter',
          role: 'Procurement Specialist',
          company: 'Document Signed',
          avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150',
          baseSalary: '$2400/Month',
          totalDailyCost: '$193',
          proposedJoiningDate: 'Aug 01, 2025',
          skills: ['Document Management', 'Legal Compliance']
        },
        {
          id: 'john-work',
          name: 'John',
          role: 'Procurement Specialist',
          company: 'Work Order Onboard',
          avatar: 'https://images.pexels.com/photos/1040882/pexels-photo-1040882.jpeg?auto=compress&cs=tinysrgb&w=150',
          baseSalary: '$2500/Month',
          totalDailyCost: '$193',
          proposedJoiningDate: 'Aug 01, 2025',
          skills: ['Onboarding', 'Process Training']
        }
      ]
    },
    {
      id: 'onboarding',
      title: 'Onboarding',
      count: 2,
      color: 'bg-green-100 text-green-800',
      candidates: [
        {
          id: 'joe-onboard',
          name: 'Joe',
          role: 'Procurement Specialist',
          avatar: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=150',
          actualJoiningDate: 'Aug 02, 2025',
          baseSalary: '$2400/Month',proposedJoiningDate: 'Aug 01, 2025',
          skills: ['Onboarding Complete', 'Ready for Work']
        },
        {
          id: 'john-onboard',
          name: 'John',
          role: 'Procurement Specialist',
          avatar: 'https://images.pexels.com/photos/1040882/pexels-photo-1040882.jpeg?auto=compress&cs=tinysrgb&w=150',
          actualJoiningDate: 'Aug 02, 2025',
          baseSalary: '$2400/Month',proposedJoiningDate: 'Aug 01, 2025',
          skills: ['Documentation Complete', 'System Access Ready']
        }
      ]
    }
  ]
};

export default function Home() {
  const [columns, setColumns] = useState<Column[]>(initialData.columns);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const getColumnIndex = (columnId: string): number => {
    return columns.findIndex(col => col.id === columnId);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceColumnIndex = getColumnIndex(source.droppableId);
    const destColumnIndex = getColumnIndex(destination.droppableId);

    // Check if moving to next column only
    if (destColumnIndex !== sourceColumnIndex + 1) {
      toast.error("Invalid Move!", {
        description: "Candidates can only be moved to the next stage in the recruitment process.",
        duration: 3000,
      });
      return;
    }

    const newColumns = [...columns];
    const sourceColumn = newColumns[sourceColumnIndex];
    const destColumn = newColumns[destColumnIndex];

    // Remove from source
    const [movedCandidate] = sourceColumn.candidates.splice(source.index, 1);
    
    // Add to destination
    destColumn.candidates.splice(destination.index, 0, movedCandidate);

    // Update counts
    sourceColumn.count = sourceColumn.candidates.length;
    destColumn.count = destColumn.candidates.length;

    setColumns(newColumns);
    setSelectedCandidate(movedCandidate);
    setIsSheetOpen(true);

    toast.success("Candidate Moved!", {
      description: `${movedCandidate.name} has been moved to ${destColumn.title}`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Recruitment Pipeline</h1>
        
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {columns.map((column) => (
              <div key={column.id} className="flex flex-col">
                <div className={`rounded-t-lg p-4 ${column.color} border-b-2`}>
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-sm">{column.title}</h2>
                    <Badge variant="secondary" className="text-xs">
                      ({column.count})
                    </Badge>
                  </div>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[600px] bg-card rounded-b-lg p-4 space-y-3 border border-t-0 ${
                        snapshot.isDraggingOver ? 'bg-blue-50' : ''
                      }`}
                    >
                      {column.candidates.map((candidate, index) => (
                        <Draggable key={candidate.id} draggableId={candidate.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`cursor-move transition-all duration-200 hover:shadow-md ${
                                snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                              }`}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center space-x-3">
                                    <Avatar className="w-10 h-10">
                                      <AvatarImage src={candidate.avatar} alt={candidate.name} />
                                      <AvatarFallback>{candidate.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                                      <p className="text-sm text-gray-600">{candidate.role}</p>
                                    </div>
                                  </div>
                                  <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600">
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                </div>

                                {candidate.company && (
                                  <p className="text-xs text-blue-600 mb-2">{candidate.company}</p>
                                )}

                                {candidate.round && (
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Badge variant="outline" className="text-xs">Round {candidate.round}</Badge>
                                    {candidate.status === 'technical' && (
                                      <Badge className="text-xs bg-blue-100 text-blue-800">Technical</Badge>
                                    )}
                                    {candidate.status === 'rejected' && (
                                      <Badge variant="destructive" className="text-xs">Rejected</Badge>
                                    )}
                                  </div>
                                )}

                                {candidate.baseSalary && (
                                  <div className="flex items-center space-x-1 text-xs text-gray-600 mb-1">
                                    <DollarSign className="w-3 h-3" />
                                    <span>Base Salary {candidate.baseSalary}</span>
                                  </div>
                                )}

                                {candidate.totalDailyCost && (
                                  <div className="flex items-center space-x-1 text-xs text-gray-600 mb-1">
                                    <span>Total Daily Cost ${candidate.totalDailyCost}</span>
                                  </div>
                                )}

                                <div className="flex items-center space-x-1 text-xs text-gray-600 mb-2">
                                  <Calendar className="w-3 h-3" />
                                  <span>
                                    {candidate.actualJoiningDate ? 
                                      `Actual Joining Date ${candidate.actualJoiningDate}` :
                                      `Proposed Joining Date ${candidate.proposedJoiningDate}`
                                    }
                                  </span>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                  {candidate.skills.slice(0, 2).map((skill) => (
                                    <Badge key={skill} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="left" className="w-96">
          <SheetHeader>
            <SheetTitle>Candidate Details</SheetTitle>
            <SheetDescription>
              Review candidate information and update their status
            </SheetDescription>
          </SheetHeader>
          
          {selectedCandidate && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedCandidate.avatar} alt={selectedCandidate.name} />
                  <AvatarFallback>{selectedCandidate.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedCandidate.name}</h3>
                  <p className="text-gray-600">{selectedCandidate.role}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                  <p className="text-sm text-gray-600">{selectedCandidate.experience}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>

                {selectedCandidate.baseSalary && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Compensation</h4>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span>Base Salary: {selectedCandidate.baseSalary}</span>
                      </div>
                      {selectedCandidate.totalDailyCost && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span>Daily Cost: ${selectedCandidate.totalDailyCost}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                  <div className="space-y-1">
                    {selectedCandidate.actualJoiningDate && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span>Joined: {selectedCandidate.actualJoiningDate}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Proposed: {selectedCandidate.proposedJoiningDate}</span>
                    </div>
                  </div>
                </div>

                {selectedCandidate.company && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                    <Badge className="bg-blue-100 text-blue-800">{selectedCandidate.company}</Badge>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={() => setIsSheetOpen(false)} className="flex-1">
                  Close
                </Button>
                <Button variant="outline" className="flex-1">
                  Edit Details
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}