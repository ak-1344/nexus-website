"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail } from "lucide-react"
import Image from "next/image"

interface TeamMember {
  id: string
  name: string
  role: string
  year: string
  photo: string
  bio?: string
  linkedin?: string
  github?: string
  email?: string
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [selectedYear, setSelectedYear] = useState<string>("2024-25")
  const [availableYears] = useState(["2024-25", "2023-24", "2022-23"])

  useEffect(() => {
    // Mock data - in real app, fetch from API based on selected year
    const mockTeamMembers: TeamMember[] = [
      {
        id: "1",
        name: "Alex Johnson",
        role: "President",
        year: "2024-25",
        photo: "/placeholder.svg?height=300&width=300",
        bio: "Computer Science senior passionate about AI and machine learning.",
        linkedin: "https://linkedin.com/in/alexjohnson",
        github: "https://github.com/alexjohnson",
        email: "alex@nexusclub.edu",
      },
      {
        id: "2",
        name: "Sarah Chen",
        role: "Vice President",
        year: "2024-25",
        photo: "/placeholder.svg?height=300&width=300",
        bio: "Software Engineering student with expertise in full-stack development.",
        linkedin: "https://linkedin.com/in/sarahchen",
        github: "https://github.com/sarahchen",
      },
      {
        id: "3",
        name: "Michael Rodriguez",
        role: "Technical Lead",
        year: "2024-25",
        photo: "/placeholder.svg?height=300&width=300",
        bio: "Cybersecurity enthusiast and competitive programmer.",
        github: "https://github.com/mrodriguez",
      },
      {
        id: "4",
        name: "Emily Davis",
        role: "Events Coordinator",
        year: "2024-25",
        photo: "/placeholder.svg?height=300&width=300",
        bio: "Data Science major with a passion for organizing tech events.",
        linkedin: "https://linkedin.com/in/emilydavis",
      },
      {
        id: "5",
        name: "David Kim",
        role: "Marketing Head",
        year: "2024-25",
        photo: "/placeholder.svg?height=300&width=300",
        bio: "Business Technology student focused on tech marketing and outreach.",
        linkedin: "https://linkedin.com/in/davidkim",
      },
      {
        id: "6",
        name: "Lisa Wang",
        role: "Treasurer",
        year: "2024-25",
        photo: "/placeholder.svg?height=300&width=300",
        bio: "Finance and Technology double major managing club resources.",
        email: "lisa@nexusclub.edu",
      },
    ]

    // Filter by selected year
    const filteredMembers = mockTeamMembers.filter((member) => member.year === selectedYear)
    setTeamMembers(filteredMembers)
  }, [selectedYear])

  const getRoleColor = (role: string) => {
    const roleColors: { [key: string]: string } = {
      President: "bg-red-500/10 text-red-500 border-red-500/20",
      "Vice President": "bg-orange-500/10 text-orange-500 border-orange-500/20",
      "Technical Lead": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "Events Coordinator": "bg-green-500/10 text-green-500 border-green-500/20",
      "Marketing Head": "bg-purple-500/10 text-purple-500 border-purple-500/20",
      Treasurer: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    }
    return roleColors[role] || "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Core Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Meet the dedicated individuals leading Nexus Club towards innovation and excellence
          </p>

          <div className="flex justify-center">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card
              key={member.id}
              className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border overflow-hidden"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={member.photo || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="mb-3">
                  <Badge variant="outline" className={getRoleColor(member.role)}>
                    {member.role}
                  </Badge>
                </div>

                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{member.name}</h3>

                {member.bio && <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>}

                <div className="flex gap-2">
                  {member.linkedin && (
                    <Button size="sm" variant="outline" className="p-2">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  )}
                  {member.github && (
                    <Button size="sm" variant="outline" className="p-2">
                      <Github className="h-4 w-4" />
                    </Button>
                  )}
                  {member.email && (
                    <Button size="sm" variant="outline" className="p-2">
                      <Mail className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {teamMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No team members found for the selected year.</p>
          </div>
        )}
      </div>
    </div>
  )
}