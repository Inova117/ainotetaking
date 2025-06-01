# AI Note Organizer

A powerful AI-driven note-taking application that transforms voice recordings and audio uploads into organized, structured notes with intelligent categorization and insights.

## 🎯 Overview

AI Note Organizer is a cross-platform mobile application built with React Native and Expo that leverages artificial intelligence to help users capture, organize, and manage their thoughts and ideas efficiently. The app combines voice recording capabilities with AI-powered transcription and content organization to create a seamless note-taking experience.

## ✨ Key Features

### 🎙️ Voice Recording & Transcription
- **Real-time voice recording** with high-quality audio capture
- **AI-powered transcription** using OpenAI Whisper API
- **Audio file upload** support for existing recordings
- **Offline recording** with cloud sync capabilities

### 🧠 AI-Powered Organization
- **Intelligent content analysis** and categorization
- **Automatic title generation** based on content
- **Key insights extraction** from notes
- **Action items identification** and tracking
- **Smart tagging** and topic classification
- **Question generation** for further exploration

### 📊 Smart Dashboard
- **Visual analytics** of note-taking patterns
- **Category distribution** charts and statistics
- **Recent activity** tracking
- **Quick access** to frequently used notes
- **Progress tracking** for action items

### 📚 Advanced Note Management
- **Structured note display** with organized sections
- **Search and filter** capabilities
- **Favorites and archiving** system
- **Export functionality** (PDF, text, markdown)
- **Sharing capabilities** across platforms

### ⚙️ Customization & Settings
- **Personalized categories** and tags
- **Recording quality** preferences
- **AI processing** settings
- **Theme customization** options
- **Notification preferences**

## 🏗️ Technical Architecture

### Frontend (React Native + Expo)
- **Cross-platform compatibility** (iOS, Android, Web)
- **Modern UI/UX** with React Native Paper
- **Navigation** with React Navigation
- **State management** using React Context
- **Local storage** with SQLite

### Backend (Next.js API Routes)
- **RESTful API** endpoints
- **AI integration** with OpenAI GPT-4 and Whisper
- **Audio processing** and transcription
- **Content organization** and analysis

### AI Integration
- **OpenAI Whisper** for speech-to-text transcription
- **OpenAI GPT-4** for content analysis and organization
- **Structured data extraction** using Zod schemas
- **Intelligent categorization** and insights generation

### Data Management
- **SQLite database** for local storage
- **Structured note schema** with rich metadata
- **Search optimization** with full-text search
- **Data export** capabilities

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- OpenAI API key
- iOS Simulator or Android Emulator (for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-note-organizer.git
   cd ai-note-organizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy the example environment file and configure your API key:
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Install required packages for AI functionality**
   ```bash
   npm install @ai-sdk/openai ai zod lucide-react
   npm install @radix-ui/react-tabs # for web UI components
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on your preferred platform**
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

### Configuration

#### Audio Permissions
The app requires microphone permissions for voice recording. These are automatically requested on first use.

#### API Configuration
Ensure your OpenAI API key has access to:
- GPT-4 model for content organization
- Whisper model for audio transcription

⚠️ **Security Note**: Never commit your `.env.local` file to version control. The API key should only be stored in environment variables.

## 🔒 Security

This application implements several security measures:

- **Environment Variables**: All API keys are stored securely in environment variables
- **Input Validation**: All API endpoints validate incoming data
- **File Upload Limits**: Audio files are limited to 25MB with type validation
- **Secure Error Handling**: Generic error messages prevent information leakage
- **HTTPS Only**: All API communications use encrypted connections

For detailed security information, see [SECURITY.md](SECURITY.md).

## 📱 Usage Guide

### Recording Notes
1. Navigate to the **Record** tab
2. Tap the record button to start capturing audio
3. Speak your thoughts, ideas, or meeting notes
4. Stop recording when finished
5. The app will automatically transcribe and organize your content

### Uploading Audio Files
1. Go to the **Upload** tab
2. Select an audio file from your device
3. Wait for processing and transcription
4. Review and edit the organized content

### Managing Notes
1. View all notes in the **Notes** tab
2. Use search and filters to find specific content
3. Mark important notes as favorites
4. Archive completed or outdated notes
5. Export notes in various formats

### Dashboard Analytics
1. Check the **Dashboard** for insights
2. View note-taking patterns and statistics
3. Track action items and progress
4. Access recently created notes

## 🔧 Development

### Project Structure
```
ai-note-organizer/
├── app/                    # Next.js API routes
│   ├── api/
│   │   ├── chat/          # AI chat functionality
│   │   ├── organize/      # Content organization
│   │   └── transcribe/    # Audio transcription
│   └── page.tsx           # Web interface
├── components/            # Reusable UI components
├── src/                   # React Native source
│   ├── components/        # Mobile UI components
│   ├── context/          # State management
│   └── screens/          # App screens
├── App.js                # Main React Native app
├── env.example           # Environment variables template
├── SECURITY.md           # Security guidelines
└── package.json          # Dependencies
```

### Key Components
- **AIContext**: Manages AI processing and API calls
- **DatabaseContext**: Handles local data storage
- **NotesContext**: Manages note state and operations
- **VoiceRecorder**: Audio recording functionality
- **NoteCard**: Individual note display component

### API Endpoints
- `POST /api/transcribe` - Audio transcription
- `POST /api/organize` - Content organization
- `POST /api/chat` - AI chat interface

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Manual Testing Checklist
- [ ] Voice recording functionality
- [ ] Audio file upload
- [ ] Transcription accuracy
- [ ] Content organization
- [ ] Note search and filtering
- [ ] Export functionality
- [ ] Cross-platform compatibility

## 📦 Deployment

### Mobile App Deployment
1. **Build for production**
   ```bash
   expo build:ios
   expo build:android
   ```

2. **Submit to app stores**
   - Follow Expo's deployment guide
   - Ensure all permissions are properly configured

### Web Deployment
1. **Build web version**
   ```bash
   npm run build
   ```

2. **Deploy to hosting platform**
   - Vercel, Netlify, or similar
   - Configure environment variables in platform dashboard
   - **Never commit API keys to repository**

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues
- **Microphone permissions**: Ensure the app has microphone access
- **API errors**: Verify your OpenAI API key is valid and has sufficient credits
- **Transcription quality**: Use clear audio in quiet environments
- **Environment variables**: Ensure `.env.local` file is properly configured

### Getting Help
- Check the [Issues](https://github.com/yourusername/ai-note-organizer/issues) page
- Join our [Discord community](https://discord.gg/your-invite)
- Email support: support@ainoteorganizer.com

## 🙏 Acknowledgments

- OpenAI for providing powerful AI models
- Expo team for the excellent development platform
- React Native community for continuous innovation
- All contributors and beta testers

## 📊 Stats

- **Supported Platforms**: iOS, Android, Web
- **Languages**: JavaScript, TypeScript
- **AI Models**: GPT-4, Whisper
- **Database**: SQLite
- **UI Framework**: React Native Paper

---

**Made with ❤️ by the AI Note Organizer Team** 