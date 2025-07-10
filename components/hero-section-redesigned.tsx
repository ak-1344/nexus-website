"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Hexagon, Sparkles } from "lucide-react"
import { MainScene } from "@/components/main-scene"

interface PinnedEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
}

export function HeroSectionRedesigned() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isTouchingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [pinnedEvent, setPinnedEvent] = useState<PinnedEvent | null>(null)
  const [pinnedEvents, setPinnedEvents] = useState<PinnedEvent[]>([])
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Array<{
    left: string;
    top: string;
    animationDelay: string;
    animationDuration: string;
  }>>([]);
  const [mobileScrollProgress, setMobileScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Add mobile scroll progress tracking
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = window.innerHeight * 0.5;
      const progress = Math.min(scrollPosition / maxScroll, 1);
      setMobileScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Add the Nexus logo particle effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || isLoading) return

    const ctx = canvas.getContext('2d')
    if (!ctx || !canvas) return

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setIsMobile(window.innerWidth < 768)
    }

    updateCanvasSize()

    let particles: {
      x: number
      y: number
      baseX: number
      baseY: number
      size: number
      color: string
      scatteredColor: string
      life: number
    }[] = []

    let textImageData: ImageData | null = null

    function createTextImage() {
      if (!ctx || !canvas) return 0

      ctx.save()
      
      const logoHeight = isMobile ? 100 : 180
      const nexusWidth = logoHeight * 2
      const totalWidth = nexusWidth
      
      ctx.translate(canvas.width / 2 - totalWidth / 2, canvas.height / 2 - logoHeight / 2 - 100)

      // Draw NEXUS text in purple
      ctx.save()
      ctx.fillStyle = '#8B5CF6'
      ctx.font = `bold ${logoHeight * 0.8}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('NEXUS', nexusWidth / 2, logoHeight / 2)
      ctx.restore()

      // Draw tagline in white
      ctx.save()
      ctx.fillStyle = 'white'
      ctx.font = `${logoHeight * 0.3}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Innovate. Lead. Build.', nexusWidth / 2, logoHeight + logoHeight * 0.4)
      ctx.restore()

      ctx.restore()

      textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      return logoHeight / 100
    }

    function createParticle(scale: number) {
      if (!ctx || !canvas || !textImageData) return null

      const data = textImageData.data
      const particleGap = 2

      for (let attempt = 0; attempt < 100; attempt++) {
        const x = Math.floor(Math.random() * canvas.width)
        const y = Math.floor(Math.random() * canvas.height)

        if (data[(y * canvas.width + x) * 4 + 3] > 128) {
          // Check if the particle is in the tagline area (below NEXUS)
          const isTagline = y > canvas.height / 2 + 50 // Adjust this value based on your layout
          
          if (isTagline) {
            return {
              x: x,
              y: y,
              baseX: x,
              baseY: y,
              size: Math.random() * 1 + 0.5,
              color: 'white',
              scatteredColor: '#8B5CF6',
              life: Math.random() * 100 + 50
            }
          }

          // Calculate gradient color for NEXUS particles
          const gradientColors = ['#8b5cf6', '#a855f7', '#c084fc']
          const logoHeight = isMobile ? 100 : 180
          const nexusWidth = logoHeight * 2
          const startX = canvas.width / 2 - nexusWidth / 2
          const endX = startX + nexusWidth
          
          // Normalize position between 0 and 1
          const gradientPosition = Math.max(0, Math.min(1, (x - startX) / nexusWidth))
          
          // Get the two colors to interpolate between
          const colorIndex = Math.min(Math.floor(gradientPosition * 2), 1)
          const nextColorIndex = Math.min(colorIndex + 1, 2)
          const localPosition = (gradientPosition * 2) % 1
          
          const nexusColor = interpolateColor(
            gradientColors[colorIndex],
            gradientColors[nextColorIndex],
            localPosition
          )
          
          return {
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            size: Math.random() * 1 + 0.5,
            color: nexusColor,
            scatteredColor: '#8B5CF6',
            life: Math.random() * 100 + 50
          }
        }
      }

      return null
    }

    // Helper function to interpolate between two colors
    function interpolateColor(color1: string, color2: string, factor: number) {
      const hex1 = color1.replace('#', '')
      const hex2 = color2.replace('#', '')
      
      const r1 = parseInt(hex1.substring(0, 2), 16)
      const g1 = parseInt(hex1.substring(2, 4), 16)
      const b1 = parseInt(hex1.substring(4, 6), 16)
      
      const r2 = parseInt(hex2.substring(0, 2), 16)
      const g2 = parseInt(hex2.substring(2, 4), 16)
      const b2 = parseInt(hex2.substring(4, 6), 16)
      
      const r = Math.round(r1 + (r2 - r1) * factor)
      const g = Math.round(g1 + (g2 - g1) * factor)
      const b = Math.round(b1 + (b2 - b1) * factor)
      
      return `rgb(${r}, ${g}, ${b})`
    }

    function createInitialParticles(scale: number) {
      if (!canvas) return
      const baseParticleCount = 12000
      const particleCount = Math.floor(baseParticleCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)))
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle(scale)
        if (particle) particles.push(particle)
      }
    }

    let animationFrameId: number

    function animate(scale: number) {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const { x: mouseX, y: mouseY } = mousePositionRef.current
      const maxDistance = 120

      // Add initial animation progress
      const initialAnimationProgress = Math.min(1, (Date.now() - animationStartTime) / 1000)
      const easeOutProgress = 1 - Math.pow(1 - initialAnimationProgress, 3) // Cubic ease-out

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Apply initial animation
        const initialX = p.baseX + (Math.random() - 0.5) * 1000
        const initialY = p.baseY + (Math.random() - 0.5) * 1000
        const currentX = p.baseX + (initialX - p.baseX) * (1 - easeOutProgress)
        const currentY = p.baseY + (initialY - p.baseY) * (1 - easeOutProgress)

        if (distance < maxDistance && (isTouchingRef.current || !('ontouchstart' in window))) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)
          const moveX = Math.cos(angle) * force * 60
          const moveY = Math.sin(angle) * force * 60
          p.x = currentX - moveX
          p.y = currentY - moveY
          
          ctx.fillStyle = p.scatteredColor
        } else {
          p.x += (currentX - p.x) * 0.1
          p.y += (currentY - p.y) * 0.1
          ctx.fillStyle = p.color
        }

        ctx.fillRect(p.x, p.y, p.size, p.size)

        p.life--
        if (p.life <= 0) {
          const newParticle = createParticle(scale)
          if (newParticle) {
            particles[i] = newParticle
          } else {
            particles.splice(i, 1)
            i--
          }
        }
      }

      const baseParticleCount = 12000
      const targetParticleCount = Math.floor(baseParticleCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)))
      while (particles.length < targetParticleCount) {
        const newParticle = createParticle(scale)
        if (newParticle) particles.push(newParticle)
      }

      animationFrameId = requestAnimationFrame(() => animate(scale))
    }

    const scale = createTextImage()
    if (!canvas) return
    const animationStartTime = Date.now() // Add this line to track animation start time
    createInitialParticles(scale)
    animate(scale)

    const handleResize = () => {
      updateCanvasSize()
      const newScale = createTextImage()
      particles = []
      createInitialParticles(newScale)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isMobile, isLoading])

  // Update the mouse move effect to handle both cursor glow and particle effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      
      setMousePosition({ x: e.clientX, y: e.clientY });
      mousePositionRef.current = { x, y };
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const touch = e.touches[0];
        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;
        
        setMousePosition({ x: touch.clientX, y: touch.clientY });
        mousePositionRef.current = { x, y };
      }
    }

    const handleTouchStart = () => {
      isTouchingRef.current = true
    }

    const handleTouchEnd = () => {
      isTouchingRef.current = false
      setMousePosition({ x: 0, y: 0 })
      mousePositionRef.current = { x: 0, y: 0 }
    }

    const handleMouseLeave = () => {
      if (!('ontouchstart' in window)) {
        setMousePosition({ x: 0, y: 0 })
        mousePositionRef.current = { x: 0, y: 0 }
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchend", handleTouchEnd)
    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  const fetchPinnedEvents = async () =>{
    try {
      const response = await fetch('api/events?isPinned=TRUE')
      const res = await response.json()
      if (response.ok) { setPinnedEvent(res.data)}
    } catch (error) {
      console.error("Error fetching pinned events:", error)
    }
  }
  // Mock pinned event
  useEffect(() => {
    const mockPinnedEvent: PinnedEvent = {
      id: "1",
      title: "Annual Tech Symposium 2024",
      description: "Join us for our biggest technical event featuring industry experts and innovation showcases.",
      date: "2024-12-25",
      time: "10:00 AM",
    }

/*     fetchPinnedEvents() */
    const eventDate = new Date(`${mockPinnedEvent.date} ${mockPinnedEvent.time}`)
    if (eventDate > new Date()) {
      setPinnedEvent(mockPinnedEvent)
    }
  }, [])

  // Countdown timer
  useEffect(() => {
    if (!pinnedEvent) return

    const timer = setInterval(() => {
      const eventDate = new Date(`${pinnedEvent.date} ${pinnedEvent.time}`)
      const now = new Date()
      const difference = eventDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft(null)
        setPinnedEvent(null)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [pinnedEvent])

  // Generate particles in useEffect
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 6}s`,
      animationDuration: `${4 + Math.random() * 4}s`,
    }));
    setParticles(newParticles);
  }, []);

  // Add loading state effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Match the loading screen duration

    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-purple-900/20 to-black z-10"
      style={{ opacity }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ opacity: isMobile ? 0.6 : 0.8 }}
      />
      
      <motion.div
        className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 text-center"
        style={{ y }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={!isLoading ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          {isMobile ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={!isLoading ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col items-center gap-4 mt-32"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full" />
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white relative z-10 w-48"
                >
                  Join Us
                </Button>
              </motion.div>
              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 w-48"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={!isLoading ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-4 mt-72"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Join Us
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </motion.div>
          )}
        </motion.div>

        {pinnedEvent && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={!isLoading ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className={`absolute ${isMobile ? 'bottom-4' : 'bottom-8'} left-1/2 -translate-x-1/2 w-full max-w-md px-4`}
          >
            <motion.div
              animate={isMobile ? {
                scale: [1, 1.02, 1],
                y: [0, -5, 0],
              } : {}}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-semibold text-white mb-2">{pinnedEvent.title}</h3>
              <p className="text-white/80 mb-4">{pinnedEvent.description}</p>
              <div className="flex items-center gap-4 text-white/60">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{pinnedEvent.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{pinnedEvent.time}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={!isLoading ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className={`absolute ${isMobile ? 'bottom-4' : 'bottom-8'} left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/60`}
      >
        <motion.span
          animate={isMobile ? {
            opacity: [0.6, 1, 0.6],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Scroll to explore
        </motion.span>
        <motion.div
          animate={isMobile ? {
            y: [0, 15, 0],
            scale: [1, 1.2, 1],
          } : {
            y: [0, 10, 0],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ↓
        </motion.div>
      </motion.div>

      {/* Mobile-specific floating elements */}
      {isMobile && (
        <>
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-8 text-purple-400/30"
          >
            <Hexagon size={24} />
          </motion.div>
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-40 right-8 text-pink-400/30"
          >
            <Sparkles size={24} />
          </motion.div>
        </>
      )}
    </motion.div>
  )
}
