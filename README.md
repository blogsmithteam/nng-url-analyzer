# URL Brand Tone Analyzer

A powerful web application that analyzes the tone of voice of websites using the Nielsen Norman Group's methodology combined with AI-powered insights. Perfect for brand managers, content strategists, and UX professionals who need to understand and compare brand voice across different websites.

## 🚀 Features

### Core Analysis
- **AI-Powered Analysis**: Uses OpenAI's GPT-4 to analyze website content with professional-grade accuracy
- **Nielsen Norman Methodology**: Based on the industry-standard 4-dimension tone framework
- **Real-time Processing**: Fetches and analyzes live website content
- **Fallback Analysis**: Intelligent heuristic analysis when AI analysis isn't available

### Tone Dimensions
Analyzes websites across four key dimensions:
- **Formality**: Very Casual → Very Formal
- **Seriousness**: Very Funny → Very Serious  
- **Enthusiasm**: Very Subdued → Very Lively
- **Respectfulness**: Irreverent → Very Respectful

### Advanced Features
- **Multi-URL Comparison**: Compare tone profiles across up to 5 websites simultaneously
- **Interactive Visualizations**: Radar charts and detailed comparison views
- **Detailed Explanations**: Score explanations with specific text examples
- **Export Functionality**: Download analysis results as CSV files
- **Brand Word Extraction**: Identify key brand vocabulary and messaging patterns
- **Writing Tips**: Actionable recommendations for maintaining consistent tone

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI GPT-4 API
- **Charts**: Custom Canvas-based radar charts
- **Icons**: Lucide React

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ 
- OpenAI API key

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd url-brand-tone-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### API Key Setup

The application supports two API key modes:

#### Option 1: Use Your Own OpenAI Key (Recommended)
- Click "Provide Your Own Key" during setup
- Enter your OpenAI API key (starts with `sk-`)
- Key is stored securely in your browser's localStorage
- Direct API calls to OpenAI with full control over usage

#### Option 2: Product Key
- Managed service option (requires backend implementation)
- No setup required for end users

## 📊 How It Works

### 1. Content Extraction
- Fetches website content using CORS proxies
- Removes scripts, styles, and non-content elements
- Extracts and normalizes text for analysis

### 2. AI Analysis
- Sends cleaned content to OpenAI GPT-4
- Uses specialized prompts based on Nielsen Norman methodology
- Returns structured analysis with scores and examples

### 3. Visualization
- Interactive tone scales with explanations
- Expandable sections with text examples
- Comparison charts for multiple URLs
- Export capabilities for further analysis

## 🎯 Use Cases

### Brand Management
- **Brand Audit**: Analyze your website's current tone profile
- **Competitor Analysis**: Compare your tone against competitors
- **Consistency Check**: Ensure tone consistency across different pages
- **Rebranding**: Measure tone changes during brand evolution

### Content Strategy
- **Voice Guidelines**: Develop data-driven brand voice guidelines
- **Content Planning**: Plan content that matches your desired tone
- **Team Alignment**: Share objective tone analysis with content teams
- **Performance Tracking**: Monitor tone consistency over time

### UX Research
- **User Perception**: Understand how your tone affects user experience
- **A/B Testing**: Compare different tone approaches
- **Accessibility**: Ensure your tone is appropriate for your audience
- **Localization**: Adapt tone for different markets and cultures

## 📈 Analysis Output

### Tone Profile
- **Numerical Scores**: 0-100 scale for each dimension
- **Dominant Terms**: Human-readable tone descriptors
- **Score Explanations**: What each score means in practical terms
- **Text Examples**: Specific quotes that demonstrate each dimension

### Detailed Analysis
- **Dimension Breakdowns**: In-depth analysis of each tone aspect
- **Supporting Evidence**: Actual text examples from the website
- **Brand Voice Summary**: Overall tone characterization

### Actionable Insights
- **Writing Tips**: Specific recommendations for tone improvement
- **Brand Words**: Key vocabulary that defines the brand voice
- **Consistency Recommendations**: Suggestions for maintaining tone

## 🔒 Privacy & Security

- **Client-Side Processing**: All analysis happens in your browser
- **No Data Storage**: Website content is not stored on any servers
- **API Key Security**: Keys stored locally, never transmitted except to OpenAI
- **HTTPS Only**: All communications encrypted
- **Session-Only**: API keys can be cleared at any time

## 📋 Export & Integration

### CSV Export
- Dimension scores for all analyzed URLs
- Dominant traits and analysis metadata
- Timestamp and analysis mode information
- Compatible with Excel, Google Sheets, and data analysis tools

### Data Format
```csv
URL,Label,Formality,Seriousness,Enthusiasm,Respectfulness,Dominant_Traits,Analysis_Mode,Timestamp
```

## 🚀 Deployment

### Netlify (Recommended)
The application is optimized for Netlify deployment:

```bash
npm run build
```

Deploy the `dist` folder to Netlify or use their Git integration.

### Other Platforms
Compatible with any static hosting service:
- Vercel
- GitHub Pages  
- AWS S3 + CloudFront
- Firebase Hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 References

- [Nielsen Norman Group - Tone of Voice Dimensions](https://www.nngroup.com/articles/tone-of-voice-dimensions/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Brand Voice Guidelines Best Practices](https://www.nngroup.com/articles/brand-voice-guidelines/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues, questions, or feature requests:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include browser console errors if applicable
4. Provide example URLs that demonstrate the issue

## 🔮 Roadmap

- [ ] Batch analysis for multiple pages from same domain
- [ ] Historical tracking and trend analysis
- [ ] Integration with popular CMS platforms
- [ ] Advanced filtering and search capabilities
- [ ] Team collaboration features
- [ ] API endpoint for programmatic access
- [ ] Mobile app version

---

**Built with ❤️ for brand professionals and content strategists**