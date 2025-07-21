import { useState, useEffect } from "react";
import { Search, Plus, Filter, Menu, Bell, LogOut, User as UserIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskModal } from "@/components/CreateTaskModal";
import { StatsCard } from "@/components/StatsCard";
import { TeamCard } from "@/components/TeamCard";
import { TeamDetailsModal } from "@/components/TeamDetailsModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User, Session } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string;
  assignee: string;
  team: string;
}

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTeamModal, setSelectedTeamModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => {
            fetchTasks();
          }, 0);
        } else {
          window.location.href = "/auth";
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchTasks();
      } else {
        window.location.href = "/auth";
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedTasks: Task[] = data?.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        status: task.status as 'todo' | 'progress' | 'done',
        priority: task.priority as 'low' | 'medium' | 'high' | 'urgent',
        due_date: task.due_date || new Date().toISOString(),
        assignee: task.assignee,
        team: task.team,
      })) || [];
      
      setTasks(formattedTasks);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = "/auth";
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: 'todo' | 'progress' | 'done') => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));

      toast({
        title: "Success",
        description: "Task status updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.filter(task => task.id !== taskId));

      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    status: 'todo' | 'progress' | 'done';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate: string;
    assignee: string;
    team: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          due_date: taskData.dueDate,
          assignee: taskData.assignee,
          team: taskData.team,
          created_by: user?.id,
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newTask: Task = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          status: data.status as 'todo' | 'progress' | 'done',
          priority: data.priority as 'low' | 'medium' | 'high' | 'urgent',
          due_date: data.due_date,
          assignee: data.assignee,
          team: data.team,
        };
        setTasks([newTask, ...tasks]);
        toast({
          title: "Success",
          description: "Task created successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const todoTasks = filteredTasks.filter(task => task.status === "todo");
  const progressTasks = filteredTasks.filter(task => task.status === "progress");
  const doneTasks = filteredTasks.filter(task => task.status === "done");

  // Group tasks by team
  const teamGroups = tasks.reduce((acc, task) => {
    const teamName = task.team || 'Personal';
    if (!acc[teamName]) {
      acc[teamName] = [];
    }
    acc[teamName].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const teamStats = Object.entries(teamGroups).map(([teamName, teamTasks]) => ({
    teamName,
    totalTasks: teamTasks.length,
    todoTasks: teamTasks.filter(task => task.status === 'todo').length,
    progressTasks: teamTasks.filter(task => task.status === 'progress').length,
    doneTasks: teamTasks.filter(task => task.status === 'done').length,
    creators: [...new Set(teamTasks.map(task => task.assignee))].filter(Boolean),
  }));

  const selectedTeamTasks = selectedTeamModal ? (teamGroups[selectedTeamModal] || []) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              TaskForge
            </h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user?.email}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  <UserIcon className="mr-2 h-4 w-4" />
                  {user?.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Tasks"
            value={filteredTasks.length}
            description="Active tasks"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="To Do"
            value={todoTasks.length}
            description="Pending tasks"
            trend={{ value: 5, isPositive: false }}
          />
          <StatsCard
            title="In Progress"
            value={progressTasks.length}
            description="Active work"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Completed"
            value={doneTasks.length}
            description="Finished tasks"
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 border-border/50"
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-background/50 border-border/50">
                  <Filter className="mr-2 h-4 w-4" />
                  Status: {statusFilter === "all" ? "All" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border shadow-elegant">
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("todo")}>To Do</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("progress")}>In Progress</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("done")}>Done</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-background/50 border-border/50">
                  <Filter className="mr-2 h-4 w-4" />
                  Priority: {priorityFilter === "all" ? "All" : priorityFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border shadow-elegant">
                <DropdownMenuItem onClick={() => setPriorityFilter("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("low")}>Low</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>Medium</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("high")}>High</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("urgent")}>Urgent</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-primary hover:opacity-90 shadow-elegant"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-card border-border">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              All Tasks
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Teams
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No tasks found</p>
                <p className="text-muted-foreground text-sm mt-2">Create your first task to get started</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={{
                    ...task,
                    dueDate: task.due_date,
                  }}
                  onStatusChange={handleStatusChange}
                  onDeleteTask={handleDeleteTask}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            {teamStats.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No teams found</p>
                <p className="text-muted-foreground text-sm mt-2">Create tasks with team names to see teams here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamStats.map((team) => (
                  <TeamCard
                    key={team.teamName}
                    teamStats={team}
                    onClick={() => setSelectedTeamModal(team.teamName)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Task Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border shadow-elegant">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create New Task</DialogTitle>
          </DialogHeader>
          <CreateTaskModal 
            onCreateTask={(taskData) => {
              handleCreateTask(taskData);
              setIsCreateModalOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Team Details Modal */}
      <TeamDetailsModal
        isOpen={!!selectedTeamModal}
        onClose={() => setSelectedTeamModal(null)}
        teamName={selectedTeamModal || ''}
        tasks={selectedTeamTasks}
        onStatusChange={handleStatusChange}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}