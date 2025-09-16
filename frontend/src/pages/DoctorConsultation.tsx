import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  MessageCircle,
  Send,
  Calendar,
  Clock,
  User
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DoctorConsultation() {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "Dr. Sarah Wilson", content: "Hello! I'll be with you shortly.", timestamp: "2:30 PM" },
    { id: 2, sender: "You", content: "Thank you, I'm ready.", timestamp: "2:31 PM" }
  ]);

  const mockAppointment = {
    doctor: "Dr. Sarah Wilson",
    specialty: "Gynecology",
    date: "Today",
    time: "2:30 PM - 3:00 PM",
    status: "In Progress"
  };

  const startCall = () => {
    setIsCallActive(true);
  };

  const endCall = () => {
    setIsCallActive(false);
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      setMessages([
        ...messages,
        { 
          id: messages.length + 1, 
          sender: "You", 
          content: chatMessage, 
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }
      ]);
      setChatMessage("");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Video className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Doctor Consultation</h1>
          <p className="text-muted-foreground">Connect with healthcare professionals</p>
        </div>
      </div>

      {/* Appointment Info */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Appointment</span>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              {mockAppointment.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">{mockAppointment.doctor}</div>
                <div className="text-sm text-muted-foreground">{mockAppointment.specialty}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">{mockAppointment.date}</div>
                <div className="text-sm text-muted-foreground">Appointment Date</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">{mockAppointment.time}</div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isCallActive ? (
                <Button onClick={startCall} variant="wellness" className="w-full">
                  <Video className="w-4 h-4" />
                  Start Consultation
                </Button>
              ) : (
                <Button onClick={endCall} variant="destructive" className="w-full">
                  <Phone className="w-4 h-4" />
                  End Call
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Video Section */}
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle>Video Conference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Main Video Area */}
              <div className="aspect-video bg-gradient-calm rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                {isCallActive ? (
                  <div className="w-full h-full bg-gradient-primary/20 flex items-center justify-center">
                    <div className="text-center text-white">
                      <User className="w-24 h-24 mx-auto mb-4 opacity-80" />
                      <h3 className="text-xl font-semibold">Dr. Sarah Wilson</h3>
                      <p className="text-sm opacity-80">Connected</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Video consultation will appear here</p>
                    <p className="text-sm">Click "Start Consultation" to begin</p>
                  </div>
                )}
                
                {/* Self Video (Picture-in-Picture) */}
                {isCallActive && (
                  <div className="absolute bottom-4 right-4 w-32 h-24 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <User className="w-8 h-8 mx-auto text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">You</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  variant={isVideoOn ? "default" : "destructive"}
                  size="lg"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  disabled={!isCallActive}
                >
                  {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>
                <Button
                  variant={isAudioOn ? "default" : "destructive"}
                  size="lg"
                  onClick={() => setIsAudioOn(!isAudioOn)}
                  disabled={!isCallActive}
                >
                  {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Panel */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Messages */}
              <div className="h-80 overflow-y-auto space-y-3 border rounded-lg p-3 bg-muted/20">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-2 ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'You' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary'
                    }`}>
                      <div className="text-sm font-medium mb-1">{message.sender}</div>
                      <div className="text-sm">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">{message.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} size="icon" variant="wellness">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consultation Notes */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Consultation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-secondary/30 rounded-lg">
              <h4 className="font-semibold mb-2">Doctor's Notes</h4>
              <p className="text-sm text-muted-foreground">
                Notes from the consultation will appear here after the session ends. 
                This will include recommendations, prescriptions, and follow-up instructions.
              </p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <h4 className="font-semibold mb-2">Next Steps</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Follow-up appointment in 2 weeks</li>
                <li>• Lab tests as discussed</li>
                <li>• Continue current medication</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}