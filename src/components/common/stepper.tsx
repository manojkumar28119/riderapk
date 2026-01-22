"use client";

import { useEffect } from "react";

export interface StepTab {
  id: string;
  label: string;
  number: number;
}

interface StepperProps {
  tabs: StepTab[];
  activeTab: string;
  completedSteps: string[];
  onStepChange: (tabId: string) => void;
  useUrlParams?: boolean;
}

export const Stepper = ({
  tabs,
  activeTab,
  // completedSteps,
  onStepChange,
  useUrlParams = true,
}: StepperProps) => {
  // const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  useEffect(() => {
    if (!useUrlParams) return;

    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");

    if (tabParam) {
      const match = tabs.find((t) => t.id === tabParam);
      if (match && match.id !== activeTab) onStepChange(match.id);
    }
  }, []);

  useEffect(() => {
    if (!useUrlParams) return;

    const params = new URLSearchParams(window.location.search);
    params.set("tab", activeTab);
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
  }, [activeTab]);

  // Note: The following function is commented out to disable step accessibility based on completion.
  // You can uncomment it and modify as needed for your specific requirements.
  // const isStepAccessible = (index: number) => {
  //   const isCurrentStep = index === activeIndex;
  //   const isCompleted = completedSteps.includes(tabs[index].id);
  //   const currentStepCompleted = tabs[activeIndex] && completedSteps.includes(tabs[activeIndex].id);
    
  //   // Current step is always accessible
  //   if (isCurrentStep) return true;
    
  //   // Previous steps only accessible if current step is completed
  //   if (index < activeIndex) return currentStepCompleted;
    
  //   // Next step only accessible if current step is completed
  //   if (index === activeIndex + 1) return currentStepCompleted;
    
  //   // Other completed steps are accessible
  //   return isCompleted;
  // };

  return (
    <div className="w-full">
      <div className="relative flex items-center p-6">
        {tabs.map((tab, index) => (
          <div key={tab.id} className="flex items-center">
            <div
              // onClick={() => isStepAccessible(index) && onStepChange(tab.id)}
              // disabled={!isStepAccessible(index)}
              className="flex items-center gap-2.5 transition-all"
            >
              <div
                className={`relative w-7 h-7 rounded-full border flex items-center justify-center ${
                  activeTab === tab.id
                    ? "border-blue-600"
                    : "border-slate-300"
                }`}
              >
                {activeTab === tab.id ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                ) : (
                  <span className="text-grey-400 text-xs">
                    {String(tab.number).padStart(2, "0")}
                  </span>
                )}
              </div>

              <span
                className={`whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-brand-primary font-medium"
                    : "text-gray-400 font-medium"
                }`}
              >
                {tab.label}
              </span>
            </div>

            {index < tabs.length - 1 && (
              <div className="h-[1px] w-[100px] bg-slate-300 mx-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
