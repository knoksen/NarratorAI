# NarratorAI

Transform your documents into engaging audio narratives with AI-powered enhancement and text-to-speech.

**Available as:** Web Application | Windows Desktop App

**Current Version:** 1.1.0

---

## 🚀 Features

### Core Features
- **PDF Upload & Conversion:**  
  Upload PDF documents and convert them to editable Markdown format.

- **AI Content Enhancement:**  
  Use AI to add emotion, improve formatting, and enhance narrative quality for audio narration.

- **Text-to-Speech:**  
  Generate high-quality audio using Google's Gemini TTS with natural-sounding voices.

- **Interactive Audio Player:**  
  Play, pause, and control your generated audio with a beautiful player interface.

- **Export & Download:**  
  Download your enhanced audio as WAV files for use anywhere.

### Desktop App Features (Windows)
- **Native Windows Application:**  
  Run as a standalone desktop app with full offline support.

- **Settings & Preferences:**  
  Customizable settings with encrypted API key storage, theme selection, and voice preferences.

- **Auto-Update System:**  
  Automatic updates via GitHub Releases with user-friendly notifications.

- **Batch Processing:**  
  Process multiple PDF files in queue with progress tracking and pause/resume controls.

- **Recent Files:**  
  Quick access to recently processed files with keyboard shortcuts (Ctrl+1-9).

- **Toast Notifications:**  
  Native desktop notifications for processing status and system events.

---

## 📦 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/knoksen/NarratorAI.git
cd NarratorAI
```

1. **Install dependencies:**

```bash
npm install
```

1. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add your Google AI API key to `.env.local`:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

Get your API key from: <https://makersuite.google.com/app/apikey>

---

## 🛠️ Usage

### Web Application

1. **Start the development server:**

```bash
npm run dev
```

1. **Open your browser and navigate to:**  
   `http://localhost:9002`

1. **Use the application:**
   - Upload a PDF document (up to 10MB)
   - Review and edit the extracted text
   - Enhance the content with AI
   - Generate audio from the text
   - Download your audio file

### Windows Desktop App

1. **Download from Releases:**

Visit [Releases](https://github.com/knoksen/NarratorAI/releases/latest) to download:
- **Windows Installer** (recommended) - Includes shortcuts and uninstaller
- **Portable Version** - Run from any folder, no installation needed

2. **Or run in development mode:**

```bash
npm run electron:dev
```

This launches NarratorAI as a native Windows application.

3. **Or build your own installer:**

```bash
npm run build:win
```

Creates installer and portable versions in the `dist/` folder.

---

## 🤖 Automated Releases

NarratorAI includes complete release automation! See [AUTOMATION.md](AUTOMATION.md) for details.

**Quick release:**
```bash
npm run release -- 1.1.0
```

**GitHub Actions:** Push a tag to auto-build and release:
```bash
git tag v1.1.0
git push origin v1.1.0
```

See [electron/README.md](electron/README.md) for detailed desktop app documentation.

---
   - Upload a PDF document (up to 10MB)
   - Review and edit the extracted text
   - Enhance the content with AI
   - Generate audio from the text
   - Download your audio file

---

## 🤖 Technologies Used

- **Framework:** Next.js 16 with App Router
- **Desktop:** Electron (Windows native app)
- **Language:** TypeScript
- **AI:** Google Gemini 2.0 Flash (via Genkit)
- **TTS:** Google Gemini 2.5 Flash Preview TTS
- **UI:** React, Tailwind CSS, Radix UI
- **PDF Processing:** pdf-parse
- **Audio:** wav encoder
- **Build:** electron-builder

---

## 📁 Project Structure

```telectron/             # Electron desktop app files
│   ├── main.js          # Main process
│   ├── preload.js       # Preload script
│   └── README.md        # Desktop app docs
├── src/
│   ├── ai/              # AI flows and Genkit configuration
│   │   ├── genkit.ts
│   │   └── flows/
│   │       ├── convert-pdf-to-markdown.ts
│   │       ├── enhance-markdown-narrative.ts
│   │       └── convert-text-to-speech.ts
│   ├── app/             # Next.js app router pages
│   ├── components/      # React components
│   │   ├── narrator-ai/ # Main application components
│   │   └── ui/          # Reusable UI components
│   └── lib/             # Utility functions
├── public/              # Static assets
│   └── samples/         # Sample PDF files
├── test/                # Test files
│   ├── data/            # Test data
│   └── output/          # Test output
└── scripts/             # Build and utility scriptsF files
└── test/                 # Test files
    └── data/             # Test data
```

---

## 🧑‍💻 Contributing

We welcome contributions! To get started:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Create a Pull Request

Please review the [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

---

## 📚 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙋‍♂️ Contact

For questions, support, or feedback, please open an issue or reach out to [@knoksen](https://github.com/knoksen).

---

Enjoy creating with NarratorAI!
