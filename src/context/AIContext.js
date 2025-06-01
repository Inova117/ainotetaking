import React, { createContext, useContext } from 'react';

const AIContext = createContext();

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

export const AIProvider = ({ children }) => {
  // Mock function to simulate AI processing of audio to organized note
  const mockProcessAudioToNote = async (audioUri) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock organized note data
    const mockNotes = [
      {
        title: "Meeting Notes - Project Planning",
        content: "Discussed the upcoming project timeline and resource allocation. Key points covered include budget constraints, team assignments, and milestone deadlines.",
        category: "Work",
        tags: ["meeting", "planning", "project"],
        actionItems: [
          "Review budget proposal by Friday",
          "Assign team leads to each workstream",
          "Schedule follow-up meeting for next week"
        ],
        keyPoints: [
          "Budget needs to be finalized by end of month",
          "Three main workstreams identified",
          "Timeline is aggressive but achievable"
        ]
      },
      {
        title: "Personal Thoughts - Weekend Plans",
        content: "Thinking about what to do this weekend. Want to visit the new art gallery downtown and maybe catch up with some friends.",
        category: "Personal",
        tags: ["weekend", "plans", "social"],
        actionItems: [
          "Check gallery opening hours",
          "Text Sarah about weekend plans"
        ],
        keyPoints: [
          "New art exhibition opened this week",
          "Haven't seen friends in a while"
        ]
      },
      {
        title: "Learning Notes - React Native Development",
        content: "Exploring React Native navigation patterns and state management. Need to understand the differences between stack and tab navigation.",
        category: "Learning",
        tags: ["react-native", "development", "navigation"],
        actionItems: [
          "Practice implementing tab navigation",
          "Read documentation on React Navigation",
          "Build a sample app with multiple screens"
        ],
        keyPoints: [
          "Navigation is crucial for mobile apps",
          "State management becomes complex with multiple screens",
          "React Navigation is the standard library"
        ]
      }
    ];

    // Return a random mock note
    const randomNote = mockNotes[Math.floor(Math.random() * mockNotes.length)];
    
    return {
      id: Date.now().toString(),
      ...randomNote,
      audioUri,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      transcription: randomNote.content,
      processingStatus: 'completed'
    };
  };

  // Mock function to simulate AI processing of uploaded audio file
  const mockProcessUploadedAudio = async (fileUri, fileName) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate mock organized note based on file name
    const isBusinessFile = fileName.toLowerCase().includes('meeting') || 
                          fileName.toLowerCase().includes('call') ||
                          fileName.toLowerCase().includes('interview');

    const mockNote = isBusinessFile ? {
      title: `Business Meeting - ${fileName.replace(/\.[^/.]+$/, "")}`,
      content: "Important business discussion covering quarterly goals, team performance, and strategic initiatives. Multiple stakeholders provided input on key decisions.",
      category: "Work",
      tags: ["meeting", "business", "quarterly"],
      actionItems: [
        "Follow up on quarterly targets",
        "Schedule team performance reviews",
        "Prepare strategic initiative proposal"
      ],
      keyPoints: [
        "Q4 targets need adjustment",
        "Team morale is high",
        "New strategic initiatives approved"
      ]
    } : {
      title: `Voice Note - ${fileName.replace(/\.[^/.]+$/, "")}`,
      content: "Personal voice recording with various thoughts and ideas. Contains reflections on recent experiences and plans for upcoming activities.",
      category: "Personal",
      tags: ["personal", "thoughts", "ideas"],
      actionItems: [
        "Research mentioned topics",
        "Plan upcoming activities"
      ],
      keyPoints: [
        "Several interesting ideas to explore",
        "Good reflection on recent experiences"
      ]
    };

    return {
      id: Date.now().toString(),
      ...mockNote,
      audioUri: fileUri,
      fileName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      transcription: mockNote.content,
      processingStatus: 'completed'
    };
  };

  // Mock function to simulate AI chat/query processing
  const mockProcessChatQuery = async (query, notes) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock response based on query
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('summary') || queryLower.includes('summarize')) {
      return {
        type: 'summary',
        response: `Here's a summary of your notes: You have ${notes.length} total notes across various categories. Recent themes include work meetings, personal planning, and learning activities. Key action items are pending in ${Math.floor(notes.length * 0.3)} notes.`,
        relatedNotes: notes.slice(0, 3).map(note => note.id)
      };
    }
    
    if (queryLower.includes('action') || queryLower.includes('todo')) {
      const notesWithActions = notes.filter(note => note.actionItems && note.actionItems.length > 0);
      return {
        type: 'action_items',
        response: `You have action items in ${notesWithActions.length} notes. Here are the most recent ones that need attention.`,
        relatedNotes: notesWithActions.slice(0, 3).map(note => note.id)
      };
    }
    
    if (queryLower.includes('search') || queryLower.includes('find')) {
      const searchTerm = query.replace(/search|find|for/gi, '').trim();
      const matchingNotes = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return {
        type: 'search_results',
        response: `Found ${matchingNotes.length} notes related to "${searchTerm}". Here are the most relevant matches.`,
        relatedNotes: matchingNotes.slice(0, 5).map(note => note.id)
      };
    }
    
    // Default response
    return {
      type: 'general',
      response: `I understand you're asking about: "${query}". Based on your notes, I can help you organize, search, or summarize your content. Try asking me to "summarize my notes" or "find action items".`,
      relatedNotes: notes.slice(0, 2).map(note => note.id)
    };
  };

  // Mock function to simulate AI organization suggestions
  const mockGetOrganizationSuggestions = async (notes) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const suggestions = [
      {
        type: 'category_suggestion',
        title: 'Organize by Categories',
        description: 'I noticed you have notes that could be better categorized. Consider grouping similar topics together.',
        action: 'auto_categorize'
      },
      {
        type: 'tag_suggestion',
        title: 'Add Missing Tags',
        description: 'Some notes are missing relevant tags that would make them easier to find.',
        action: 'suggest_tags'
      },
      {
        type: 'action_reminder',
        title: 'Pending Action Items',
        description: `You have ${Math.floor(notes.length * 0.4)} action items that haven't been completed.`,
        action: 'review_actions'
      }
    ];

    return suggestions.slice(0, 2); // Return 2 random suggestions
  };

  const value = {
    mockProcessAudioToNote,
    mockProcessUploadedAudio,
    mockProcessChatQuery,
    mockGetOrganizationSuggestions,
    // Add more AI functions as needed
    isProcessing: false, // This could be state managed if needed
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
}; 