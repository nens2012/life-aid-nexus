import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, TrendingUp, Circle } from "lucide-react";
import { format } from "date-fns";

interface PeriodLog {
  id: string;
  startDate: string;
  duration: number;
  notes?: string;
}

export default function PeriodTracker() {
  const [periodLogs, setPeriodLogs] = useState<PeriodLog[]>([]);
  const [newLog, setNewLog] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    duration: 5,
    notes: ''
  });

  // Load period logs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('periodLogs');
    if (saved) {
      setPeriodLogs(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever logs change
  useEffect(() => {
    localStorage.setItem('periodLogs', JSON.stringify(periodLogs));
  }, [periodLogs]);

  const addPeriodLog = () => {
    const log: PeriodLog = {
      id: Date.now().toString(),
      startDate: newLog.startDate,
      duration: newLog.duration,
      notes: newLog.notes
    };
    
    setPeriodLogs([log, ...periodLogs]);
    setNewLog({
      startDate: format(new Date(), 'yyyy-MM-dd'),
      duration: 5,
      notes: ''
    });
  };

  const calculateNextPeriod = () => {
    if (periodLogs.length < 2) return null;
    
    const recentLogs = periodLogs.slice(0, 3);
    const cycleLengths = [];
    
    for (let i = 0; i < recentLogs.length - 1; i++) {
      const current = new Date(recentLogs[i].startDate);
      const previous = new Date(recentLogs[i + 1].startDate);
      const cycleLength = Math.round((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
      cycleLengths.push(cycleLength);
    }
    
    const avgCycle = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length);
    const lastPeriod = new Date(periodLogs[0].startDate);
    const nextPeriod = new Date(lastPeriod.getTime() + avgCycle * 24 * 60 * 60 * 1000);
    
    return { nextPeriod, avgCycle };
  };

  const prediction = calculateNextPeriod();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Period Tracker</h1>
          <p className="text-muted-foreground">Track your cycle and get predictions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add New Period Log */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Log Period
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={newLog.startDate}
                onChange={(e) => setNewLog({...newLog, startDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="10"
                value={newLog.duration}
                onChange={(e) => setNewLog({...newLog, duration: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                placeholder="How are you feeling?"
                value={newLog.notes}
                onChange={(e) => setNewLog({...newLog, notes: e.target.value})}
              />
            </div>
            <Button onClick={addPeriodLog} className="w-full" variant="wellness">
              <Plus className="w-4 h-4" />
              Add Period
            </Button>
          </CardContent>
        </Card>

        {/* Cycle Prediction */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Cycle Prediction
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prediction ? (
              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-primary rounded-lg text-white">
                  <div className="text-2xl font-bold">
                    {format(prediction.nextPeriod, 'MMM dd')}
                  </div>
                  <div className="text-sm opacity-90">Next Expected Period</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-semibold text-primary">{prediction.avgCycle}</div>
                    <div className="text-xs text-muted-foreground">Avg Cycle Days</div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-success">{periodLogs.length}</div>
                    <div className="text-xs text-muted-foreground">Periods Logged</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Circle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Log at least 2 periods to see predictions</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Periods */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Recent Periods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {periodLogs.length > 0 ? (
                periodLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <div className="font-medium">
                        {format(new Date(log.startDate), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {log.duration} days
                      </div>
                    </div>
                    <Badge variant="outline">{log.duration}d</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No periods logged yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Period History Table */}
      {periodLogs.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Period History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Start Date</th>
                    <th className="text-left py-2">Duration</th>
                    <th className="text-left py-2">Cycle Length</th>
                    <th className="text-left py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {periodLogs.map((log, index) => {
                    const cycleLength = index < periodLogs.length - 1 
                      ? Math.round((new Date(log.startDate).getTime() - new Date(periodLogs[index + 1].startDate).getTime()) / (1000 * 60 * 60 * 24))
                      : null;
                    
                    return (
                      <tr key={log.id} className="border-b">
                        <td className="py-3">{format(new Date(log.startDate), 'MMM dd, yyyy')}</td>
                        <td className="py-3">{log.duration} days</td>
                        <td className="py-3">{cycleLength ? `${cycleLength} days` : '-'}</td>
                        <td className="py-3 text-muted-foreground">{log.notes || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}