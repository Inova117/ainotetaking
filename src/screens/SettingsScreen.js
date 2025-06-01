 "use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useSettings } from "../context/SettingsContext"
import { useNotes } from "../context/NotesContext"
import * as Haptics from "expo-haptics"

const SettingsScreen = () => {
  const { settings, updateSetting, resetSettings } = useSettings()
  const { notes } = useNotes()
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const [tempApiKey, setTempApiKey] = useState(settings.apiKey || "")

  const handleToggleSetting = async (key, value) => {
    await updateSetting(key, value)
    if (settings.hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }

  const handleSaveApiKey = async () => {
    await updateSetting("apiKey", tempApiKey)
    setShowApiKeyInput(false)
    Alert.alert("Success", "API Key saved successfully")
  }

  const handleResetSettings = () => {
    Alert.alert("Reset Settings", "Are you sure you want to reset all settings to default?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          resetSettings()
          Alert.alert("Success", "Settings have been reset to default")
        },
      },
    ])
  }

  const handleExportData = () => {
    Alert.alert("Export Data", `Export ${notes.length} notes to file?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Export",
        onPress: () => {
          // Implementation for data export
          Alert.alert("Success", "Data exported successfully")
        },
      },
    ])
  }

  const SettingItem = ({ title, description, value, onValueChange, type = "switch", icon, options = [] }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#3B82F6" style={styles.settingIcon} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {description && <Text style={styles.settingDescription}>{description}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {type === "switch" && (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
            thumbColor={value ? "#fff" : "#f4f3f4"}
          />
        )}
        {type === "select" && (
          <TouchableOpacity style={styles.selectButton} onPress={() => showSelectOptions(options, onValueChange)}>
            <Text style={styles.selectText}>{value}</Text>
            <Ionicons name="chevron-down" size={16} color="#6B7280" />
          </TouchableOpacity>
        )}
        {type === "button" && (
          <TouchableOpacity style={styles.actionButton} onPress={onValueChange}>
            <Text style={styles.actionButtonText}>{value}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )

  const showSelectOptions = (options, onSelect) => {
    Alert.alert(
      "Select Option",
      "",
      options.map((option) => ({
        text: option.label,
        onPress: () => onSelect(option.value),
      })),
    )
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={["#3B82F6", "#1D4ED8"]} style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your AI Note Organizer experience</Text>
      </LinearGradient>

      {/* General Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>

        <SettingItem
          title="Theme"
          description="Choose your preferred theme"
          value={settings.theme}
          onValueChange={(value) => handleToggleSetting("theme", value)}
          type="select"
          icon="color-palette"
          options={[
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
            { label: "Auto", value: "auto" },
          ]}
        />

        <SettingItem
          title="Auto Save"
          description="Automatically save notes as you create them"
          value={settings.autoSave}
          onValueChange={(value) => handleToggleSetting("autoSave", value)}
          icon="save"
        />

        <SettingItem
          title="Haptic Feedback"
          description="Feel vibrations for interactions"
          value={settings.hapticFeedback}
          onValueChange={(value) => handleToggleSetting("hapticFeedback", value)}
          icon="phone-portrait"
        />

        <SettingItem
          title="Notifications"
          description="Receive reminders and updates"
          value={settings.notifications}
          onValueChange={(value) => handleToggleSetting("notifications", value)}
          icon="notifications"
        />
      </View>

      {/* Recording Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recording</Text>

        <SettingItem
          title="Recording Quality"
          description="Audio recording quality"
          value={settings.recordingQuality}
          onValueChange={(value) => handleToggleSetting("recordingQuality", value)}
          type="select"
          icon="mic"
          options={[
            { label: "High", value: "high" },
            { label: "Medium", value: "medium" },
            { label: "Low", value: "low" },
          ]}
        />

        <SettingItem
          title="Auto Transcribe"
          description="Automatically transcribe recordings"
          value={settings.autoTranscribe}
          onValueChange={(value) => handleToggleSetting("autoTranscribe", value)}
          icon="document-text"
        />

        <SettingItem
          title="Speech to Text"
          description="Enable voice-to-text features"
          value={settings.speechToText}
          onValueChange={(value) => handleToggleSetting("speechToText", value)}
          icon="chatbubble"
        />
      </View>

      {/* AI Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Configuration</Text>

        <SettingItem
          title="Language"
          description="AI processing language"
          value={settings.language}
          onValueChange={(value) => handleToggleSetting("language", value)}
          type="select"
          icon="language"
          options={[
            { label: "English", value: "en" },
            { label: "Spanish", value: "es" },
            { label: "French", value: "fr" },
            { label: "German", value: "de" },
          ]}
        />

        <TouchableOpacity style={styles.settingItem} onPress={() => setShowApiKeyInput(!showApiKeyInput)}>
          <View style={styles.settingLeft}>
            <Ionicons name="key" size={24} color="#3B82F6" style={styles.settingIcon} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>OpenAI API Key</Text>
              <Text style={styles.settingDescription}>
                {settings.apiKey ? "API Key configured" : "Configure your OpenAI API key"}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {showApiKeyInput && (
          <View style={styles.apiKeyContainer}>
            <TextInput
              style={styles.apiKeyInput}
              value={tempApiKey}
              onChangeText={setTempApiKey}
              placeholder="Enter your OpenAI API key"
              secureTextEntry
              autoCapitalize="none"
            />
            <View style={styles.apiKeyButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowApiKeyInput(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveApiKey}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Data & Privacy */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Privacy</Text>

        <SettingItem
          title="Backup Enabled"
          description="Backup notes to cloud storage"
          value={settings.backupEnabled}
          onValueChange={(value) => handleToggleSetting("backupEnabled", value)}
          icon="cloud"
        />

        <SettingItem
          title="Export Data"
          description="Export all notes and settings"
          value="Export"
          onValueChange={handleExportData}
          type="button"
          icon="download"
        />
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Information</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Total Notes</Text>
            <Text style={styles.infoValue}>{notes.length}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Storage Used</Text>
            <Text style={styles.infoValue}>~{(notes.length * 2.5).toFixed(1)} KB</Text>
          </View>
        </View>
      </View>

      {/* Reset Settings */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.resetButton} onPress={handleResetSettings}>
          <Ionicons name="refresh" size={20} color="#EF4444" />
          <Text style={styles.resetButtonText}>Reset All Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    padding: 20,
    paddingTop: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#E0E7FF",
    opacity: 0.9,
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  settingRight: {
    marginLeft: 12,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  selectText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  actionButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  apiKeyContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
  },
  apiKeyInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  apiKeyButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  infoContainer: {
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: "#374151",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  resetButtonText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomPadding: {
    height: 40,
  },
})

export default SettingsScreen
