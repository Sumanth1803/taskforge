import { Users, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TeamStats {
  teamName: string;
  totalTasks: number;
  todoTasks: number;
  progressTasks: number;
  doneTasks: number;
  creators: string[];
}

interface TeamCardProps {
  teamStats: TeamStats;
  onClick: () => void;
}

export const TeamCard = ({ teamStats, onClick }: TeamCardProps) => {
  const completionRate = teamStats.totalTasks > 0 
    ? Math.round((teamStats.doneTasks / teamStats.totalTasks) * 100) 
    : 0;

  return (
    <Card 
      className="group hover:shadow-glow transition-all duration-300 cursor-pointer bg-gradient-card backdrop-blur-sm border-border/50"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {teamStats.teamName}
          </CardTitle>
          <Users className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-status-todo" />
            <span className="text-sm text-muted-foreground">To Do: {teamStats.todoTasks}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-status-progress" />
            <span className="text-sm text-muted-foreground">Progress: {teamStats.progressTasks}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-status-done" />
            <span className="text-sm text-muted-foreground">Done: {teamStats.doneTasks}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Total: {teamStats.totalTasks}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium">{completionRate}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">Team Members:</span>
          <div className="flex flex-wrap gap-1">
            {teamStats.creators.map((creator, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {creator}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};