import { Calendar, User, ChevronDown, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  assignee: string;
  team: string;
}

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onDeleteTask: (taskId: string) => void;
  className?: string;
}

const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'todo':
      return 'border-l-status-todo bg-status-todo/5';
    case 'progress':
      return 'border-l-status-progress bg-status-progress/5';
    case 'done':
      return 'border-l-status-done bg-status-done/5';
    default:
      return 'border-l-border';
  }
};

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'low':
      return 'border-priority-low text-priority-low';
    case 'medium':
      return 'border-priority-medium text-priority-medium';
    case 'high':
      return 'border-priority-high text-priority-high';
    case 'urgent':
      return 'border-priority-urgent text-priority-urgent';
    default:
      return 'border-muted text-muted-foreground';
  }
};

const getStatusDisplay = (status: Task['status']) => {
  switch (status) {
    case 'todo':
      return { label: 'To Do', color: 'text-status-todo' };
    case 'progress':
      return { label: 'In Progress', color: 'text-status-progress' };
    case 'done':
      return { label: 'Done', color: 'text-status-done' };
    default:
      return { label: status, color: 'text-muted-foreground' };
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

export const TaskCard = ({ task, onStatusChange, onDeleteTask, className }: TaskCardProps) => {
  const statusDisplay = getStatusDisplay(task.status);
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <Card className={cn(
      "group hover:shadow-glow transition-all duration-300 border-l-4 bg-gradient-card backdrop-blur-sm border-border/50",
      getStatusColor(task.status),
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {task.title}
            </h3>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
              {task.description}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-4">
                <span className={statusDisplay.color}>{statusDisplay.label}</span>
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border shadow-elegant">
              <DropdownMenuItem 
                onClick={() => onStatusChange(task.id, 'todo')}
                className="text-status-todo focus:text-status-todo"
              >
                To Do
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusChange(task.id, 'progress')}
                className="text-status-progress focus:text-status-progress"
              >
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusChange(task.id, 'done')}
                className="text-status-done focus:text-status-done"
              >
                Done
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span className={isOverdue ? 'text-destructive' : ''}>
                {formatDate(task.dueDate)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{task.assignee}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className={cn("text-xs capitalize", getPriorityColor(task.priority))}
            >
              {task.priority}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {task.team}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteTask(task.id)}
              className="ml-2 h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};