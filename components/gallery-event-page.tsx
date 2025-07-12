"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, X, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface GalleryPhoto {
  id: string
  url: string
  caption?: string
  photographer?: string
}

interface GalleryEvent {
  id: string
  title: string
  date: string
  description?: string
  eventId?: string
  photos: GalleryPhoto[]
}

interface GalleryEventPageProps {
  galleryId: string
}

export function GalleryEventPage({ galleryId }: GalleryEventPageProps) {
  const [gallery, setGallery] = useState<GalleryEvent | null>(null)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  useEffect(() => {
    // Mock data - in real app, fetch from API based on galleryId
    const mockGalleries: { [key: string]: GalleryEvent } = {
      "1": {
        id: "1",
        title: "Annual Hackathon 2023",
        date: "2023-11-15",
        description: "Capturing the energy and innovation of our biggest coding event of the year.",
        eventId: "1",
        photos: [
          {
            id: "1",
            url: "/placeholder.svg?height=600&width=800",
            caption: "Opening ceremony with keynote speaker",
            photographer: "Alex Johnson",
          },
          {
            id: "2",
            url: "/placeholder.svg?height=600&width=800",
            caption: "Teams brainstorming innovative solutions",
          },
          {
            id: "3",
            url: "/placeholder.svg?height=600&width=800",
            caption: "Intense coding session during the night",
            photographer: "Sarah Chen",
          },
          {
            id: "4",
            url: "/placeholder.svg?height=600&width=800",
            caption: "Mentors providing guidance to participants",
          },
          {
            id: "5",
            url: "/placeholder.svg?height=600&width=800",
            caption: "Final presentations and judging",
            photographer: "Michael Rodriguez",
          },
          {
            id: "6",
            url: "/placeholder.svg?height=600&width=800",
            caption: "Winners celebrating with their trophies",
          },
          {
            id: "7",
            url: "/placeholder.svg?height=600&width=800",
            caption: "Networking session with industry professionals",
          },
          {
            id: "8",
            url: "/placeholder.svg?height=600&width=800",
            caption: "Team collaboration and problem-solving",
          },
        ],
      },
      "2": {
        id: "2",
        title: "Tech Talk Series",
        date: "2023-10-20",
        description: "Highlights from our engaging tech talk sessions with industry experts.",
        eventId: "2",
        photos: [
          {
            id: "9",
            url: "/placeholder.svg?height=600&width=800",
            caption: "AI expert discussing future trends",
            photographer: "Emily Davis",
          },
          {
            id: "10",
            url: "/placeholder.svg?height=600&width=800",
            caption: "Interactive Q&A session with the audience",
          },
          {
            id: "11",
            url: "/placeholder.svg?height=600&width=800",
            caption: "Students taking notes during the presentation",
          },
          {
            id: "12",
            url: "/placeholder.svg?height=600&width=800",
            caption: "Panel discussion on emerging technologies",
            photographer: "David Kim",
          },
        ],
      },
    } 

    setGallery(mockGalleries[galleryId] || null)
  }, [galleryId])

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index)
    setIsLightboxOpen(true)
  }

  const nextPhoto = () => {
    if (gallery) {
      setSelectedPhotoIndex((prev) => (prev === gallery.photos.length - 1 ? 0 : prev + 1))
    }
  }

  const prevPhoto = () => {
    if (gallery) {
      setSelectedPhotoIndex((prev) => (prev === 0 ? gallery.photos.length - 1 : prev - 1))
    }
  }

  if (!gallery) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Gallery Not Found</h1>
          <Link href="/publications">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Publications
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/publications">
            <Button variant="outline" size="sm" className="backdrop-panel border-primary/30">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Publications
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold gradient-text">{gallery.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="h-4 w-4" />
                <span>{new Date(gallery.date).toLocaleDateString()}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{gallery.photos.length} photos</span>
            </div>
            {gallery.description && <p className="text-gray-300 mt-2">{gallery.description}</p>}
          </div>
          {gallery.eventId && (
            <Link href={`/events/${gallery.eventId}`}>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                View Event Details
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.photos.map((photo, index) => (
            <Card
              key={photo.id}
              className="backdrop-panel border-primary/20 glow-hover cursor-pointer overflow-hidden"
              onClick={() => openLightbox(index)}
            >
              <div className="relative aspect-square">
                <Image
                  src={photo.url || "/placeholder.svg"}
                  alt={photo.caption || `Photo ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300" />
              </div>
              {photo.caption && (
                <CardContent className="p-3">
                  <p className="text-sm text-gray-300 line-clamp-2">{photo.caption}</p>
                  {photo.photographer && <p className="text-xs text-gray-500 mt-1">Photo by {photo.photographer}</p>}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Lightbox Modal */}
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
            <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={() => setIsLightboxOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={gallery.photos[selectedPhotoIndex]?.url || "/placeholder.svg"}
                  alt={gallery.photos[selectedPhotoIndex]?.caption || `Photo ${selectedPhotoIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              {gallery.photos.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={prevPhoto}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={nextPhoto}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Photo Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex justify-between items-end">
                  <div>
                    {gallery.photos[selectedPhotoIndex]?.caption && (
                      <h3 className="text-white font-medium mb-1">{gallery.photos[selectedPhotoIndex].caption}</h3>
                    )}
                    {gallery.photos[selectedPhotoIndex]?.photographer && (
                      <p className="text-gray-300 text-sm">
                        Photo by {gallery.photos[selectedPhotoIndex].photographer}
                      </p>
                    )}
                  </div>
                  <div className="text-white text-sm bg-black/50 px-3 py-1 rounded">
                    {selectedPhotoIndex + 1} / {gallery.photos.length}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
