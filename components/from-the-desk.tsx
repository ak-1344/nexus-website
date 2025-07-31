"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Quote, PenTool } from "lucide-react"
import Image from "next/image"

export function FromTheDesk() {
  return (
    <section className="py-12 md:py-20 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* From the President's Desk */}
          <Card className="backdrop-panel border-primary/20 glow-effect">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <Quote className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                <h3 className="text-xl md:text-2xl font-bold gradient-text">From the President's Desk</h3>
              </div>

              <div className="flex items-start gap-4 md:gap-6">
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0">
                  <Image src="/placeholder.svg?height=80&width=80" alt="President" fill className="object-cover" />
                </div>

                <div className="flex-1">
                  <blockquote className="text-gray-300 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
                    "Welcome to Nexus Club! As we embark on another year of innovation and collaboration, I'm excited to
                    see our community grow stronger. Together, we're not just learning technology—we're shaping the
                    future of it."
                  </blockquote>

                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-white text-sm md:text-base">Aditya</p>
                      <p className="text-xs md:text-sm text-primary">President, Nexus Club</p>
                    </div>
                    <PenTool className="h-3 w-3 md:h-4 md:w-4 text-primary ml-auto" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* From the Board */}
          <Card className="backdrop-panel border-primary/20 glow-effect">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <Quote className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                <h3 className="text-xl md:text-2xl font-bold gradient-text">From the Board</h3>
              </div>

              <div className="space-y-4 md:space-y-6">
                <blockquote className="text-gray-300 leading-relaxed text-sm md:text-base">
                  "This year marks a new chapter for Nexus Club. With cutting-edge workshops, industry partnerships, and
                  innovative projects, we're committed to providing our members with unparalleled opportunities for
                  growth and learning."
                </blockquote>

                <div className="flex items-center gap-3 md:gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-primary/30"
                      >
                        <Image
                          src={`/placeholder.svg?height=40&width=40&text=${i}`}
                          alt={`Board member ${i}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm md:text-base">The Board</p>
                    <p className="text-xs md:text-sm text-primary">Nexus Club Leadership</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
