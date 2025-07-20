import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Task {
  title: string;
  description: string;
  status: 'todo' | 'progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  assignee: string;
  team: string;
}

interface CreateTaskModalProps {
  onCreateTask: (task: Task) => void;
}

export const CreateTaskModal = ({ onCreateTask }: CreateTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [status, setStatus] = useState<Task['status']>('todo');
  const [dueDate, setDueDate] = useState<Date>();
  const [assignee, setAssignee] = useState("");
  const [team, setTeam] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !dueDate) return;

    const newTask: Task = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      dueDate: dueDate.toISOString().split('T')[0],
      assignee: assignee.trim() || 'Unassigned',
      team: team.trim() || 'General'
    };

    onCreateTask(newTask);
    
    // Reset form
    setTitle("");
    setDescription("");
    setPriority('medium');
    setStatus('todo');
    setDueDate(undefined);
    setAssignee("");
    setTeam("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          required
          className="bg-background/50 border-border/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description..."
          rows={3}
          className="bg-background/50 border-border/50 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={(value: Task['priority']) => setPriority(value)}>
            <SelectTrigger className="bg-background/50 border-border/50">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border shadow-elegant">
              <SelectItem value="low" className="text-priority-low">Low</SelectItem>
              <SelectItem value="medium" className="text-priority-medium">Medium</SelectItem>
              <SelectItem value="high" className="text-priority-high">High</SelectItem>
              <SelectItem value="urgent" className="text-priority-urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(value: Task['status']) => setStatus(value)}>
            <SelectTrigger className="bg-background/50 border-border/50">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border shadow-elegant">
              <SelectItem value="todo" className="text-status-todo">To Do</SelectItem>
              <SelectItem value="progress" className="text-status-progress">In Progress</SelectItem>
              <SelectItem value="done" className="text-status-done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Due Date *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-background/50 border-border/50",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-card border-border shadow-elegant" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assignee">Assignee</Label>
          <Input
            id="assignee"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Assign to..."
            className="bg-background/50 border-border/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="team">Team</Label>
          <Input
            id="team"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            placeholder="Team name..."
            className="bg-background/50 border-border/50"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" className="bg-gradient-primary hover:opacity-90 shadow-elegant">
          Create Task
        </Button>
      </div>
    </form>
  );
};