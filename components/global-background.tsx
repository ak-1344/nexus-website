"use client"

import { MainScene } from "@/components/main-scene"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Unlock } from "lucide-react"
import { usePathname } from "next/navigation"

export function GlobalBackground() {
  
  const [showHiddenContent, setShowHiddenContent] = useState(false)
  const pathname = usePathname()
  
  // Authentication state
  const [isLocked, setIsLocked] = useState(true)
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  useEffect(() => {
    if (pathname === "/debug-tools/system-analytics") {
      setShowHiddenContent(true)
    } else {
      setShowHiddenContent(false)
    }
  }, [pathname])
  
  const authenticate = () => {
    if (password === "danishbhai69") {
      setIsAuthenticated(true)
      setIsLocked(false)
    }
  }
  
  return (
    <>
      <div className="fixed inset-0 -z-20">
        <MainScene />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-none" />
      </div>
      
      <Dialog open={showHiddenContent} onOpenChange={setShowHiddenContent}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] h-[90vh] backdrop-panel border-primary/20 z-[70]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isLocked ? (
                <Lock className="h-5 w-5 text-primary" />
              ) : (
                <Unlock className="h-5 w-5 text-primary" />
              )}
              <span className="gradient-text">NEXT.JS SECURITY DEVKIT</span>
            </DialogTitle>
          </DialogHeader>
          
          {isLocked && !isAuthenticated ? (
            <div className="space-y-4 py-4">
              <p className="text-gray-300">FOR NEXT.JS SECUIRTY COMPLIANCE VERSION CONTROL</p>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter the next.js devkit key"
                />
              </div>
              <Button onClick={authenticate} className="w-full">Unlock</Button>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex-grow h-full min-h-[500px]">
                <iframe 
                  src="https://danishbhai69.vercel.app" 
                  className="w-full h-full border-0 rounded-md"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}