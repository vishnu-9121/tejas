import React from "react";
import { Clock, Calendar, Video, MapPin, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../ui/Button";

export const ScheduleWidget = ({ schedule = [], deadlines = [] }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600" /> Academic Schedule
        </h3>
        <Link to="/events" className="text-primary-600 text-xs font-semibold hover:underline">View Events</Link>
      </div>

      <div className="space-y-4 flex-1">
        {schedule.length > 0 ? (
          schedule.map((item) => (
            <div key={item._id || item.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary-200 transition-colors group cursor-pointer relative overflow-hidden">
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
                <span className="px-2 py-1 bg-gray-200 text-gray-700 text-[10px] uppercase font-bold rounded-md">{item.type || 'Lecture'}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-400">
            <Calendar className="w-6 h-6 mx-auto mb-1 opacity-40" />
            <p className="text-xs">No scheduled sessions for today.</p>
          </div>
        )}
      </div>

      {deadlines.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" /> Upcoming Deadlines
          </h4>
          <div className="space-y-3">
            {deadlines.map((dl) => (
              <div key={dl._id || dl.id} className="flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-gray-900 leading-tight">{dl.title}</p>
                   <p className={`text-xs mt-0.5 font-semibold ${dl.urgency === 'high' ? 'text-red-500' : 'text-amber-500'}`}>{dl.due}</p>
                 </div>
                 <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs px-3">Submit</Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
