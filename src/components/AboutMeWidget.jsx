import React, { useState, useEffect, useRef } from "react"
import { Card, CardHeader, CardContent } from "./ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"
import { cn } from "../lib/utils"

const aboutText = `Hello! I'm Dave, your sales rep here from Salesforce. I've been working at this awesome company for 3 years now.`
const aboutMore = `I was born and raised in Albany, NY & have been living in Santa Carla for the past 10 years with my wife Tiffany and my 4-year-old twin daughters— Emma and Ella. Both of them are just starting school, so my calendar is usually blocked between 9–10 AM. This is a...`
const experiencesText = `• 2019–2021 — Account Executive at Company X
• 2017–2019 — Sales Associate at Company Y

Worked on large enterprise deals, built customer pipelines, and contributed to team training initiatives.`
const recommendedText = `Recommendations from colleagues and clients will appear here.`

export default function AboutMeWidget({ className = "" }) {
  const [activeTab, setActiveTab] = useState("about")
  const tabsListRef = useRef(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const update = () => {
      const list = tabsListRef.current
      if (!list) return
      const active = list.querySelector('[data-state="active"]')
      if (active) {
        setIndicator({ left: active.offsetLeft, width: active.offsetWidth })
      }
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [activeTab])

  return (
    <Card
      className={cn(
        "w-full max-w-full md:max-w-2xl h-80 md:h-280px] flex flex-col bg-[#1f2933] border-0 rounded-2xl p-4 md:p-8 text-gray-300 shadow-[inset_6px_6px_18px_rgba(0,0,0,0.6),inset_-6px_-6px_16px_rgba(255,255,255,0.02)]",
        className
      )}
    >
      <CardHeader className="shrink-0 p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            ref={tabsListRef}
            className="relative bg-[#12161a] rounded-2xl p-2 flex items-center gap-2 md:gap-4 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.6)]"
          >
            <div
              aria-hidden
              className="absolute top-1 bottom-1 rounded-xl bg-[#222831] transition-all duration-200 ease-out shadow-sm"
              style={{ left: indicator.left, width: indicator.width }}
            />
            <TabsTrigger
              value="about"
              className={cn(
                "px-4 md:px-6 py-2 md:py-3 rounded-xl text-xs md:text-sm font-medium relative z-10 text-gray-300 data-[state=active]:bg-[#222831] data-[state=active]:text-white hover:text-white"
              )}
            >
              About Me
            </TabsTrigger>
            <TabsTrigger
              value="exp"
              className={cn(
                "px-4 md:px-6 py-2 md:py-3 rounded-xl text-xs md:text-sm font-medium relative z-10 text-gray-300 data-[state=active]:bg-[#222831] data-[state=active]:text-white hover:text-white"
              )}
            >
              Experiences
            </TabsTrigger>
            <TabsTrigger
              value="rec"
              className={cn(
                "px-4 md:px-6 py-2 md:py-3 rounded-xl text-xs md:text-sm font-medium relative z-10 text-gray-300 data-[state=active]:bg-[#222831] data-[state=active]:text-white hover:text-white"
              )}
            >
              Recommended
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-2 md:pr-3 custom-scroll">
          <Tabs value={activeTab}>
            <TabsContent
              value="about"
              className="px-2 md:px-4 text-xs md:text-sm leading-6 md:leading-7 data-[state=inactive]:hidden"
            >
              <p className="text-[13px] md:text-[15px] mb-3">{aboutText}</p>
              <p className="text-[12px] md:text-[14px] text-gray-400">{aboutMore}</p>
              <p className="mt-4 text-[12px] md:text-[14px] text-gray-400">
                {aboutMore.repeat(3)}
              </p>
            </TabsContent>

            <TabsContent
              value="exp"
              className="p-2 md:p-4 text-xs md:text-sm leading-6 md:leading-7 data-[state=inactive]:hidden"
            >
              <pre className="whitespace-pre-wrap text-[12px] md:text-[14px]">{experiencesText}</pre>
            </TabsContent>

            <TabsContent
              value="rec"
              className="p-2 md:p-4 text-xs md:text-sm leading-6 md:leading-7 data-[state=inactive]:hidden"
            >
              <p className="text-[12px] md:text-[14px]">{recommendedText}</p>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
