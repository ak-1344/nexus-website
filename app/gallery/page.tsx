"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"

interface GalleryEvent {
  id: string
  title: string
  date: string
  bannerImage?: string
  gallery?: string[]
}

export default function GalleryPage() {
  const [galleryEvents, setGalleryEvents] = useState<GalleryEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<GalleryEvent | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const fetchEvents = async () => {
    try {
      const response = await fetch('api/events')
      const res = await response.json()
      if (response.ok) { 
        console.log("Fetched gallery events:", res.data)
        setGalleryEvents(res.data)
      }
    } catch (error) {
      console.error("Error fetching gallery events:", error)
    }
  }

  useEffect(() => {
    // Mock data - in real app, fetch from API
    // Fixed via performing API calls
/*     const mockGalleryEvents: GalleryEvent[] = [
      {
        id: "1",
        title: "Annual Hackathon 2023",
        date: "2023-11-15",
        coverImage: "/placeholder.svg?height=400&width=600",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
      },
      {
        id: "2",
        title: "Tech Talk: Future of AI",
        date: "2023-10-20",
        coverImage: "/placeholder.svg?height=400&width=600",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
      },
      {
        id: "3",
        title: "Web Development Bootcamp",
        date: "2023-09-10",
        coverImage: "/placeholder.svg?height=400&width=600",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
      },
    ] */
    fetchEvents()
    console.log("Updated gallery events:", galleryEvents)
    //setGalleryEvents(mockGalleryEvents)
  }, [])

  const openLightbox = (event: GalleryEvent, imageIndex = 0) => {
    setSelectedEvent(event)
    console.log("Opening lightbox for event:", selectedEvent)
    setCurrentImageIndex(imageIndex)
  }

  const closeLightbox = () => {
    setSelectedEvent(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (selectedEvent) {
      setCurrentImageIndex((prev) => {
        const galleryLength = selectedEvent.gallery?.length ?? 0
        return prev === galleryLength - 1 ? 0 : prev + 1
      })
    }
  }

  const prevImage = () => {
    if (selectedEvent) {
      setCurrentImageIndex((prev) => {
        const galleryLength = selectedEvent.gallery?.length ?? 0
        return prev === 0 ? galleryLength - 1 : prev - 1
      })
    }
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore moments captured from our events and activities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryEvents.map((event) => (
            <Card
              key={event.id}
              className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border overflow-hidden"
            >
              <div 
                className="relative h-64 overflow-hidden cursor-pointer" 
                onClick={() => {
                  openLightbox(event)
                  console.log("Clicked on event:", event)
                }}
              >
                <Image
                  src={event.bannerImage || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="secondary" size="sm">
                      View Gallery ({event.gallery?.length} photos)
                    </Button>
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">{event.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Lightbox Modal */}
        <Dialog 
          open={!!selectedEvent} 
          onOpenChange={(open) => !open && closeLightbox()}
        >
          <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
            {selectedEvent && (
              <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                  onClick={closeLightbox}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="relative w-full h-full">
                  <Image
                    src={selectedEvent.gallery?.[currentImageIndex] || "/placeholder.svg"}
                    alt={`${selectedEvent.title} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>

                {(selectedEvent.gallery?.length ?? 0) > 0 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded">
                      {currentImageIndex + 1} / {selectedEvent.gallery?.length}
                    </div>
                  </>
                )}

                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">{selectedEvent.title}</h3>
                  <p className="text-sm text-gray-300">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
