"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

const mockAds = [
  {
    id: "ad_1",
    title: "Student Banking Made Easy",
    description: "Open a UK student account with no monthly fees. Perfect for international students.",
    imageUrl: "/uk-student-banking-ad.png",
    link: "#",
    backgroundColor: "bg-blue-50",
    textColor: "text-blue-900",
  },
  {
    id: "ad_2",
    title: "International Student Insurance",
    description: "Comprehensive health insurance coverage for students studying abroad in the UK and South Africa.",
    imageUrl: "/placeholder-h7vnl.png",
    link: "#",
    backgroundColor: "bg-green-50",
    textColor: "text-green-900",
  },
  {
    id: "ad_3",
    title: "Study Abroad Scholarships",
    description: "Apply for scholarships and grants to support your education in the UK and South Africa.",
    imageUrl: "/education-scholarship-advertisement.png",
    link: "#",
    backgroundColor: "bg-purple-50",
    textColor: "text-purple-900",
  },
]

export function AdsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockAds.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])



  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const currentAd = mockAds[currentIndex]

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <div className={cn("p-4 sm:p-6 transition-colors duration-300", currentAd.backgroundColor)}>
            <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6">
              <div className="flex-1 space-y-3 sm:space-y-4 text-center lg:text-left">
                <h3 className={cn("text-xl sm:text-2xl font-bold", currentAd.textColor)}>{currentAd.title}</h3>
                <p className={cn("text-sm opacity-80", currentAd.textColor)}>{currentAd.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("border-current h-10 sm:h-9 px-4 sm:px-3 text-sm", currentAd.textColor)}
                  onClick={() => window.open(currentAd.link, "_blank")}
                >
                  Learn More
                  <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              </div>
              <div className="flex-shrink-0 w-full lg:w-auto">
                <img
                  src={currentAd.imageUrl || "/placeholder.svg"}
                  alt={currentAd.title}
                  className="w-full lg:w-64 h-32 sm:h-36 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>



          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3 sm:space-x-2">
            {mockAds.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-3 h-3 sm:w-2 sm:h-2 rounded-full transition-colors touch-manipulation",
                  index === currentIndex ? "bg-white" : "bg-white/50",
                )}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
