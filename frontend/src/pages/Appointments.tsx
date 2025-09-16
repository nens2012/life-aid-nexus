import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Clock, 
  Plus, 
  User, 
  Stethoscope,
  MapPin,
  Phone,
  Video,
  Edit,
  Trash2
} from "lucide-react";
import { format, addDays } from "date-fns";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  availableSlots: string[];
}

interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'in-person' | 'video';
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
}

const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Wilson",
    specialty: "Gynecology",
    location: "Downtown Medical Center",
    rating: 4.9,
    availableSlots: ["09:00", "10:30", "14:00", "15:30"]
  },
  {
    id: "2", 
    name: "Dr. Emily Chen",
    specialty: "General Medicine",
    location: "City Health Clinic",
    rating: 4.8,
    availableSlots: ["08:30", "11:00", "13:30", "16:00"]
  },
  {
    id: "3",
    name: "Dr. Michael Rodriguez",
    specialty: "Dermatology", 
    location: "Skin Care Institute",
    rating: 4.7,
    availableSlots: ["09:30", "12:00", "14:30", "17:00"]
  }
];

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState<'in-person' | 'video'>('video');

  // Load appointments from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('appointments');
    if (saved) {
      setAppointments(JSON.parse(saved));
    } else {
      // Add some mock appointments
      const mockAppointments: Appointment[] = [
        {
          id: "1",
          doctorId: "1",
          doctorName: "Dr. Sarah Wilson",
          specialty: "Gynecology",
          date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
          time: "14:00",
          type: "video",
          status: "upcoming"
        },
        {
          id: "2",
          doctorId: "2", 
          doctorName: "Dr. Emily Chen",
          specialty: "General Medicine",
          date: format(addDays(new Date(), -5), 'yyyy-MM-dd'),
          time: "10:30",
          type: "in-person",
          status: "completed"
        }
      ];
      setAppointments(mockAppointments);
    }
  }, []);

  // Save to localStorage whenever appointments change
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  const bookAppointment = () => {
    const doctor = mockDoctors.find(d => d.id === selectedDoctor);
    if (!doctor || !selectedTime) return;

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      doctorId: selectedDoctor,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: selectedDate,
      time: selectedTime,
      type: appointmentType,
      status: 'upcoming'
    };

    setAppointments([...appointments, newAppointment]);
    setShowBookingForm(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedDoctor("");
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
    setSelectedTime("");
    setAppointmentType('video');
  };

  const cancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: 'cancelled' as const } : apt
    ));
  };

  const getUpcomingAppointments = () => {
    return appointments.filter(apt => apt.status === 'upcoming')
      .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());
  };

  const getPastAppointments = () => {
    return appointments.filter(apt => apt.status === 'completed' || apt.status === 'cancelled')
      .sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-primary/10 text-primary border-primary/20';
      case 'completed': return 'bg-success/10 text-success border-success/20';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Appointments</h1>
            <p className="text-muted-foreground">Manage your healthcare appointments</p>
          </div>
        </div>
        <Button onClick={() => setShowBookingForm(true)} variant="wellness">
          <Plus className="w-4 h-4" />
          Book Appointment
        </Button>
      </div>

      {/* Book New Appointment */}
      {showBookingForm && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Book New Appointment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Doctor Selection */}
            <div>
              <Label>Choose Doctor</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {mockDoctors.map((doctor) => (
                  <Card 
                    key={doctor.id}
                    className={`cursor-pointer transition-all ${
                      selectedDoctor === doctor.id ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedDoctor(doctor.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{doctor.name}</h4>
                          <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {doctor.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-warning">★</span>
                          <span>{doctor.rating}/5.0</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Date and Time Selection */}
            {selectedDoctor && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Available Times</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDoctors.find(d => d.id === selectedDoctor)?.availableSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Appointment Type</Label>
                  <Select value={appointmentType} onValueChange={(value) => setAppointmentType(value as 'in-person' | 'video')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Consultation</SelectItem>
                      <SelectItem value="in-person">In-Person Visit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={bookAppointment}
                disabled={!selectedDoctor || !selectedTime}
                variant="wellness"
              >
                Book Appointment
              </Button>
              <Button variant="outline" onClick={() => setShowBookingForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Appointments */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getUpcomingAppointments().length > 0 ? (
              getUpcomingAppointments().map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{appointment.doctorName}</h4>
                      <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm font-medium">
                          {format(new Date(appointment.date), 'MMM dd, yyyy')} at {appointment.time}
                        </span>
                        <Badge variant="outline" className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {appointment.type === 'video' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                          {appointment.type === 'video' ? 'Video Call' : 'In-Person'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => cancelAppointment(appointment.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No upcoming appointments</p>
                <Button variant="wellness" className="mt-4" onClick={() => setShowBookingForm(true)}>
                  Book Your First Appointment
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Past Appointments */}
      {getPastAppointments().length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Past Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getPastAppointments().map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg opacity-75">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">{appointment.doctorName}</h4>
                      <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                      <span className="text-sm">
                        {format(new Date(appointment.date), 'MMM dd, yyyy')} at {appointment.time}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}