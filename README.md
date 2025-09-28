<p align="center">
  <img src="https://raw.githubusercontent.com/user-attachments/assets/9417d3d7-8495-467f-aa02-990714ed4714" width="150" alt="Wathiq AI Logo">
</p>

<h1 align="center">Wathiq AI - Your Digital Safety Toolkit</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Gemini AI">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License: MIT">
</p>

<h3 align="center">Stay Safe and Confident in the Digital World</h3>

<p align="center">
  <strong>Wathiq (واثق)</strong>, meaning "confident" or "trustworthy" in Arabic, is an advanced AI-powered web application designed to empower users with the tools to navigate the digital landscape safely. It provides a suite of utilities to detect deepfakes, verify news, check URL safety, and enhance cybersecurity knowledge through interactive, AI-generated learning modules.
</p>

---

## 🖼️ App Preview

_This is a space for your application's screenshots. Replace the HTML comments in the `src` attributes below with actual URLs to screenshots of your running application._

<table>
  <tr>
    <td align="center"><b>Home Page</b></td>
    <td align="center"><b>Media Scanner Results</b></td>
  </tr>
  <tr>
    <td><img src="<!-- YOUR_HOME_PAGE_SCREENSHOT_URL_HERE -->" width="100%" alt="Home Page Screenshot"></td>
    <td><img src="<!-- YOUR_SCANNER_PAGE_SCREENSHOT_URL_HERE -->" width="100%" alt="Scanner Page Screenshot"></td>
  </tr>
  <tr>
    <td align="center"><b>URL Scan Results</b></td>
    <td align="center"><b>Learning Hub</b></td>
  </tr>
  <tr>
    <td><img src="<!-- YOUR_URL_SCAN_PAGE_SCREENSHOT_URL_HERE -->" width="100%" alt="URL Scan Page Screenshot"></td>
    <td><img src="<!-- YOUR_LEARNING_HUB_PAGE_SCREENSHOT_URL_HERE -->" width="100%" alt="Learning Hub Page Screenshot"></td>
  </tr>
</table>

## 📋 Table of Contents

- [About The Project](#-about-the-project)
  - [Key Features](#-key-features)
  - [Built With](#️-built-with)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 About The Project

Wathiq AI is more than just a tool; it's a comprehensive digital safety companion. In an era of rampant misinformation and sophisticated digital threats, Wathiq provides users with a clear, trustworthy, and educational platform to verify the authenticity of digital content and learn how to stay protected.

Our mission is to build digital confidence by making advanced AI-powered security tools accessible to everyone, regardless of technical expertise.

### ✨ Key Features

-   **🤖 AI Media Scanner**: Perform forensic analysis on images and videos to detect signs of AI generation, manipulation, or deepfakes.
-   **🔗 AI URL Safety Scanner**: Analyze URLs for phishing, malware, or scams using AI analysis grounded with real-time Google Search results.
-   **📰 AI News Verification**: Combat misinformation by analyzing news headlines or articles for bias, propaganda, and factual inconsistencies.
-   **🔑 Secure Password Checker**: Instantly check password strength with an offline analyzer (`zxcvbn`) that provides actionable feedback without sending your password over the network.
-   **🎓 Gamified Learning Hub**: Embark on an interactive learning path with AI-generated lessons and quizzes tailored to different age groups (kids, teens, adults).
-   **👤 User Progression System**: Track stats, earn points, level up, and view a history of your scans.
-   **🌍 Multilingual & Themed**: Full support for English and Arabic (RTL), complete with light and dark modes for a personalized experience.

### 🛠️ Built With

This project leverages a modern and powerful stack to deliver a seamless user experience:

*   **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.
*   **[TypeScript](https://www.typescriptlang.org/)**: For strong typing and more robust code.
*   **[Google Gemini API](https://ai.google.dev/)**: The core AI engine for all analysis and content generation.
*   **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
*   **[Framer Motion](https://www.framer.com/motion/)**: For fluid and beautiful animations.
*   **[React Router](https://reactrouter.com/)**: For client-side routing.
*   **[zxcvbn](https://github.com/dropbox/zxcvbn)**: For secure, offline password strength estimation.
*   **[Lucide React](https://lucide.dev/)**: A beautiful and consistent icon set.

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)
-   A **Google Gemini API Key**. You can get one from [Google AI Studio](https://ai.google.dev/tutorials/get_started_web).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/wathiq-ai.git
    cd wathiq-ai
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    -   Create a new file named `.env` in the project root.
    -   Add your Google Gemini API key to the `.env` file:
        ```env
        API_KEY=YOUR_GEMINI_API_KEY_HERE
        ```
    > **Security Note**: This project uses the API key on the client-side for demonstration purposes. In a production environment, you **must** proxy API calls through a secure backend to protect your key.

4.  **Run the development server:**
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000` (or the next available port).

## 📂 Project Structure

The project follows a standard React application structure, organized for clarity and scalability.

```
/
├── public/              # Public assets and index.html
├── src/
│   ├── components/      # Reusable UI and layout components
│   │   ├── layout/
│   │   └── ui/
│   ├── contexts/        # React contexts (Theme, Language)
│   ├── hooks/           # Custom hooks (e.g., useUserProgress)
│   ├── pages/           # Page components for each route
│   ├── services/        # API interaction layers (geminiService.ts)
│   ├── utils/           # Helper functions
│   ├── App.tsx          # Main app component with routing
│   └── index.tsx        # Application entry point
├── .env.example         # Example environment variables
├── package.json
└── README.md
```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. This project is open-source and you are free to use and modify it.
