import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, Surface, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNotes } from '../context/NotesContext';
import { colors, typography, spacing, borderRadius, shadows, layout } from '../utils/designSystem';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const { notes } = useNotes();

  // Calculate stats
  const totalNotes = notes.length;
  const todayNotes = notes.filter(note => {
    const today = new Date().toDateString();
    return new Date(note.createdAt).toDateString() === today;
  }).length;
  
  const actionItems = notes.reduce((count, note) => {
    return count + (note.actionItems ? note.actionItems.length : 0);
  }, 0);

  const categories = [...new Set(notes.map(note => note.category).filter(Boolean))];

  // Get recent notes (last 2 for cleaner layout)
  const recentNotes = notes
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 2);

  const StatCard = ({ title, value, icon, color = colors.primary[500], subtitle, onPress }) => {
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          style={styles.statCard}
        >
          <View style={styles.statContent}>
            <View style={styles.statHeader}>
              <View style={[styles.statIconContainer, { backgroundColor: `${color}08` }]}>
                <Ionicons name={icon} size={20} color={color} />
              </View>
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
            {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const QuickActionCard = ({ title, subtitle, icon, onPress, color = colors.primary[500], isPrimary = false }) => {
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          style={[styles.actionCard, isPrimary && styles.primaryActionCard]}
        >
          <View style={styles.actionContent}>
            <View style={[
              styles.actionIcon, 
              isPrimary 
                ? { backgroundColor: colors.primary[500] }
                : { backgroundColor: `${color}08` }
            ]}>
              <Ionicons 
                name={icon} 
                size={24} 
                color={isPrimary ? colors.text.inverse : color} 
              />
            </View>
            <Text style={[styles.actionTitle, isPrimary && styles.primaryActionTitle]}>
              {title}
            </Text>
            <Text style={[styles.actionSubtitle, isPrimary && styles.primaryActionSubtitle]}>
              {subtitle}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const NotePreviewCard = ({ note, onPress }) => {
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          style={styles.notePreviewCard}
        >
          <View style={styles.notePreviewContent}>
            <View style={styles.notePreviewHeader}>
              <Text style={styles.notePreviewTitle} numberOfLines={1}>
                {note.title || 'Untitled Note'}
              </Text>
              <Text style={styles.notePreviewDate}>
                {new Date(note.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
            <Text style={styles.notePreviewText} numberOfLines={2}>
              {note.content || note.transcript || 'No content available'}
            </Text>
            {note.category && (
              <View style={styles.notePreviewFooter}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{note.category}</Text>
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Apple-Style Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good {getTimeOfDay()}</Text>
        <Text style={styles.title}>Your Notes</Text>
        <Text style={styles.subtitle}>
          Capture, organize, and discover your thoughts
        </Text>
      </View>

      {/* Apple-Style Stats Overview */}
      <View style={styles.statsSection}>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Notes"
            value={totalNotes}
            icon="library-outline"
            color={colors.primary[500]}
            subtitle={`${totalNotes} ${totalNotes === 1 ? 'note' : 'notes'}`}
            onPress={() => navigation.navigate('Notes')}
          />
          <StatCard
            title="Today"
            value={todayNotes}
            icon="today-outline"
            color={colors.success}
            subtitle={`${todayNotes} new ${todayNotes === 1 ? 'note' : 'notes'}`}
            onPress={() => navigation.navigate('Notes')}
          />
        </View>
        <View style={styles.statsGrid}>
          <StatCard
            title="Action Items"
            value={actionItems}
            icon="checkmark-circle-outline"
            color={colors.warning}
            subtitle={`${actionItems} ${actionItems === 1 ? 'item' : 'items'} pending`}
            onPress={() => navigation.navigate('Notes')}
          />
          <StatCard
            title="Categories"
            value={categories.length}
            icon="folder-outline"
            color={colors.info}
            subtitle={`${categories.length} ${categories.length === 1 ? 'category' : 'categories'}`}
            onPress={() => navigation.navigate('Notes')}
          />
        </View>
      </View>

      {/* Apple-Style Quick Actions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        
        <View style={styles.actionsGrid}>
          <QuickActionCard
            title="Record Note"
            subtitle="Capture your voice"
            icon="mic"
            color={colors.primary[500]}
            isPrimary={true}
            onPress={() => navigation.navigate('Record')}
          />
          <QuickActionCard
            title="Import Audio"
            subtitle="Upload files"
            icon="cloud-upload-outline"
            color={colors.info}
            onPress={() => navigation.navigate('Upload')}
          />
        </View>
      </View>

      {/* Apple-Style Recent Notes */}
      {recentNotes.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Notes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Notes')}>
              <Text style={styles.sectionAction}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.notesGrid}>
            {recentNotes.map((note, index) => (
              <NotePreviewCard
                key={note.id || index}
                note={note}
                onPress={() => navigation.navigate('Notes')}
              />
            ))}
          </View>
        </View>
      )}

      {/* Apple-Style Empty State */}
      {totalNotes === 0 && (
        <View style={styles.emptySection}>
          <View style={styles.emptyContent}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="mic-outline" size={32} color={colors.text.tertiary} />
            </View>
            <Text style={styles.emptyTitle}>Start Your First Note</Text>
            <Text style={styles.emptySubtitle}>
              Record your thoughts, ideas, and important moments with AI-powered organization
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Record')}
            >
              <Text style={styles.emptyButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom spacing for comfortable scrolling */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

// Helper function for time-based greeting
const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  
  // Apple-Style Header
  header: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing[8],
    paddingBottom: spacing[10],
  },
  greeting: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.tertiary,
    marginBottom: spacing[1],
    letterSpacing: typography.letterSpacing.wide,
  },
  title: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing[2],
    lineHeight: typography.fontSize['5xl'] * typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tighter,
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    lineHeight: typography.fontSize.lg * typography.lineHeight.relaxed,
    letterSpacing: typography.letterSpacing.normal,
  },

  // Apple-Style Stats Section
  statsSection: {
    paddingHorizontal: layout.screenPadding,
    marginBottom: spacing[12],
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing[4],
    marginBottom: spacing[4],
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.neutral[100],
    ...shadows.sm,
  },
  statContent: {
    padding: spacing[6],
  },
  statHeader: {
    marginBottom: spacing[4],
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing[1],
    letterSpacing: typography.letterSpacing.tighter,
  },
  statTitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing[1],
    letterSpacing: typography.letterSpacing.wide,
  },
  statSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    letterSpacing: typography.letterSpacing.normal,
  },

  // Apple-Style Sections
  section: {
    paddingHorizontal: layout.screenPadding,
    marginBottom: spacing[12],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    letterSpacing: typography.letterSpacing.tight,
  },
  sectionAction: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary[500],
    letterSpacing: typography.letterSpacing.normal,
  },

  // Apple-Style Action Cards
  actionsGrid: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.neutral[100],
    ...shadows.sm,
  },
  primaryActionCard: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  actionContent: {
    alignItems: 'center',
    padding: spacing[8],
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  actionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[1],
    textAlign: 'center',
    letterSpacing: typography.letterSpacing.normal,
  },
  primaryActionTitle: {
    color: colors.text.inverse,
  },
  actionSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    letterSpacing: typography.letterSpacing.normal,
  },
  primaryActionSubtitle: {
    color: colors.primary[100],
  },

  // Apple-Style Note Previews
  notesGrid: {
    gap: spacing[4],
  },
  notePreviewCard: {
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.neutral[100],
    ...shadows.sm,
  },
  notePreviewContent: {
    padding: spacing[6],
  },
  notePreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
  },
  notePreviewTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing[3],
    letterSpacing: typography.letterSpacing.normal,
  },
  notePreviewDate: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.wide,
  },
  notePreviewText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
    marginBottom: spacing[4],
    letterSpacing: typography.letterSpacing.normal,
  },
  notePreviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.md,
  },
  categoryBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary[600],
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.wide,
  },

  // Apple-Style Empty State
  emptySection: {
    paddingHorizontal: layout.screenPadding,
    marginBottom: spacing[12],
  },
  emptyContent: {
    alignItems: 'center',
    padding: spacing[12],
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    borderColor: colors.neutral[100],
    ...shadows.sm,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surface.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  emptyTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing[3],
    letterSpacing: typography.letterSpacing.tight,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[8],
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
    paddingHorizontal: spacing[4],
    letterSpacing: typography.letterSpacing.normal,
  },
  emptyButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[4],
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  emptyButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.inverse,
    letterSpacing: typography.letterSpacing.normal,
  },

  bottomSpacing: {
    height: spacing[12],
  },
}); 