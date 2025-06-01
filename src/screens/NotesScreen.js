import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Searchbar, Chip, FAB, Menu, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNotes } from '../context/NotesContext';

export default function NotesScreen({ navigation }) {
  const { notes, searchNotes, toggleFavorite, deleteNote } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState(notes);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [menuVisible, setMenuVisible] = useState({});

  const categories = ['All', ...new Set(notes.map(note => note.category || 'General'))];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredNotes(notes);
    } else {
      const results = searchNotes(query);
      setFilteredNotes(results);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredNotes(notes);
    } else {
      setFilteredNotes(notes.filter(note => note.category === category));
    }
  };

  const toggleMenu = (noteId) => {
    setMenuVisible(prev => ({
      ...prev,
      [noteId]: !prev[noteId]
    }));
  };

  const handleToggleFavorite = async (noteId) => {
    await toggleFavorite(noteId);
    setMenuVisible(prev => ({ ...prev, [noteId]: false }));
  };

  const handleDeleteNote = async (noteId) => {
    await deleteNote(noteId);
    setMenuVisible(prev => ({ ...prev, [noteId]: false }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderNoteCard = ({ item: note }) => (
    <Card style={styles.noteCard}>
      <Card.Content>
        <View style={styles.noteHeader}>
          <View style={styles.noteTitleContainer}>
            <Title style={styles.noteTitle} numberOfLines={1}>
              {note.title}
            </Title>
            {note.isFavorite && (
              <Ionicons name="heart" size={16} color="#ef4444" style={styles.favoriteIcon} />
            )}
          </View>
          <Menu
            visible={menuVisible[note.id]}
            onDismiss={() => toggleMenu(note.id)}
            anchor={
              <TouchableOpacity onPress={() => toggleMenu(note.id)}>
                <Ionicons name="ellipsis-vertical" size={20} color="#6b7280" />
              </TouchableOpacity>
            }
          >
            <Menu.Item
              onPress={() => handleToggleFavorite(note.id)}
              title={note.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              leadingIcon={note.isFavorite ? "heart-outline" : "heart"}
            />
            <Menu.Item
              onPress={() => handleDeleteNote(note.id)}
              title="Delete"
              leadingIcon="delete"
            />
          </Menu>
        </View>

        <Paragraph style={styles.noteSummary} numberOfLines={2}>
          {note.summary}
        </Paragraph>

        <View style={styles.noteMetadata}>
          <Text style={styles.noteDate}>{formatDate(note.timestamp)}</Text>
          <Chip style={styles.categoryChip} textStyle={styles.categoryText}>
            {note.category || 'General'}
          </Chip>
        </View>

        {note.tags && note.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {note.tags.slice(0, 3).map((tag, index) => (
              <Chip key={index} style={styles.tag} textStyle={styles.tagText}>
                #{tag}
              </Chip>
            ))}
            {note.tags.length > 3 && (
              <Text style={styles.moreTagsText}>+{note.tags.length - 3} more</Text>
            )}
          </View>
        )}

        {(note.actionItems && note.actionItems.length > 0) && (
          <View style={styles.actionItemsContainer}>
            <Text style={styles.actionItemsTitle}>Action Items:</Text>
            {note.actionItems.slice(0, 2).map((item, index) => (
              <Text key={index} style={styles.actionItem}>
                • {item}
              </Text>
            ))}
            {note.actionItems.length > 2 && (
              <Text style={styles.moreItemsText}>
                +{note.actionItems.length - 2} more items
              </Text>
            )}
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color="#9ca3af" />
      <Title style={styles.emptyTitle}>No Notes Found</Title>
      <Paragraph style={styles.emptyDescription}>
        {searchQuery 
          ? "Try adjusting your search terms or filters"
          : "Start by recording your first voice note or uploading an audio file"
        }
      </Paragraph>
      {!searchQuery && (
        <Button 
          mode="contained" 
          style={styles.emptyButton}
          onPress={() => navigation.navigate('Record')}
        >
          Create Your First Note
        </Button>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <Searchbar
        placeholder="Search notes..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* Category Filter */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Chip
              selected={selectedCategory === item}
              onPress={() => handleCategoryFilter(item)}
              style={[
                styles.categoryFilter,
                selectedCategory === item && styles.selectedCategoryFilter
              ]}
              textStyle={[
                styles.categoryFilterText,
                selectedCategory === item && styles.selectedCategoryFilterText
              ]}
            >
              {item}
            </Chip>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Notes List */}
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={renderNoteCard}
        contentContainerStyle={styles.notesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('Record')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  searchBar: {
    margin: 16,
    marginBottom: 8,
  },
  categoriesContainer: {
    marginBottom: 8,
  },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryFilter: {
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  selectedCategoryFilter: {
    backgroundColor: '#2563eb',
  },
  categoryFilterText: {
    color: '#6b7280',
  },
  selectedCategoryFilterText: {
    color: 'white',
  },
  notesList: {
    padding: 16,
    paddingTop: 8,
  },
  noteCard: {
    marginBottom: 12,
    elevation: 2,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  favoriteIcon: {
    marginLeft: 8,
  },
  noteSummary: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  noteMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  categoryChip: {
    backgroundColor: '#e0e7ff',
    height: 24,
  },
  categoryText: {
    fontSize: 10,
    color: '#3730a3',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  tag: {
    backgroundColor: '#dbeafe',
    height: 24,
  },
  tagText: {
    fontSize: 10,
    color: '#1d4ed8',
  },
  moreTagsText: {
    fontSize: 10,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  actionItemsContainer: {
    backgroundColor: '#fef3c7',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  actionItemsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  actionItem: {
    fontSize: 12,
    color: '#92400e',
    lineHeight: 16,
  },
  moreItemsText: {
    fontSize: 10,
    color: '#92400e',
    fontStyle: 'italic',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
    color: '#374151',
  },
  emptyDescription: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  emptyButton: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2563eb',
  },
});
