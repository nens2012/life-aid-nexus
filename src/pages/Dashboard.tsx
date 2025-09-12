import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Bell, 
  Stethoscope, 
  Clock, 
  TrendingUp,
  Heart,
  Activity,
  Calendar as CalendarIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/wellness-hero.jpg";

export default function Dashboard() {
  // Mock data - in real app would come from localStorage/API
  const nextPeriod = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // 5 days from now
  const lastScan = { result: "Low Risk", confidence: 85, date: "2 days ago" };
  const upcomingReminders = [
    { id: 1, title: "Morning Meditation", time: "9:00 AM", type: "wellness" },
    { id: 2, title: "Hydration Check", time: "2:00 PM", type: "health" },
    { id: 3, title: "Evening Walk", time: "6:00 PM", type: "exercise" }
  ];
  const nextAppointment = { 
    doctor: "Dr. Sarah Wilson", 
    date: "March 15, 2025", 
    time: "2:30 PM",
    specialty: "Gynecology"
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-primary text-white">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroImage} 
            alt="Wellness" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative px-8 py-12 md:py-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome back to WellnessWave
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-6">
              Your personal health companion for tracking, planning, and thriving.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/health-scanner">
                  <Stethoscope className="w-5 h-5" />
                  Health Scan
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Calendar className="w-5 h-5" />
                Log Period
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Next Period Prediction */}
        <Card className="shadow-soft hover:shadow-wellness transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Period</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {nextPeriod.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <p className="text-xs text-muted-foreground">
              In {Math.ceil((nextPeriod.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
            </p>
            <Button variant="wellness" size="sm" className="mt-3" asChild>
              <Link to="/period-tracker">View Tracker</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Health Scanner Result */}
        <Card className="shadow-soft hover:shadow-wellness transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Health Scan</CardTitle>
            <Activity className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                {lastScan.result}
              </Badge>
              <span className="text-sm text-muted-foreground">{lastScan.confidence}%</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{lastScan.date}</p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/health-scanner">New Scan</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Next Appointment */}
        <Card className="shadow-soft hover:shadow-wellness transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="font-semibold text-sm">{nextAppointment.doctor}</div>
              <div className="text-xs text-muted-foreground">{nextAppointment.specialty}</div>
              <div className="text-sm font-medium text-primary">
                {nextAppointment.date} at {nextAppointment.time}
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <Link to="/appointments">View All</Link>
            </Button>
          </CardContent>
        </Card>

      </div>

      {/* Today's Reminders */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Today's Wellness Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingReminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse-wellness"></div>
                  <div>
                    <h4 className="font-medium">{reminder.title}</h4>
                    <p className="text-sm text-muted-foreground">{reminder.time}</p>
                  </div>
                </div>
                <Badge variant="outline">
                  {reminder.type}
                </Badge>
              </div>
            ))}
          </div>
          <Button variant="wellness" className="w-full mt-4" asChild>
            <Link to="/planner">
              <CalendarIcon className="w-4 h-4" />
              Manage Reminders
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-6 shadow-soft">
          <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">28</div>
          <div className="text-sm text-muted-foreground">Avg Cycle</div>
        </Card>
        <Card className="text-center p-6 shadow-soft">
          <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
          <div className="text-2xl font-bold">94%</div>
          <div className="text-sm text-muted-foreground">Wellness Score</div>
        </Card>
        <Card className="text-center p-6 shadow-soft">
          <Activity className="w-8 h-8 text-warning mx-auto mb-2" />
          <div className="text-2xl font-bold">12</div>
          <div className="text-sm text-muted-foreground">Health Scans</div>
        </Card>
        <Card className="text-center p-6 shadow-soft">
          <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold">3</div>
          <div className="text-sm text-muted-foreground">Consultations</div>
        </Card>
      </div>
    </div>
  );
}