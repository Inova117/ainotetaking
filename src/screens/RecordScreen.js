import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import { Button, Card, Title, Paragraph, Surface } from 'react-native-paper';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNotes } from '../context/NotesContext';
import { useAI } from '../context/AIContext';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

export default function RecordScreen({ navigation }) {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addNote } = useNotes();
  const { mockProcessAudioToNote } = useAI();
  const intervalRef = useRef(null);

  const startRecording = async () => {
    try {
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant microphone permission to record audio.');
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      Toast.show({
        type: 'info',
        text1: 'Recording Started',
        text2: 'Speak clearly into your device microphone',
      });

    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      setIsRecording(false);
      clearInterval(intervalRef.current);

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      Toast.show({
        type: 'success',
        text1: 'Recording Stopped',
        text2: 'Processing your audio...',
      });

      // Process the audio
      await processRecording(uri);

    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to stop recording. Please try again.');
    }
  };

  const processRecording = async (audioUri) => {
    try {
      setIsProcessing(true);

      // Use mock processing for now (replace with real AI processing when backend is ready)
      const organizedNote = await mockProcessAudioToNote(audioUri);

      // Add the note to storage
      await addNote(organizedNote);

      // Reset state
      setRecordingDuration(0);
      setIsProcessing(false);

      // Navigate to notes or show success
      Alert.alert(
        'Note Created!',
        'Your voice recording has been transcribed and organized.',
        [
          { text: 'View Notes', onPress: () => navigation.navigate('Notes') },
          { text: 'Record Another', style: 'cancel' }
        ]
      );

    } catch (error) {
      console.error('Failed to process recording:', error);
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to process your recording. Please try again.');
    }
  };

  const cancelRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      setRecording(null);
    }
    setIsRecording(false);
    setRecordingDuration(0);
    clearInterval(intervalRef.current);

    Toast.show({
      type: 'info',
      text1: 'Recording Cancelled',
      text2: 'Your recording has been discarded',
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Voice Recording</Title>
        <Paragraph style={styles.subtitle}>
          Capture your thoughts and ideas with voice recording
        </Paragraph>
      </View>

      {/* Recording Interface */}
      <View style={styles.recordingContainer}>
        <Surface style={styles.recordingCard}>
          <View style={styles.recordingContent}>
            {/* Microphone Icon */}
            <View style={[styles.microphoneContainer, isRecording && styles.microphoneActive]}>
              <Ionicons 
                name={isRecording ? "mic" : "mic-outline"} 
                size={64} 
                color={isRecording ? "#ef4444" : "#6b7280"} 
              />
              {isRecording && (
                <View style={styles.pulseRing} />
              )}
            </View>

            {/* Duration Display */}
            <Text style={styles.duration}>
              {formatDuration(recordingDuration)}
            </Text>

            {/* Status Text */}
            <Text style={styles.statusText}>
              {isProcessing 
                ? 'Processing your recording...' 
                : isRecording 
                  ? 'Recording in progress...' 
                  : 'Ready to record'
              }
            </Text>

            {/* Control Buttons */}
            <View style={styles.controlsContainer}>
              {!isRecording && !isProcessing && (
                <Button
                  mode="contained"
                  onPress={startRecording}
                  style={styles.recordButton}
                  contentStyle={styles.buttonContent}
                  icon="mic"
                >
                  Start Recording
                </Button>
              )}

              {isRecording && (
                <View style={styles.recordingControls}>
                  <Button
                    mode="outlined"
                    onPress={cancelRecording}
                    style={styles.cancelButton}
                    textColor="#ef4444"
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={stopRecording}
                    style={styles.stopButton}
                    buttonColor="#ef4444"
                  >
                    Stop Recording
                  </Button>
                </View>
              )}

              {isProcessing && (
                <Button
                  mode="contained"
                  disabled
                  style={styles.processingButton}
                  icon="loading"
                >
                  Processing...
                </Button>
              )}
            </View>
          </View>
        </Surface>
      </View>

      {/* Tips Card */}
      <Card style={styles.tipsCard}>
        <Card.Content>
          <Title style={styles.tipsTitle}>Recording Tips</Title>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.tipText}>Speak clearly and at a normal pace</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.tipText}>Find a quiet environment</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.tipText}>Hold device 6-8 inches from your mouth</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.tipText}>AI will automatically organize your content</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  recordingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingCard: {
    width: width - 40,
    borderRadius: 20,
    elevation: 8,
    backgroundColor: 'white',
  },
  recordingContent: {
    padding: 40,
    alignItems: 'center',
  },
  microphoneContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  microphoneActive: {
    backgroundColor: '#fef2f2',
  },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#ef4444',
    opacity: 0.3,
  },
  duration: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
    fontFamily: 'monospace',
  },
  statusText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 30,
    textAlign: 'center',
  },
  controlsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  recordButton: {
    width: '100%',
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  recordingControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
    borderColor: '#ef4444',
  },
  stopButton: {
    flex: 1,
    borderRadius: 12,
  },
  processingButton: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#6b7280',
  },
  tipsCard: {
    marginTop: 20,
  },
  tipsTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
});
