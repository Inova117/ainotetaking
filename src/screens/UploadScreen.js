import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, Card, Title, Paragraph, Surface, ProgressBar } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNotes } from '../context/NotesContext';
import { useAI } from '../context/AIContext';
import Toast from 'react-native-toast-message';

export default function UploadScreen({ navigation }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const { addNote } = useNotes();
  const { mockProcessAudioToNote } = useAI();

  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile(file);
        
        Toast.show({
          type: 'success',
          text1: 'File Selected',
          text2: `${file.name} is ready to upload`,
        });
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to select file. Please try again.');
    }
  };

  const uploadAndProcess = async () => {
    if (!selectedFile) {
      Alert.alert('No File Selected', 'Please select an audio file first.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 0.9) {
            clearInterval(progressInterval);
            return 0.9;
          }
          return prev + 0.1;
        });
      }, 200);

      // Process the audio file
      const organizedNote = await mockProcessAudioToNote(selectedFile.uri);

      // Complete progress
      setUploadProgress(1);
      clearInterval(progressInterval);

      // Add the note to storage
      await addNote(organizedNote);

      // Reset state
      setSelectedFile(null);
      setUploadProgress(0);
      setIsUploading(false);

      // Show success and navigate
      Alert.alert(
        'Upload Complete!',
        'Your audio file has been processed and organized.',
        [
          { text: 'View Notes', onPress: () => navigation.navigate('Notes') },
          { text: 'Upload Another', style: 'cancel' }
        ]
      );

    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      setUploadProgress(0);
      Alert.alert('Upload Failed', 'Failed to process your audio file. Please try again.');
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    Toast.show({
      type: 'info',
      text1: 'File Removed',
      text2: 'You can select a different file now',
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Upload Audio File</Title>
        <Paragraph style={styles.subtitle}>
          Import and transcribe existing audio recordings
        </Paragraph>
      </View>

      {/* Upload Interface */}
      <Card style={styles.uploadCard}>
        <Card.Content style={styles.uploadContent}>
          <Ionicons name="cloud-upload-outline" size={64} color="#6b7280" />
          <Title style={styles.uploadTitle}>Select Audio File</Title>
          <Paragraph style={styles.uploadDescription}>
            Choose an audio file from your device to transcribe and organize
          </Paragraph>
          
          {!selectedFile ? (
            <Button
              mode="contained"
              onPress={pickAudioFile}
              style={styles.selectButton}
              icon="folder-open"
              disabled={isUploading}
            >
              Browse Files
            </Button>
          ) : (
            <Surface style={styles.selectedFileCard}>
              <View style={styles.fileInfo}>
                <Ionicons name="musical-notes" size={24} color="#2563eb" />
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName}>{selectedFile.name}</Text>
                  <Text style={styles.fileSize}>{formatFileSize(selectedFile.size)}</Text>
                </View>
                <Button
                  mode="text"
                  onPress={removeSelectedFile}
                  disabled={isUploading}
                >
                  Remove
                </Button>
              </View>
            </Surface>
          )}
        </Card.Content>
      </Card>

      {/* Upload Progress */}
      {isUploading && (
        <Card style={styles.progressCard}>
          <Card.Content>
            <Title style={styles.progressTitle}>Processing Audio</Title>
            <ProgressBar progress={uploadProgress} style={styles.progressBar} />
            <Text style={styles.progressText}>
              {Math.round(uploadProgress * 100)}% Complete
            </Text>
            <Paragraph style={styles.progressDescription}>
              {uploadProgress < 0.3 ? 'Uploading file...' :
               uploadProgress < 0.7 ? 'Transcribing audio...' :
               uploadProgress < 0.9 ? 'Organizing content...' :
               'Finalizing note...'}
            </Paragraph>
          </Card.Content>
        </Card>
      )}

      {/* Action Buttons */}
      {selectedFile && !isUploading && (
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={uploadAndProcess}
            style={styles.processButton}
            icon="cog"
          >
            Process Audio
          </Button>
        </View>
      )}

      {/* Supported Formats */}
      <Card style={styles.formatsCard}>
        <Card.Content>
          <Title style={styles.formatsTitle}>Supported Formats</Title>
          <View style={styles.formatsList}>
            <View style={styles.formatItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.formatText}>MP3 - Most common audio format</Text>
            </View>
            <View style={styles.formatItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.formatText}>WAV - High quality uncompressed</Text>
            </View>
            <View style={styles.formatItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.formatText}>M4A - Apple audio format</Text>
            </View>
            <View style={styles.formatItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.formatText}>WEBM - Web audio format</Text>
            </View>
          </View>
          <Paragraph style={styles.limitText}>
            Maximum file size: 25MB
          </Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    alignItems: 'center',
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
  uploadCard: {
    margin: 20,
    marginTop: 0,
  },
  uploadContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  uploadTitle: {
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  uploadDescription: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 24,
  },
  selectButton: {
    paddingHorizontal: 24,
  },
  selectedFileCard: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileDetails: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  fileSize: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  progressCard: {
    margin: 20,
    marginTop: 0,
  },
  progressTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressDescription: {
    textAlign: 'center',
    color: '#6b7280',
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  processButton: {
    paddingVertical: 8,
  },
  formatsCard: {
    margin: 20,
    marginTop: 0,
  },
  formatsTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  formatsList: {
    gap: 12,
    marginBottom: 16,
  },
  formatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  formatText: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
  limitText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
