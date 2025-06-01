 "use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native"
import { Audio } from "expo-av"
import { Ionicons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import { useSettings } from "../context/SettingsContext"

const VoiceRecorder = ({ onRecordingComplete, onRecordingStart, onRecordingStop }) => {
  const [recording, setRecording] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [sound, setSound] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingUri, setRecordingUri] = useState(null)

  const { settings } = useSettings()
  const pulseAnim = useRef(new Animated.Value(1)).current
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [sound])

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation()
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  const getRecordingOptions = () => {
    const quality = settings.recordingQuality || "high"

    switch (quality) {
      case "high":
        return Audio.RecordingOptionsPresets.HIGH_QUALITY
      case "medium":
        return {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
          android: {
            ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
            bitRate: 128000,
          },
          ios: {
            ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
            bitRate: 128000,
          },
        }
      case "low":
        return Audio.RecordingOptionsPresets.LOW_QUALITY
      default:
        return Audio.RecordingOptionsPresets.HIGH_QUALITY
    }
  }

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync()
      if (status !== "granted") {
        alert("Permission to access microphone is required!")
        return
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      const { recording } = await Audio.Recording.createAsync(getRecordingOptions())

      setRecording(recording)
      setIsRecording(true)
      setRecordingTime(0)
      startPulseAnimation()

      if (settings.hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      }

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      if (onRecordingStart) {
        onRecordingStart()
      }
    } catch (err) {
      console.error("Failed to start recording", err)
      alert("Failed to start recording. Please try again.")
    }
  }

  const pauseRecording = async () => {
    if (!recording) return

    try {
      await recording.pauseAsync()
      setIsPaused(true)
      stopPulseAnimation()
      clearInterval(timerRef.current)

      if (settings.hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
    } catch (error) {
      console.error("Failed to pause recording", error)
    }
  }

  const resumeRecording = async () => {
    if (!recording) return

    try {
      await recording.startAsync()
      setIsPaused(false)
      startPulseAnimation()

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      if (settings.hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
    } catch (error) {
      console.error("Failed to resume recording", error)
    }
  }

  const stopRecording = async () => {
    if (!recording) return

    try {
      setIsRecording(false)
      setIsPaused(false)
      stopPulseAnimation()
      clearInterval(timerRef.current)

      await recording.stopAndUnloadAsync()
      const uri = recording.getURI()
      setRecordingUri(uri)
      setRecording(null)

      if (settings.hapticFeedback) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      }

      if (onRecordingStop) {
        onRecordingStop()
      }

      if (onRecordingComplete && uri) {
        onRecordingComplete(uri, recordingTime)
      }
    } catch (error) {
      console.error("Failed to stop recording", error)
      alert("Failed to stop recording. Please try again.")
    }
  }

  const playRecording = async () => {
    if (!recordingUri) return

    try {
      if (sound) {
        await sound.unloadAsync()
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri: recordingUri }, { shouldPlay: true })

      setSound(newSound)
      setIsPlaying(true)

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false)
        }
      })
    } catch (error) {
      console.error("Failed to play recording", error)
    }
  }

  const discardRecording = () => {
    setRecordingUri(null)
    setRecordingTime(0)
    setIsPlaying(false)
    if (sound) {
      sound.unloadAsync()
      setSound(null)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{formatTime(recordingTime)}</Text>
        {isRecording && (
          <View style={styles.statusContainer}>
            <View style={[styles.recordingDot, { backgroundColor: isPaused ? "#F59E0B" : "#EF4444" }]} />
            <Text style={styles.statusText}>{isPaused ? "Paused" : "Recording"}</Text>
          </View>
        )}
      </View>

      <View style={styles.controlsContainer}>
        {!isRecording && !recordingUri && (
          <Animated.View style={[styles.recordButtonContainer, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
              <Ionicons name="mic" size={32} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        )}

        {isRecording && (
          <View style={styles.recordingControls}>
            <TouchableOpacity
              style={[styles.controlButton, styles.pauseButton]}
              onPress={isPaused ? resumeRecording : pauseRecording}
            >
              <Ionicons name={isPaused ? "play" : "pause"} size={24} color="#fff" />
            </TouchableOpacity>

            <Animated.View style={[styles.recordButtonContainer, { transform: [{ scale: pulseAnim }] }]}>
              <TouchableOpacity style={[styles.recordButton, styles.stopButton]} onPress={stopRecording}>
                <Ionicons name="stop" size={32} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}

        {recordingUri && (
          <View style={styles.playbackControls}>
            <TouchableOpacity
              style={[styles.controlButton, styles.playButton]}
              onPress={playRecording}
              disabled={isPlaying}
            >
              <Ionicons name={isPlaying ? "volume-high" : "play"} size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.controlButton, styles.discardButton]} onPress={discardRecording}>
              <Ionicons name="trash" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  timer: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1F2937",
    fontFamily: "monospace",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  controlsContainer: {
    alignItems: "center",
  },
  recordButtonContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  recordButton: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  stopButton: {
    backgroundColor: "#EF4444",
  },
  recordingControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  playbackControls: {
    flexDirection: "row",
    gap: 15,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  pauseButton: {
    backgroundColor: "#F59E0B",
  },
  playButton: {
    backgroundColor: "#10B981",
  },
  discardButton: {
    backgroundColor: "#EF4444",
  },
})

export default VoiceRecorder
