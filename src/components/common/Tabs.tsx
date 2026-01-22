import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Tabs as TabsUI, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface TabItem {
  value: string
  label: string | React.ReactNode
  content?: React.ReactNode
  route?: string
}

interface TabsProps {
  tabs: TabItem[]
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
  useRouting?: boolean
}

export function Tabs({ tabs, defaultValue, onValueChange, className, useRouting = false }: TabsProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<string>(defaultValue || tabs[0]?.value || "")

  useEffect(() => {
    if (useRouting) {
      for (const tab of tabs) {
        if (tab.route && location.pathname === tab.route) {
          setActiveTab(tab.value)
          onValueChange?.(tab.value)
          break
        }
      }
    }
  }, [location.pathname, useRouting, tabs, onValueChange])

  const handleValueChange = (value: string) => {
    setActiveTab(value)

    if (useRouting) {
      const selectedTab = tabs.find((tab) => tab.value === value)
      if (selectedTab?.route) {
        navigate(selectedTab.route)
      }
    }
    onValueChange?.(value)
  }

  return (
    <TabsUI value={activeTab} onValueChange={handleValueChange} className={cn("w-full", className)}>
      <TabsList className="h-auto justify-start gap-8 border-b-2 bg-transparent p-0 rounded-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "relative h-auto rounded-none border-0 bg-transparent px-0 py-2 transition-colors",
                isActive ? "text-brand-primary" : "text-gray-400"
              )}
            >
              <span
                className={cn(
                  "absolute bottom-[-3px] left-0 right-0 h-0.5 transition-colors",
                  isActive && "bg-brand-primary"
                )}
              />
              {tab.label}
            </TabsTrigger>
          )
        })}
      </TabsList>

      {!useRouting &&
        tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="!mt-0 !h-full overflow-auto">
            {tab.content}
          </TabsContent>
        ))}
    </TabsUI>
  )
}
