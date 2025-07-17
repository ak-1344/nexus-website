"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, User } from "lucide-react"
import Image from "next/image"
import { previousDay } from "date-fns"

interface TeamMember {
  id: string
  name: string
  role: string
  department: string
  year: string
  photo: string
  bio?: string
  socialMedia?: { platform: string; url: string} []
}

// API request functions
async function fetchTeamMembers() {
  const res = await fetch("/api/teams")
  if (!res.ok) throw new Error("Failed to fetch team members")
  const { teams } = await res.json()
  return teams
}

async function addTeamMember(member: TeamMember) {
  const res = await fetch("/api/teams", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member),
  })
  if (!res.ok) throw new Error("Failed to add team member")
  return await res.json()
}

async function updateTeamMember(id: string, member: Partial<TeamMember>) {
  const res = await fetch(`/api/teams?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member),
  })
  if (!res.ok) throw new Error("Failed to update team member")
  return await res.json()
}

async function deleteTeamMember(id: string) {
  const res = await fetch(`/api/teams?id=${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to delete team member")
  return await res.json()
}


export function TeamManager() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [selectedYear, setSelectedYear] = useState("2024-25")
  const [formData, setFormData] = useState<{
    name: string
    role: string
    department: string
    year: string
    photo: string
    bio: string
    socialMedia: { platform: string; url: string }[]
  }>({
    name: "",
    role: "",
    department: "",
    year: "2024-25",
    photo: "",
    bio: "",
    socialMedia: []
  })
  const { toast } = useToast()

  const availableYears = ["2024-25", "2023-24", "2022-23"]
/*   const availableRoles = [
    "President",
    "Vice President",
    "Technical Lead",
    "Events Coordinator",
    "Marketing Head",
    "Treasurer",
    "Secretary",
    "Member",
  ] */

  const availableDepts = [
    "Board Members",
    "Management",
    "Tech Leads",
    "Frontend",
    "Backend",
    "AI/ML",
    "Design Team",
    "Social Media Team"
  ]

  useEffect(() => {
    // Mock data - in real app, fetch from API
/*     const mockTeamMembers: TeamMember[] = [
      {
        id: "1",
        name: "Alex Johnson",
        role: "President",
        year: "2024-25",
        photo: "/placeholder.svg?height=300&width=300",
        bio: "Computer Science senior passionate about AI and machine learning.",
        department: ""
      },
      {
        id: "2",
        name: "Sarah Chen",
        role: "Vice President",
        year: "2024-25",
        photo: "/placeholder.svg?height=300&width=300",
        bio: "Software Engineering student with expertise in full-stack development.",
        department: ""
      },
    ]
    setTeamMembers(mockTeamMembers) */
    fetchTeamMembers()
    .then(setTeamMembers)
    .catch((err) => toast({ title: "Error fetching team members", description: err.message}))
  }, [])

  const filteredMembers = teamMembers.filter((member) => member.year === selectedYear)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingMember) {
        await updateTeamMember(editingMember.id, formData)
        toast({ title: "Team member updated successfully" })
      } else {
        await addTeamMember({
          id: crypto.randomUUID(),
          ...formData})
        toast({ title: "Team member added successfully" })
      }
      const updatedMembers = await fetchTeamMembers()
      setTeamMembers(updatedMembers)
      resetForm()
    } catch (err: any) {
      toast({ title: "Error", description: err.message})
      console.error(err.message)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      department: "",
      role: "",
      year: "2024-25",
      photo: "",
      bio: "",
      socialMedia: [],
    })
    setEditingMember(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      role: member.role,
      department: member.department,
      year: member.year,
      photo: member.photo,
      bio: member.bio || "",
      socialMedia: member.socialMedia ?? [],
    })
    setIsDialogOpen(true)
  }

  const deleteImage = async (url: string | undefined) => {
    if (!url) return
    const filePath = url.split("/").pop()
    try {
      await fetch(`/api/teams/delete-image?file=${filePath}`, {
        method: "DELETE",
      })
    } catch (err) {
      console.error("Failed to delete image", err)
    }
  }

  const handleDelete = async (memberId: string) => {
    try {
      await deleteTeamMember(memberId)
      toast({ title: "Team member removed successfully" })
      const updatedMembers = await fetchTeamMembers()
      setTeamMembers(updatedMembers)
    } catch (err: any) {
      toast({ title: "Error", description: err.message})
      console.error(err.message)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    await deleteImage(formData.photo)

    const formDataUpload = new FormData()
    formDataUpload.append("file", file)
    try {
      const response = await fetch("/api/teams/upload-image", {
        method: "POST",
        body: formDataUpload,
      })
      const data = await response.json()
      if (data.url) {
        setFormData((prev) => ({ ...prev, photo: data.url }))
      }
    } catch (error) {
      console.error("Image upload failed:", error)
      toast({ title: "Failed to upload image", variant: "destructive" })
    }    
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Team Manager</h2>
          <p className="text-muted-foreground">Manage core team members by year</p>
        </div>
        <div className="flex gap-4">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingMember(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>{editingMember ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
                <DialogDescription>
                  {editingMember ? "Update member details" : "Add a new member to the core team"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
                <div className="space-y-4 overflow-y-auto pr-4 pl-2 scrollbar-gutter-stable custom-scroll flex-grow">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                        placeholder="Full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDepts.map((department) => (
                            <SelectItem key={department} value={department}>
                              {department}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year *</Label>
                      <Select
                        value={formData.year}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, year: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
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

                    <div className="space-y-2">
                      <Label htmlFor="photo">Photo URL</Label>
                      {formData.photo && (
                        <div className="relative w-full max-w-sm">
                          <img
                            src={formData.photo}
                            alt="Photo Preview"
                            className="w-full rounded shadow"
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              await deleteImage(formData.photo)
                              setFormData((prev) => ({ ...prev, photo: ""}))
                            }}
                          >
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                      )}
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>

                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                      placeholder="Role in department"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                      placeholder="Short bio or description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={formData.socialMedia.find(sm => sm.platform === "LinkedIn")?.url || ""}
                        onChange={(e) => {
                          const url = e.target.value
                          setFormData((prev) => {
                            const others = prev.socialMedia.filter(sm => sm.platform !== "LinkedIn")
                            return {
                              ...prev,
                              socialMedia: url 
                                ? [...others, {platform: "LinkedIn", url: url}]
                                : others,
                            }
                          })
                        }}
                        placeholder="LinkedIn profile URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        value={formData.socialMedia.find(sm => sm.platform === "GitHub")?.url || ""}
                        onChange={(e) => {
                          const url = e.target.value
                          setFormData((prev) => {
                            const others = prev.socialMedia.filter(sm => sm.platform !== "GitHub")
                            return {
                              ...prev,
                              socialMedia: url 
                                ? [...others, {platform: "GitHub", url: url}]
                                : others,
                            }
                          })
                        }}
                        placeholder="GitHub profile URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.socialMedia.find(sm => sm.platform === "Email")?.url || ""}
                        onChange={(e) => {
                          const url = e.target.value
                          setFormData((prev) => {
                            const others = prev.socialMedia.filter(sm => sm.platform !== "Email")
                            return {
                              ...prev,
                              socialMedia: url 
                                ? [...others, {platform: "Email", url: url}]
                                : others,
                            }
                          })
                        }}
                        placeholder="Email address"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingMember ? "Update Member" : "Add Member"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="border-border/50">
            <CardHeader className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                {member.photo ? (
                  <Image
                    src={member.photo || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardTitle className="text-lg">{member.name}</CardTitle>
              <CardDescription>{member.role}</CardDescription>
            </CardHeader>
            <CardContent>
              {member.bio && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{member.bio}</p>}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(member)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(member.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No team members found for {selectedYear}</p>
        </div>
      )}
    </div>
  )
}
