"use client";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

interface EmptyJobPostingCardProps {
  title?: string;
  description?: string;
  className?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyJobPostingCard({
  title = "No RR available",
  description = "There are no RR to display at the moment.",
  className = "",
  icon,
  action,
}: EmptyJobPostingCardProps) {

const sid = Cookies.get("sid");
const fName = Cookies.get("full_name");
  return (
    <Card
      className={`w-full md:max-w-md lg:max-w-lg bg-card border border-dashed border-gray-300 shadow-none hover:border-gray-400 transition-colors ${className} bg-card/80`}
    >
      <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="rounded-full bg-background p-4">
          {icon || <FileText className="h-8 w-8 text-primary" />}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-(--primary-active)">
            {title}
          </h3>
          
          <p className="text-sm text-gray-600 max-w-xs">
            {description}
          </p>
        </div>

        {action && (
          <Button 
            onClick={action.onClick}
            className="mt-2 text-primary"
            variant="outline"
          >
            <RotateCcw className="h-4 w-4" />
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}