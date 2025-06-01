import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import DashboardScreen from './src/screens/DashboardScreen';
import RecordScreen from './src/screens/RecordScreen';
import UploadScreen from './src/screens/UploadScreen';
import NotesScreen from './src/screens/NotesScreen';

// Import contexts
import { NotesProvider } from './src/context/NotesContext';
import { AIProvider } from './src/context/AIContext';

// Import design system
import { colors, shadows, spacing, borderRadius, typography } from './src/utils/designSystem';

const Tab = createBottomTabNavigator();

// Apple-Level Theme for React Native Paper
const paperTheme = {
  colors: {
    primary: colors.primary[500],
    accent: colors.primary[400],
    background: colors.background.primary,
    surface: colors.surface.primary,
    text: colors.text.primary,
    onSurface: colors.text.primary,
    placeholder: colors.text.quaternary,
    backdrop: 'rgba(0, 0, 0, 0.4)',
    notification: colors.primary[500],
    elevation: {
      level0: 'transparent',
      level1: colors.surface.secondary,
      level2: colors.surface.tertiary,
      level3: colors.neutral[100],
      level4: colors.neutral[150],
      level5: colors.neutral[200],
    },
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <AIProvider>
          <NotesProvider>
            <NavigationContainer>
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Dashboard') {
                      iconName = focused ? 'analytics' : 'analytics-outline';
                    } else if (route.name === 'Record') {
                      iconName = focused ? 'mic' : 'mic-outline';
                    } else if (route.name === 'Upload') {
                      iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
                    } else if (route.name === 'Notes') {
                      iconName = focused ? 'document-text' : 'document-text-outline';
                    }

                    return <Ionicons name={iconName} size={focused ? 26 : 24} color={color} />;
                  },
                  // Apple-Level Tab Bar Design
                  tabBarActiveTintColor: colors.primary[500],
                  tabBarInactiveTintColor: colors.text.tertiary,
                  tabBarStyle: {
                    backgroundColor: colors.surface.primary,
                    borderTopWidth: 0.5,
                    borderTopColor: colors.neutral[200],
                    paddingTop: spacing[3],
                    paddingBottom: spacing[6],
                    paddingHorizontal: spacing[4],
                    height: 88,
                    ...shadows.lg,
                  },
                  tabBarLabelStyle: {
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.medium,
                    marginTop: spacing[1],
                    letterSpacing: typography.letterSpacing.wide,
                  },
                  tabBarIconStyle: {
                    marginTop: spacing[2],
                  },
                  // Apple-Level Header Design
                  headerStyle: {
                    backgroundColor: colors.surface.primary,
                    borderBottomWidth: 0.5,
                    borderBottomColor: colors.neutral[200],
                    ...shadows.xs,
                  },
                  headerTintColor: colors.text.primary,
                  headerTitleStyle: {
                    fontWeight: typography.fontWeight.semibold,
                    fontSize: typography.fontSize['2xl'],
                    letterSpacing: typography.letterSpacing.tight,
                    color: colors.text.primary,
                  },
                  headerTitleAlign: 'left',
                  headerLeftContainerStyle: {
                    paddingLeft: spacing[6],
                  },
                  headerRightContainerStyle: {
                    paddingRight: spacing[6],
                  },
                  // Apple's Smooth Transitions
                  animationEnabled: true,
                  animationTypeForReplace: 'push',
                })}
              >
                <Tab.Screen 
                  name="Dashboard" 
                  component={DashboardScreen}
                  options={{ 
                    title: 'Notes',
                    tabBarLabel: 'Home'
                  }}
                />
                <Tab.Screen 
                  name="Record" 
                  component={RecordScreen}
                  options={{ 
                    title: 'Record',
                    tabBarLabel: 'Record'
                  }}
                />
                <Tab.Screen 
                  name="Upload" 
                  component={UploadScreen}
                  options={{ 
                    title: 'Import',
                    tabBarLabel: 'Import'
                  }}
                />
                <Tab.Screen 
                  name="Notes" 
                  component={NotesScreen}
                  options={{ 
                    title: 'Library',
                    tabBarLabel: 'Library'
                  }}
                />
              </Tab.Navigator>
            </NavigationContainer>
            <Toast />
            <StatusBar style="dark" backgroundColor={colors.surface.primary} />
          </NotesProvider>
        </AIProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
} 