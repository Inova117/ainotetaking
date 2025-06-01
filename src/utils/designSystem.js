// Ultra-Clean Editorial Design System - Apple-Level Sophistication
// Inspired by Linear, Arc, Notion, Superhuman, and Apple's Human Interface Guidelines
// Every pixel has purpose. Elegant reduction. Human-centered precision.

export const colors = {
  // Sage Green Primary - Calm, Elevated, Purposeful
  primary: {
    50: '#f6f7f6',   // Whisper sage
    100: '#eef0ed',  // Soft sage
    200: '#dde1da',  // Light sage
    300: '#c4cbbf',  // Medium sage
    400: '#a5b09a',  // Warm sage
    500: '#7B896F',  // Primary sage (brand anchor)
    600: '#6b7862',  // Deep sage
    700: '#5a6452',  // Rich sage
    800: '#4a5244',  // Dark sage
    900: '#3d4439',  // Deepest sage
  },
  
  // Editorial Neutral Palette - Ultra-refined, Human-readable
  neutral: {
    0: '#ffffff',     // Pure canvas
    25: '#fdfdfd',    // Near white
    50: '#fafafa',    // Soft white
    75: '#f7f7f7',    // Subtle gray
    100: '#f3f3f3',   // Light surface
    150: '#eeeeee',   // Gentle gray
    200: '#e8e8e8',   // Border gray
    250: '#e0e0e0',   // Soft border
    300: '#d6d6d6',   // Medium border
    400: '#a8a8a8',   // Placeholder text
    500: '#8a8a8a',   // Secondary text
    600: '#6b6b6b',   // Body text
    700: '#4a4a4a',   // Primary text
    800: '#2e2e2e',   // Headline text
    900: '#1a1a1a',   // Deep black
    950: '#0f0f0f',   // True black
  },
  
  // Semantic Colors - Thoughtful, Contextual
  success: '#22c55e',   // Fresh green
  warning: '#f59e0b',   // Warm amber
  error: '#ef4444',     // Gentle red
  info: '#3b82f6',      // Clear blue
  
  // Editorial Backgrounds - Layered, Purposeful
  background: {
    primary: '#ffffff',    // Main canvas
    secondary: '#fafafa',  // Elevated surface
    tertiary: '#f7f7f7',   // Subtle surface
    elevated: '#ffffff',   // Cards, modals
    overlay: 'rgba(0, 0, 0, 0.02)', // Gentle overlay
  },
  
  // Editorial Text Hierarchy - Readable, Elegant
  text: {
    primary: '#1a1a1a',     // Headlines, emphasis
    secondary: '#4a4a4a',   // Body text, readable
    tertiary: '#6b6b6b',    // Supporting text
    quaternary: '#8a8a8a',  // Captions, metadata
    placeholder: '#a8a8a8', // Form placeholders
    inverse: '#ffffff',     // White text
    accent: '#7B896F',      // Brand sage
    muted: '#d6d6d6',       // Disabled text
  },
  
  // Surface System - Gentle Elevation
  surface: {
    primary: '#ffffff',
    secondary: '#fafafa',
    tertiary: '#f7f7f7',
    elevated: '#ffffff',
    overlay: 'rgba(122, 137, 111, 0.03)', // Sage-tinted overlay
  }
};

export const typography = {
  // System Font Stack - Native, Readable
  fontFamily: {
    system: 'System',
    mono: 'SF Mono, Monaco, Consolas, monospace',
  },
  
  // Editorial Typography Scale - Purposeful Hierarchy
  fontSize: {
    xs: 11,      // Fine print, metadata
    sm: 12,      // Captions, labels
    base: 14,    // Body text, UI
    md: 15,      // Comfortable reading
    lg: 16,      // Emphasized body
    xl: 18,      // Subheadings
    '2xl': 20,   // Section headers
    '3xl': 24,   // Page headers
    '4xl': 28,   // Feature titles
    '5xl': 32,   // Hero headlines
    '6xl': 40,   // Display text
    '7xl': 48,   // Large display
  },
  
  // Editorial Line Heights - Readable, Breathing
  lineHeight: {
    tight: 1.15,    // Headlines, tight spacing
    snug: 1.25,     // Subheadings
    normal: 1.4,    // Body text, optimal reading
    relaxed: 1.5,   // Comfortable reading
    loose: 1.6,     // Spacious text
  },
  
  // Refined Letter Spacing - Optical Balance
  letterSpacing: {
    tighter: -0.02,  // Large headlines
    tight: -0.01,    // Medium headlines
    normal: 0,       // Body text
    wide: 0.01,      // Small caps
    wider: 0.02,     // Spaced text
    widest: 0.1,     // All caps
  },
  
  // Editorial Font Weights - Purposeful Emphasis
  fontWeight: {
    light: '300',     // Elegant, minimal
    regular: '400',   // Body text
    medium: '500',    // Subtle emphasis
    semibold: '600',  // Strong emphasis
    bold: '700',      // Headlines
    heavy: '800',     // Display text
  }
};

export const spacing = {
  // Apple's 4pt Grid - Mathematical Precision
  0: 0,
  px: 1,     // Hairline
  0.5: 2,    // Micro spacing
  1: 4,      // Tight spacing
  1.5: 6,    // Small spacing
  2: 8,      // Base unit
  2.5: 10,   // Compact spacing
  3: 12,     // Comfortable spacing
  3.5: 14,   // Medium spacing
  4: 16,     // Standard spacing
  5: 20,     // Generous spacing
  6: 24,     // Large spacing
  7: 28,     // Extra large
  8: 32,     // Section spacing
  9: 36,     // Major spacing
  10: 40,    // Hero spacing
  11: 44,    // Touch target
  12: 48,    // Large sections
  14: 56,    // Major sections
  16: 64,    // Page sections
  20: 80,    // Large gaps
  24: 96,    // Major gaps
  28: 112,   // Hero gaps
  32: 128,   // Massive spacing
  36: 144,   // Ultra spacing
  40: 160,   // Maximum spacing
  44: 176,   // Extreme spacing
  48: 192,   // Ultra-wide
  52: 208,   // Maximum
  56: 224,   // Extreme
  60: 240,   // Ultimate
  64: 256,   // Maximum possible
};

export const borderRadius = {
  none: 0,
  xs: 2,      // Subtle rounding
  sm: 4,      // Small elements
  base: 6,    // Standard rounding
  md: 8,      // Medium elements
  lg: 12,     // Large elements
  xl: 16,     // Cards, panels
  '2xl': 20,  // Large cards
  '3xl': 24,  // Hero elements
  '4xl': 32,  // Massive elements
  full: 9999, // Pills, circles
};

export const shadows = {
  // Ultra-Subtle Elevation - Gentle Depth
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
  },
  base: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3,
  },
  md: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 5,
  },
  xl: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 6,
  },
  // Sage-tinted shadows for brand elements
  sage: {
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  }
};

export const animations = {
  // Fluid, Human-Centered Motion
  timing: {
    instant: 0,
    micro: 100,     // Micro-interactions
    fast: 150,      // Quick feedback
    normal: 250,    // Standard transitions
    smooth: 350,    // Smooth transitions
    slow: 500,      // Deliberate motion
    slower: 750,    // Dramatic motion
  },
  
  // Apple-Inspired Easing
  easing: {
    linear: [0, 0, 1, 1],
    ease: [0.25, 0.1, 0.25, 1],
    easeIn: [0.42, 0, 1, 1],
    easeOut: [0, 0, 0.58, 1],
    easeInOut: [0.42, 0, 0.58, 1],
    spring: [0.68, -0.55, 0.265, 1.55],
    bounce: [0.175, 0.885, 0.32, 1.275],
  },
  
  // Spring Physics - Natural Motion
  spring: {
    gentle: { tension: 120, friction: 14 },
    smooth: { tension: 140, friction: 16 },
    snappy: { tension: 180, friction: 18 },
    bouncy: { tension: 200, friction: 12 },
  }
};

// Editorial Component System - Purposeful, Refined
export const components = {
  button: {
    // Touch-Friendly Dimensions
    minHeight: 44,
    minWidth: 44,
    
    // Generous Padding
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    
    // Refined Rounding
    borderRadius: borderRadius.lg,
    
    // Primary - Sage Green Authority
    primary: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
      color: colors.neutral[0],
    },
    
    // Secondary - Subtle Presence
    secondary: {
      backgroundColor: colors.surface.tertiary,
      borderColor: colors.neutral[200],
      borderWidth: 1,
      color: colors.text.primary,
    },
    
    // Ghost - Minimal Footprint
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      color: colors.text.secondary,
    },
    
    // Sage Outline - Brand Accent
    sageOutline: {
      backgroundColor: 'transparent',
      borderColor: colors.primary[300],
      borderWidth: 1,
      color: colors.primary[600],
    }
  },
  
  card: {
    backgroundColor: colors.surface.elevated,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.neutral[150],
  },
  
  input: {
    minHeight: 44,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.surface.primary,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    
    // Focus state
    focus: {
      borderColor: colors.primary[400],
      ...shadows.sage,
    }
  },
  
  // Editorial-specific components
  prose: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.relaxed,
    color: colors.text.secondary,
    letterSpacing: typography.letterSpacing.normal,
  },
  
  headline: {
    fontSize: typography.fontSize['4xl'],
    lineHeight: typography.lineHeight.tight,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    letterSpacing: typography.letterSpacing.tighter,
  },
  
  caption: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.normal,
    color: colors.text.quaternary,
    letterSpacing: typography.letterSpacing.wide,
  }
};

// Micro-interactions - Alive, Responsive
export const microinteractions = {
  // Gentle Press - Respectful Feedback
  buttonPress: {
    scale: 0.97,
    opacity: 0.85,
  },
  
  // Card Interaction - Subtle Lift
  cardPress: {
    scale: 0.995,
    shadowOpacity: 0.08,
  },
  
  // Sage Accent - Brand Interaction
  sagePress: {
    scale: 0.96,
    backgroundColor: colors.primary[600],
  },
  
  // Gentle Bounce - Playful Feedback
  bounce: {
    scale: [1, 1.02, 1],
  },
  
  // Fade In - Graceful Entrance
  fadeIn: {
    opacity: [0, 1],
  },
  
  // Slide Up - Editorial Reveal
  slideUp: {
    translateY: [12, 0],
    opacity: [0, 1],
  },
  
  // Gentle Hover - Desktop Refinement
  hover: {
    scale: 1.01,
    shadowOpacity: 0.06,
  }
};

// Layout System - Generous, Purposeful
export const layout = {
  // Container Widths - Reading-Optimized
  container: {
    sm: 640,    // Mobile
    md: 768,    // Tablet
    lg: 1024,   // Desktop
    xl: 1280,   // Large desktop
    '2xl': 1536, // Ultra-wide
  },
  
  // Editorial Spacing
  screenPadding: spacing[6],     // Screen edges
  cardSpacing: spacing[4],       // Between cards
  sectionSpacing: spacing[12],   // Between sections
  heroSpacing: spacing[20],      // Hero sections
  
  // Touch Targets - Accessible
  touchTarget: {
    minHeight: 44,
    minWidth: 44,
  },
  
  // Reading Widths - Optimal Typography
  prose: {
    maxWidth: 680,  // Optimal reading line length
  }
};

// Editorial Tokens - Semantic Meaning
export const tokens = {
  // Sage Brand Variants
  sage: {
    subtle: colors.primary[100],
    muted: colors.primary[200],
    default: colors.primary[500],
    emphasis: colors.primary[600],
    strong: colors.primary[700],
  },
  
  // Editorial States
  states: {
    hover: 'rgba(122, 137, 111, 0.08)',
    active: 'rgba(122, 137, 111, 0.12)',
    focus: 'rgba(122, 137, 111, 0.16)',
    disabled: colors.neutral[300],
  },
  
  // Feedback Colors
  feedback: {
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
  }
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  components,
  microinteractions,
  layout,
  tokens,
}; 