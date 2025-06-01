import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from "react-native-toast-message";

const NotesContext = createContext();

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load notes from AsyncStorage on app start
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes).map(note => ({
          ...note,
          timestamp: new Date(note.timestamp)
        }));
        setNotes(parsedNotes);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveNotes = async (notesToSave) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(notesToSave));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const addNote = async (note) => {
    const newNote = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...note,
    };
    
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    await saveNotes(updatedNotes);
    return newNote;
  };

  const updateNote = async (id, updates) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, ...updates } : note
    );
    setNotes(updatedNotes);
    await saveNotes(updatedNotes);
  };

  const deleteNote = async (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    await saveNotes(updatedNotes);
  };

  const getStats = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentNotes = notes.filter(note => note.timestamp >= oneWeekAgo).length;
    const totalActionItems = notes.reduce((sum, note) => sum + (note.actionItems?.length || 0), 0);
    const totalInsights = notes.reduce((sum, note) => sum + (note.keyPoints?.length || 0), 0);
    
    const categoryStats = notes.reduce((acc, note) => {
      const category = note.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return {
      totalNotes: notes.length,
      recentNotes,
      totalActionItems,
      totalInsights,
      categoryStats,
    };
  };

  const searchNotes = (query) => {
    if (!query.trim()) return notes;
    
    const lowercaseQuery = query.toLowerCase();
    return notes.filter(note =>
      note.title?.toLowerCase().includes(lowercaseQuery) ||
      note.summary?.toLowerCase().includes(lowercaseQuery) ||
      note.content?.toLowerCase().includes(lowercaseQuery) ||
      note.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getNotesByCategory = (category) => {
    return notes.filter(note => note.category === category);
  };

  const getFavoriteNotes = () => {
    return notes.filter(note => note.isFavorite);
  };

  const toggleFavorite = async (id) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
    );
    setNotes(updatedNotes);
    await saveNotes(updatedNotes);
  };

  const value = {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    getStats,
    searchNotes,
    getNotesByCategory,
    getFavoriteNotes,
    toggleFavorite,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};
