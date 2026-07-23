import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScheduleWidget } from "../../../components/dashboard/widgets/ScheduleWidget";
import { ProgressWidget } from "../../../components/dashboard/widgets/ProgressWidget";
import { AnalyticsWidget } from "../../../components/dashboard/widgets/AnalyticsWidget";
import { ActivityTimelineWidget } from "../../../components/dashboard/widgets/ActivityTimelineWidget";
import { QuickActionsWidget } from "../../../components/dashboard/widgets/QuickActionsWidget";
import { LayoutDashboard, BookOpen, Target } from "lucide-react";
import { cn } from "../../../utils/cn";

export const ActiveLearnerView = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "OS Overview", icon: LayoutDashboard },
    { id: "academics", label: "Academics & Progress", icon: BookOpen },
    { id: "goals", label: "Goals & Analytics", icon: Target },
  ];

  return (
    <div className="space-y-8">
      {/* Dynamic Tabs (Notion Style) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "bg-gray-900 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/60"
            )}
          >
            <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-primary-400" : "text-gray-400")} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Area with Framer Motion AnimatePresence */}
      <div className="relative min-h-[600px]">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left Column (Main) */}
              <div className="lg:col-span-2 space-y-6">
                <ProgressWidget />
              </div>
              
              {/* Right Column (Sidebar Widgets) */}
              <div className="space-y-6">
                <ScheduleWidget />
                <QuickActionsWidget />
                <ActivityTimelineWidget />
              </div>
            </motion.div>
          )}

          {activeTab === "academics" && (
            <motion.div
              key="academics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <ProgressWidget />
              {/* Future Expansion: Assignments, Grades, Transcript */}
            </motion.div>
          )}

          {activeTab === "goals" && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-6"
            >
              <AnalyticsWidget />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <ActivityTimelineWidget />
                <QuickActionsWidget />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
