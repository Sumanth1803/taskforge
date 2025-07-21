import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CheckCircle, Clock, AlertCircle, User } from "lucide-react";
import { TaskCard } from "./TaskCard";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string;
  assignee: string;
  team: string;
  createdBy?: string;
}

interface TeamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: 'todo' | 'progress' | 'done') => void;
  onDeleteTask: (taskId: string) => void;
}

export const TeamDetailsModal = ({ 
  isOpen, 
  onClose, 
  teamName, 
  tasks,
  onStatusChange,
  onDeleteTask 
}: TeamDetailsModalProps) => {
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const progressTasks = tasks.filter(task => task.status === 'progress');
  const doneTasks = tasks.filter(task => task.status === 'done');
  
  const creators = [...new Set(tasks.map(task => task.createdBy || task.assignee))];
  const creatorTaskCounts = creators.map(creator => ({
    name: creator,
    count: tasks.filter(task => (task.createdBy || task.assignee) === creator).length
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] bg-card border-border shadow-elegant overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            {teamName} Team Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Team Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-2xl font-bold">{tasks.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">To Do</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-status-todo" />
                  <span className="text-2xl font-bold">{todoTasks.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-status-progress" />
                  <span className="text-2xl font-bold">{progressTasks.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-status-done" />
                  <span className="text-2xl font-bold">{doneTasks.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Members */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Team Members & Task Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {creatorTaskCounts.map((creator, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30">
                    <span className="font-medium">{creator.name}</span>
                    <Badge variant="secondary">{creator.count} tasks</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tasks List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">All Tasks ({tasks.length})</h3>
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No tasks found for this team.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={{
                    ...task,
                    dueDate: task.due_date,
                  }}
                  onStatusChange={onStatusChange}
                  onDeleteTask={onDeleteTask}
                />
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};