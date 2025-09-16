import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CalendarDays, 
  Plus, 
  Edit, 
  Trash2, 
  Clock,
  Droplets,
  Moon,
  Dumbbell,
  Apple,
  Brain,
  Calendar
} from "lucide-react";
import { format } from "date-fns";

interface Reminder {
  id: string;
  title: string;
  type: 'exercise' | 'diet' | 'meditation' | 'sleep' | 'water' | 'other';
  date: string;
  time: string;
  notes: string;
  completed: boolean;
}

const reminderTypes = [
  { value: 'exercise', label: 'Exercise', icon: Dumbbell, color: 'bg-success' },
  { value: 'diet', label: 'Diet', icon: Apple, color: 'bg-warning' },
  { value: 'meditation', label: 'Meditation', icon: Brain, color: 'bg-accent' },
  { value: 'sleep', label: 'Sleep', icon: Moon, color: 'bg-primary' },
  { value: 'water', label: 'Water Intake', icon: Droplets, color: 'bg-blue-500' },
  { value: 'other', label: 'Other', icon: Clock, color: 'bg-muted' },
];

export default function WellnessPlanner() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'exercise' as Reminder['type'],
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    notes: ''
  });

  // Load reminders from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wellnessReminders');
    if (saved) {
      setReminders(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever reminders change
  useEffect(() => {
    localStorage.setItem('wellnessReminders', JSON.stringify(reminders));
  }, [reminders]);

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'exercise',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      notes: ''
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    const reminder: Reminder = {
      id: editingId || Date.now().toString(),
      ...formData,
      completed: false
    };

    if (editingId) {
      setReminders(prev => prev.map(r => r.id === editingId ? reminder : r));
    } else {
      setReminders(prev => [...prev, reminder]);
    }

    resetForm();
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const toggleComplete = (id: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  const editReminder = (reminder: Reminder) => {
    setFormData({
      title: reminder.title,
      type: reminder.type,
      date: reminder.date,
      time: reminder.time,
      notes: reminder.notes
    });
    setEditingId(reminder.id);
    setShowAddForm(true);
  };

  const getTodayReminders = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return reminders.filter(r => r.date === today);
  };

  const getUpcomingReminders = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return reminders
      .filter(r => r.date >= today)
      .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
      .slice(0, 5);
  };

  const getReminderTypeInfo = (type: Reminder['type']) => {
    return reminderTypes.find(t => t.value === type) || reminderTypes[0];
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Wellness Planner</h1>
            <p className="text-muted-foreground">Plan and track your wellness activities</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)} 
          variant="wellness"
        >
          <Plus className="w-4 h-4" />
          Add Reminder
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Add/Edit Reminder Form */}
        {showAddForm && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                {editingId ? 'Edit Reminder' : 'Add New Reminder'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Morning jog"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as Reminder['type']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reminderTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSubmit} 
                  disabled={!formData.title}
                  variant="wellness"
                  className="flex-1"
                >
                  {editingId ? 'Update' : 'Add'} Reminder
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Reminders */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Today's Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getTodayReminders().length > 0 ? (
                getTodayReminders().map((reminder) => {
                  const typeInfo = getReminderTypeInfo(reminder.type);
                  const Icon = typeInfo.icon;
                  
                  return (
                    <div 
                      key={reminder.id} 
                      className={`p-3 rounded-lg border transition-all duration-300 ${
                        reminder.completed ? 'bg-success/10 border-success/20' : 'bg-secondary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${typeInfo.color} text-white flex items-center justify-center`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${reminder.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {reminder.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{reminder.time}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant={reminder.completed ? "success" : "outline"}
                            onClick={() => toggleComplete(reminder.id)}
                          >
                            {reminder.completed ? 'Done' : 'Mark Done'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No activities for today</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Reminders */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              Upcoming Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getUpcomingReminders().length > 0 ? (
                getUpcomingReminders().map((reminder) => {
                  const typeInfo = getReminderTypeInfo(reminder.type);
                  const Icon = typeInfo.icon;
                  
                  return (
                    <div key={reminder.id} className="p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full ${typeInfo.color} text-white flex items-center justify-center`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{reminder.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(reminder.date), 'MMM dd')} at {reminder.time}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {typeInfo.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming activities</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Reminders List */}
      {reminders.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>All Wellness Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reminders
                .sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime())
                .map((reminder) => {
                  const typeInfo = getReminderTypeInfo(reminder.type);
                  const Icon = typeInfo.icon;
                  
                  return (
                    <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${typeInfo.color} text-white flex items-center justify-center`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className={`font-medium ${reminder.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {reminder.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(reminder.date), 'MMM dd, yyyy')} at {reminder.time}
                          </p>
                          {reminder.notes && (
                            <p className="text-xs text-muted-foreground mt-1">{reminder.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{typeInfo.label}</Badge>
                        <Button size="sm" variant="ghost" onClick={() => editReminder(reminder)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteReminder(reminder.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}