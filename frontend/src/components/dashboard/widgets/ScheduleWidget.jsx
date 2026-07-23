import React from "react";
import { Clock, Calendar, Video, MapPin, AlertCircle } from "lucide-react";
import { Button } from "../../ui/Button";

const mockSchedule = [
  { id: 1, title: "Advanced AI Ethics", time: "10:00 AM - 11:30 AM", type: "Lecture", location: "Room 402", isOnline: false },
  { id: 2, title: "Data Structures Lab", time: "1:00 PM - 3:00 PM", type: "Lab", location: "Zoom Link", isOnline: true },
];

const mockDeadlines = [
  { id: 1, title: "Machine Learning Final Project", due: "Today, 11:59 PM", urgency: "high" },
  { id: 2, title: "Ethics Essay Draft", due: "Tomorrow, 5:00 PM", urgency: "medium" },
];

export const ScheduleWidget = () => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600" /> Today's Schedule
        </h3>
        <Button variant="ghost" size="sm" className="text-primary-600 text-xs font-semibold">View Calendar</Button>
      </div>

      <div className="space-y-4 flex-1">
        {mockSchedule.map((item) => (
          <div key={item.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary-200 transition-colors group cursor-pointer relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-l-2xl"></div>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm group-hover:text-primary-700 transition-colors">{item.title}</h4>
                <div className="flex flex-col gap-1.5 mt-2 text-xs font-medium text-gray-500">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {item.time}</span>
                  <span className="flex items-center gap-1.5">
                    {item.isOnline ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />} 
                    {item.location}
                  </span>
                </div>
              </div>
              <span className="px-2 py-1 bg-gray-200 text-gray-700 text-[10px] uppercase font-bold rounded-md">{item.type}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500" /> Upcoming Deadlines
        </h4>
        <div className="space-y-3">
          {mockDeadlines.map((dl) => (
            <div key={dl.id} className="flex items-center justify-between">
               <div>
                 <p className="text-sm font-medium text-gray-900 leading-tight">{dl.title}</p>
                 <p className={`text-xs mt-0.5 font-semibold ${dl.urgency === 'high' ? 'text-red-500' : 'text-amber-500'}`}>{dl.due}</p>
               </div>
               <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs px-3">Submit</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
