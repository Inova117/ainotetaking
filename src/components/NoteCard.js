 "use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import * as Haptics from "expo-haptics"
import * as Clipboard from "expo-clipboard"
import { useNotes } from "../context/NotesContext"
import { useSettings } from "../context/SettingsContext"

const NoteCard = ({ note, onPress, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { deleteNote, toggleFavorite, duplicateNote } = useNotes()
  const { settings } = useSettings()

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
    if (settings.hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }

  const handleDelete = () => {
    Alert.alert("Delete Note", `Are you sure you want to delete "${note.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteNote(note.id)
          if (settings.hapticFeedback) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          }
        },
      },
    ])
  }

  const handleFavorite = () => {
    toggleFavorite(note.id)
    if (settings.hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }

  const handleDuplicate = () => {
    duplicateNote(note.id)
    if (settings.hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
  }

  const handleCopyContent = async () => {
    await Clipboard.setStringAsync(note.content)
    Alert.alert("Copied", "Note content copied to clipboard")
    if (settings.hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case "work":
        return ["#3B82F6", "#1D4ED8"]
      case "personal":
        return ["#10B981", "#059669"]
      case "ideas":
        return ["#8B5CF6", "#7C3AED"]
      case "learning":
        return ["#F59E0B", "#D97706"]
      default:
        return ["#6B7280", "#4B5563"]
    }
  }

  const formatDate = (date) => {
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={handleToggleExpand} activeOpacity={0.7}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title} numberOfLines={isExpanded ? undefined : 2}>
              {note.title}
            </Text>
            <View style={styles.metadata}>
              <Text style={styles.date}>{formatDate(note.timestamp)}</Text>
              <LinearGradient colors={getCategoryColor(note.category)} style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{note.category}</Text>
              </LinearGradient>
              {note.source && (
                <View style={styles.sourceBadge}>
                  <Ionicons
                    name={note.source === "voice_recording" ? "mic" : "cloud-upload"}
                    size={12}
                    color="#6B7280"
                  />
                  <Text style={styles.sourceText}>{note.source === "voice_recording" ? "Voice" : "Upload"}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleFavorite} style={styles.favoriteButton}>
              <Ionicons
                name={note.isFavorite ? "heart" : "heart-outline"}
                size={20}
                color={note.isFavorite ? "#EF4444" : "#9CA3AF"}
              />
            </TouchableOpacity>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#9CA3AF"
              style={styles.expandIcon}
            />
          </View>
        </View>

        {/* Summary */}
        <Text style={styles.summary} numberOfLines={isExpanded ? undefined : 3}>
          {note.summary}
        </Text>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          {note.mainTopics?.length > 0 && (
            <View style={styles.statItem}>
              <Ionicons name="pricetag" size={14} color="#3B82F6" />
              <Text style={styles.statText}>{note.mainTopics.length} topics</Text>
            </View>
          )}
          {note.actionItems?.length > 0 && (
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={14} color="#10B981" />
              <Text style={styles.statText}>{note.actionItems.length} actions</Text>
            </View>
          )}
          {note.keyInsights?.length > 0 && (
            <View style={styles.statItem}>
              <Ionicons name="bulb" size={14} color="#F59E0B" />
              <Text style={styles.statText}>{note.keyInsights.length} insights</Text>
            </View>
          )}
        </View>

        {/* Expanded Content */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            {/* Main Topics */}
            {note.mainTopics?.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="pricetag" size={16} color="#3B82F6" />
                  <Text style={styles.sectionTitle}>Main Topics</Text>
                </View>
                <View style={styles.tagsContainer}>
                  {note.mainTopics.map((topic, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{topic}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Key Insights */}
            {note.keyInsights?.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="bulb" size={16} color="#F59E0B" />
                  <Text style={styles.sectionTitle}>Key Insights</Text>
                </View>
                {note.keyInsights.map((insight, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bullet}>💡</Text>
                    <Text style={styles.listText}>{insight}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Action Items */}
            {note.actionItems?.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.sectionTitle}>Action Items</Text>
                </View>
                {note.actionItems.map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bullet}>✅</Text>
                    <Text style={styles.listText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Questions */}
            {note.questions?.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="help-circle" size={16} color="#8B5CF6" />
                  <Text style={styles.sectionTitle}>Questions</Text>
                </View>
                {note.questions.map((question, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bullet}>❓</Text>
                    <Text style={styles.listText}>{question}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Tags */}
            {note.tags?.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="bookmark" size={16} color="#6B7280" />
                  <Text style={styles.sectionTitle}>Tags</Text>
                </View>
                <View style={styles.tagsContainer}>
                  {note.tags.map((tag, index) => (
                    <View key={index} style={[styles.tag, styles.hashTag]}>
                      <Text style={styles.hashTagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Actions */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={handleCopyContent}>
                <Ionicons name="copy" size={16} color="#6B7280" />
                <Text style={styles.actionText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleDuplicate}>
                <Ionicons name="duplicate" size={16} color="#6B7280" />
                <Text style={styles.actionText}>Duplicate</Text>
              </TouchableOpacity>
              {onEdit && (
                <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(note)}>
                  <Ionicons name="create" size={16} color="#6B7280" />
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.actionButton, styles.deleteAction]} onPress={handleDelete}>
                <Ionicons name="trash" size={16} color="#EF4444" />
                <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 6,
    lineHeight: 22,
  },
  metadata: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  date: {
    fontSize: 12,
    color: "#6B7280",
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "600",
  },
  sourceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  sourceText: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "500",
  },
  favoriteButton: {
    padding: 4,
    marginRight: 8,
  },
  expandIcon: {
    marginLeft: 4,
  },
  summary: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 12,
  },
  quickStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 16,
    marginTop: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  hashTag: {
    backgroundColor: "#EFF6FF",
  },
  hashTagText: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "500",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    gap: 8,
  },
  bullet: {
    fontSize: 14,
    lineHeight: 20,
  },
  listText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    flex: 1,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  deleteAction: {
    // No additional styles needed
  },
  deleteText: {
    color: "#EF4444",
  },
})

export default NoteCard
