import { useState } from "react";
import { Plus, Filter, Search, Calendar, Users, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskModal } from "@/components/CreateTaskModal";
import { StatsCard } from "@/components/StatsCard";

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

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create mockups and wireframes for the new product landing page',
    status: 'progress',
    priority: 'high',
    dueDate: '2024-07-25',
    assignee: 'Alex Chen',
    team: 'Design Team'
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Set up login/signup flow with email verification',
    status: 'todo',
    priority: 'urgent',
    dueDate: '2024-07-22',
    assignee: 'Sarah Johnson',
    team: 'Development Team'
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all endpoints for the REST API',
    status: 'done',
    priority: 'medium',
    dueDate: '2024-07-20',
    assignee: 'Mike Rodriguez',
    team: 'Development Team'
  },
  {
    id: '4',
    title: 'User testing session',
    description: 'Conduct usability testing with 10 target users',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-07-28',
    assignee: 'Emma Wilson',
    team: 'Product Team'
  }
];

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTasks([...tasks, task]);
    setIsCreateModalOpen(false);
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-gradient-card backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-primary p-3 rounded-xl shadow-elegant">
                <CheckCircle className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  TaskForge
                </h1>
                <p className="text-muted-foreground">Forge your productivity</p>
              </div>
            </div>
            
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-90 shadow-elegant">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <CreateTaskModal onCreateTask={handleCreateTask} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Tasks"
            value={tasks.length.toString()}
            icon={<Calendar className="h-5 w-5" />}
            trend="+12%"
            className="animate-fade-in"
          />
          <StatsCard
            title="In Progress"
            value={tasks.filter(t => t.status === 'progress').length.toString()}
            icon={<Clock className="h-5 w-5 text-status-progress" />}
            trend="+5%"
            className="animate-fade-in [animation-delay:100ms]"
          />
          <StatsCard
            title="Completed"
            value={tasks.filter(t => t.status === 'done').length.toString()}
            icon={<CheckCircle className="h-5 w-5 text-status-done" />}
            trend="+8%"
            className="animate-fade-in [animation-delay:200ms]"
          />
          <StatsCard
            title="Team Members"
            value="12"
            icon={<Users className="h-5 w-5 text-accent" />}
            trend="+2"
            className="animate-fade-in [animation-delay:300ms]"
          />
        </div>

        {/* Filters and Search */}
        <Card className="mb-8 bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Task Management</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="border-status-todo text-status-todo">
                  {tasks.filter(t => t.status === 'todo').length} To Do
                </Badge>
                <Badge variant="outline" className="border-status-progress text-status-progress">
                  {tasks.filter(t => t.status === 'progress').length} In Progress
                </Badge>
                <Badge variant="outline" className="border-status-done text-status-done">
                  {tasks.filter(t => t.status === 'done').length} Done
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  className="whitespace-nowrap"
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "todo" ? "default" : "outline"}
                  onClick={() => setStatusFilter("todo")}
                  className="whitespace-nowrap"
                >
                  To Do
                </Button>
                <Button
                  variant={statusFilter === "progress" ? "default" : "outline"}
                  onClick={() => setStatusFilter("progress")}
                  className="whitespace-nowrap"
                >
                  In Progress
                </Button>
                <Button
                  variant={statusFilter === "done" ? "default" : "outline"}
                  onClick={() => setStatusFilter("done")}
                  className="whitespace-nowrap"
                >
                  Done
                </Button>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground">No tasks found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredTasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    className={`animate-slide-up [animation-delay:${index * 50}ms]`}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
