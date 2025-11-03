import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, X, ThumbsUp, Calendar } from 'lucide-react';

interface CandidateCardProps {
  name: string;
  role: string;
  description?: string;
  status?: string;
  statusType?: 'waiting' | 'active' | 'completed';
  tags?: string[];
  hasVirtualMeeting?: boolean;
  avatarFallback: string;
}

export function CandidateCard({
  description,
  status,
  statusType = 'active',
  tags = [],
  hasVirtualMeeting = false,
}: CandidateCardProps) {
  const getStatusBadgeVariant = () => {
    switch (statusType) {
      case 'waiting':
        return 'secondary';
      case 'completed':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        {/* Header with Avatar and Basic Info */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-slate-100 text-slate-700 font-semibold">
              DD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-slate-900 truncate">Maddyy</h3>
            <p className="text-sm text-slate-600 font-medium">Mechanical Engineering</p>
          </div>
        </div>

        {/* Status Badge */}
        {status && (
          <div className="mb-4">
            <Badge
              variant={getStatusBadgeVariant()}
              className={`text-xs ${statusType === 'waiting'
                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                  : ''
                }`}
            >
              {status}
            </Badge>
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-slate-50 text-slate-700 border-slate-200"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Virtual Meeting Indicator */}
        {hasVirtualMeeting && (
          <div className="flex items-center gap-2 mb-4 text-sm text-blue-600">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">Virtual Meeting</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 mt-6">
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 rounded-full border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          >
            <MessageCircle className="w-4 h-4 text-slate-600" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 rounded-full border-red-200 hover:border-red-300 hover:bg-red-50"
          >
            <X className="w-4 h-4 text-red-500" />
          </Button>
          <Button
            variant="default"
            size="sm"
            className="w-10 h-10 p-0 rounded-full bg-blue-600 hover:bg-blue-700"
          >
            <ThumbsUp className="w-4 h-4 text-white" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}