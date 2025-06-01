"use client"

import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const SettingsContext = createContext()

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    theme: "light",
    autoSave: true,
    notifications: true,
    recordingQuality: "high",
    autoTranscribe: true,
    language: "en",
    apiKey: "",
    backupEnabled: false,
    hapticFeedback: true,
    speechToText: true,
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem("app_settings")
      if (savedSettings) {
        setSettings({ ...settings, ...JSON.parse(savedSettings) })
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSetting = async (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value }
      setSettings(newSettings)
      await AsyncStorage.setItem("app_settings", JSON.stringify(newSettings))
    } catch (error) {
      console.error("Error saving setting:", error)
    }
  }

  const resetSettings = async () => {
    try {
      const defaultSettings = {
        theme: "light",
        autoSave: true,
        notifications: true,
        recordingQuality: "high",
        autoTranscribe: true,
        language: "en",
        apiKey: "",
        backupEnabled: false,
        hapticFeedback: true,
        speechToText: true,
      }
      setSettings(defaultSettings)
      await AsyncStorage.setItem("app_settings", JSON.stringify(defaultSettings))
    } catch (error) {
      console.error("Error resetting settings:", error)
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
