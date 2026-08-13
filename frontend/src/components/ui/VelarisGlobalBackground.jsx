import React from "react";
import Velaris from "@/components/ui/velaris";

export const VelarisGlobalBackground = ({
  bg = "#070d08",
  colors = ["#d49e35", "#10b981", "#059669", "#0b140c"],
  speed = 1.0,
  grain = 0.2,
  opacity = 0.25
}) => {
  return (
    <div 
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden transition-opacity duration-1000"
      style={{ opacity }}
      aria-hidden="true"
    >
      <Velaris
        bg={bg}
        colors={colors}
        speed={speed}
        grain={grain}
        height="100vh"
        className="w-full h-full"
      />
    </div>
  );
};

export default VelarisGlobalBackground;
