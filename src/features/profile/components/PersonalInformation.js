"use client"

import { useState, useEffect } from "react"
import { Button } from "../../../shared/ui/components/Button"
import { TextInput } from "../../../shared/ui/components/TextInput"
import { Card } from "../../../shared/ui/components/Card"
import { Alert } from "../../../shared/ui/components/Alert"
import { Icons } from "../../../shared/ui/components/Icons"
import { ProfileImageUpload } from "../../../shared/ui/components/ProfileImageUpload"
import axios from "axios"

export const PersonalInformation = ({ user, onUserUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    location: "",
    preferredSports: [],
    position: "",
    companyName: ""
  })
  const [profileImage, setProfileImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  useEffect(() => {
    if (user) {
      // Handle both preferredSports (array) and preferredSport (string) for backward compatibility
      let userSports = [];
      if (user.preferredSports && Array.isArray(user.preferredSports)) {
        userSports = user.preferredSports;
      } else if (user.preferredSport) {
        userSports = [user.preferredSport];
      }
      
      setFormData({
        fullName: user.fullName || "",
        location: user.location || "",
        preferredSports: userSports,
        position: user.position || "",
        companyName: user.companyName || ""
      })
      setProfileImage(user.profileImage || null)
    }
  }, [user])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear messages when user starts typing
    if (error) setError("")
    if (successMessage) setSuccessMessage("")
  }

  const handleImageUpdate = (newImage) => {
    setProfileImage(newImage)
    // Clear messages when image is updated
    if (error) setError("")
    if (successMessage) setSuccessMessage("")
  }

  const handleSportsChange = (sport) => {
    setFormData(prev => {
      const updatedSports = prev.preferredSports.includes(sport)
        ? prev.preferredSports.filter(s => s !== sport) // Remove if already selected
        : [...prev.preferredSports, sport] // Add if not selected
      
      return {
        ...prev,
        preferredSports: updatedSports,
        // Clear position if football is deselected
        position: updatedSports.includes('football') ? prev.position : ""
      }
    })
    // Clear messages when sports change
    if (error) setError("")
    if (successMessage) setSuccessMessage("")
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required")
      return false
    }
    
    // Player-specific validation
    if (user?.role === 'Player') {
      if (!formData.preferredSports || formData.preferredSports.length === 0) {
        setError("At least one sport must be selected for players")
        return false
      }
      // Position is required for football players
      if (formData.preferredSports.includes('football') && !formData.position.trim()) {
        setError("Position is required when football is selected")
        return false
      }
    }
    
    return true
  }

  const handleSaveChanges = async () => {
    setError("")
    setSuccessMessage("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Authentication token not found. Please sign in again.")
        setIsLoading(false)
        return
      }

      // Prepare the data to send
      const updateData = {
        fullName: formData.fullName.trim(),
        location: formData.location.trim()
      }

      // Add role-specific fields
      if (user?.role === 'Player') {
        updateData.preferredSports = formData.preferredSports
        if (formData.position.trim()) {
          updateData.position = formData.position.trim()
        }
      } else if (user?.role === 'Manager') {
        if (formData.companyName.trim()) {
          updateData.companyName = formData.companyName.trim()
        }
      }

      // If profile image was updated, include it
      if (profileImage && profileImage !== user?.profileImage) {
        updateData.profileImage = profileImage
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/profile`,
        updateData,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json"
          }
        }
      )

      if (response.data.success) {
        const updatedUser = {
          ...user,
          ...updateData
        }

        // Update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser))

        // Call parent callback to update user state
        if (onUserUpdate) {
          onUserUpdate(updatedUser)
        }

        setSuccessMessage("Profile updated successfully!")
      } else {
        setError(response.data.msg || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      if (error.response?.data?.msg) {
        setError(error.response.data.msg)
      } else if (error.response?.status === 401) {
        setError("Authentication failed. Please sign in again.")
      } else {
        setError("Failed to update profile. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Alert Messages */}
      {error && <Alert type="error" message={error} className="mb-6" />}
      {successMessage && <Alert type="success" message={successMessage} className="mb-6" />}

      {/* Profile Image Section */}
      <Card variant="elevated">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-lg font-medium text-foreground">Profile Picture</h3>
          <p className="mt-1 text-sm text-muted-foreground">Upload and manage your profile picture.</p>
        </div>
        <div className="px-6 py-5">
          <ProfileImageUpload
            currentImage={profileImage}
            onImageUpdate={handleImageUpdate}
          />
        </div>
      </Card>

      {/* Personal Information Section */}
      <Card variant="elevated">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-lg font-medium text-foreground">Personal Information</h3>
          <p className="mt-1 text-sm text-muted-foreground">Update your personal details here.</p>
        </div>
        <div className="px-6 py-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="Full Name"
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="Enter your full name"
              disabled={isLoading}
              required
              icon={<Icons.User className="h-5 w-5" />}
            />
            <TextInput
              label="Location"
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="City, Country"
              disabled={isLoading}
              icon={<Icons.IdCard className="h-5 w-5" />}
            />
          </div>
          
          {/* Read-only fields for Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="Email Address"
              id="email"
              type="email"
              value={user?.email || ""}
              placeholder="Email address"
              disabled={true}
              icon={<Icons.Mail className="h-5 w-5" />}
              helpText="Email cannot be changed"
            />
            <TextInput
              label="Phone Number"
              id="phoneNumber"
              type="tel"
              value={user?.phoneNumber || ""}
              placeholder="Phone number"
              disabled={true}
              icon={<Icons.Phone className="h-5 w-5" />}
              helpText="Phone number cannot be changed"
            />
          </div>          {/* Player-specific fields */}
          {user?.role === 'Player' && (
            <div className="space-y-6">
              <h4 className="text-base font-medium text-foreground border-t border-border pt-6">Player Information</h4>
              
              <div className="grid grid-cols-1 gap-6">                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-300">
                      Preferred Sports *
                    </label>
                    <span className="text-xs text-gray-500">
                      {formData.preferredSports.length}/4 selected
                    </span>
                  </div>
                  
                  {/* Compact status summary */}
                  {(user?.preferredSports?.length > 0 || formData.preferredSports.length > 0) && (
                    <div className="mb-3 flex gap-3 text-xs">
                      {user?.preferredSports && user.preferredSports.length > 0 && (
                        <span className="text-green-400">
                          <span className="inline-block w-1 h-1 bg-green-500 rounded-full mr-1"></span>
                          Original: {user.preferredSports.join(', ')}
                        </span>
                      )}
                      {formData.preferredSports.length > 0 && (
                        <span className="text-blue-400">
                          <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mr-1"></span>
                          Current: {formData.preferredSports.join(', ')}
                        </span>
                      )}
                    </div>
                  )}                  {/* Sports selection grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-2">
                    {[
                      { value: "padel", label: "Padel", icon: "/assets/icons/padel-icon.png" },
                      { value: "football", label: "Football", icon: "/assets/icons/football-icon.png" },
                      { value: "basketball", label: "Basketball", icon: "/assets/icons/basketball-icon.png" },
                      { value: "tennis", label: "Tennis", icon: "/assets/icons/tennis-icon.png" },
                    ].map((sport) => {
                      const isSelected = formData.preferredSports.includes(sport.value);
                      const wasOriginallySelected = user?.preferredSports?.includes(sport.value);
                      return (
                        <button
                          key={sport.value}
                          type="button"
                          onClick={() => handleSportsChange(sport.value)}
                          disabled={isLoading}                          className={`
                            relative flex flex-col items-center p-2.5 rounded-lg text-sm font-medium transition-all duration-200 border min-h-[70px] group
                            ${isSelected 
                              ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-lg ring-2 ring-blue-500/30' 
                              : 'bg-gray-800/30 text-gray-400 border-gray-700/50 hover:bg-gray-700/30 hover:text-gray-300 hover:border-gray-600/50'
                            }
                            ${wasOriginallySelected && !isSelected ? 'ring-1 ring-yellow-500/30' : ''}
                          `}
                        >                          {/* Original signup indicator */}
                          {wasOriginallySelected && (
                            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-gray-900"></div>
                          )}
                          
                          {/* Sport icon and label */}
                          <img 
                            src={sport.icon} 
                            alt={sport.label}
                            className="w-5 h-5 mb-1.5 opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                          <span className="text-center leading-tight text-xs">{sport.label}</span>
                          
                          {/* Selection checkmark */}
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>                  {/* Simple legend */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                        <span>Original</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></div>
                        <span>Current</span>
                      </div>
                    </div>
                    <span>
                      {formData.preferredSports.length === 0 ? 'Select sports' : `${formData.preferredSports.length} selected`}
                    </span>
                  </div>
                </div>                {formData.preferredSports.includes('football') && (
                  <div className="p-3 rounded-lg bg-gray-800/15 border border-gray-700/30">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-300">
                        Football Position *
                      </label>
                      <span className="text-xs text-gray-500">
                        {formData.position ? '✓ Selected' : 'Choose one'}
                      </span>
                    </div>
                    
                    {/* Compact position status */}
                    {(user?.position || formData.position) && (
                      <div className="mb-2 flex gap-2 text-xs">
                        {user?.position && (
                          <span className="text-green-400">
                            <span className="inline-block w-1 h-1 bg-green-500 rounded-full mr-1"></span>
                            Original: {user.position}
                          </span>
                        )}
                        {formData.position && formData.position !== user?.position && (
                          <span className="text-blue-400">
                            <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mr-1"></span>
                            Current: {formData.position}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { value: "goalkeeper", label: "Goalkeeper", emoji: "🥅" },
                        { value: "defender", label: "Defender", emoji: "🛡️" },
                        { value: "midfielder", label: "Midfielder", emoji: "⚽" },
                        { value: "attacker", label: "Attacker", emoji: "🎯" },                      ].map((position) => {
                        const isSelected = formData.position === position.value;
                        const wasOriginallySelected = user?.position === position.value;
                        return (
                          <button
                            key={position.value}
                            type="button"
                            onClick={() => handleInputChange("position", position.value)}
                            disabled={isLoading}
                            className={`
                            relative flex flex-col items-center p-2 rounded-lg text-sm font-medium transition-all duration-200 border min-h-[45px]
                            ${isSelected 
                              ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-lg' 
                              : 'bg-gray-800/30 text-gray-400 border-gray-700/50 hover:bg-gray-700/30 hover:text-gray-300 hover:border-gray-600/50'
                            }
                          `}
                        >
                          {/* Original position indicator */}
                          {wasOriginallySelected && (
                            <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-500 rounded-full border border-gray-900"></div>
                          )}
                          
                          <span className="text-base mb-0.5">{position.emoji}</span>
                          <span className="text-center leading-tight text-xs">{position.label}</span>
                          
                          {/* Selection checkmark */}
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Manager-specific fields */}
          {user?.role === 'Manager' && (
            <div className="space-y-6">
              <h4 className="text-base font-medium text-foreground border-t border-border pt-6">Manager Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                  label="Company Name"
                  id="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="Enter your company name"
                  disabled={isLoading}
                  icon={<Icons.Settings className="h-5 w-5" />}
                />
                <TextInput
                  label="CIN"
                  id="cin"
                  type="text"
                  value={user?.cin || ""}
                  placeholder="Company identification number"
                  disabled={true}
                  icon={<Icons.IdCard className="h-5 w-5" />}
                  helpText="CIN cannot be changed"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button 
              variant="primary" 
              onClick={handleSaveChanges}
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
