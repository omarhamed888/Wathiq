
# Wathiq AI - Your Digital Safety Toolkit

<p align="center">
  <img src="https://raw.githubusercontent.com/user-attachments/assets/9417d3d7-8495-467f-aa02-990714ed4714" width="150" alt="Wathiq AI Logo">
</p>

<h2 align="center">Stay Safe in the Digital World</h2>

<p align="center">
  <strong>Wathiq (واثق)</strong>, meaning "confident" or "trustworthy" in Arabic, is an advanced AI-powered web application designed to empower users with the tools to navigate the digital landscape safely and confidently. It provides a suite of utilities to detect deepfakes, verify news, check URL safety, analyze password strength, and enhance cybersecurity knowledge through interactive learning modules.
</p>

---

## ✨ Key Features

-   **🤖 AI Media Scanner**: Upload images or videos to perform a forensic analysis, detecting signs of AI generation, manipulation, or deepfakes.
-   **🔗 AI URL Safety Scanner**: Analyze any URL for potential threats like phishing, malware, or scams using AI analysis grounded with Google Search results.
-   **📰 AI News Verification**: Combat misinformation by analyzing news headlines or articles for bias, propaganda techniques, and factual inconsistencies.
-   **🔑 Password Strength Checker**: Instantly check password strength with an offline, secure analyzer (`zxcvbn`) that provides actionable feedback without sending your password over the network.
-   **🎓 Cybersecurity Learning Hub**: An interactive, gamified learning path with AI-generated lessons and quizzes tailored to different age groups (kids, teens, adults).
-   **👤 User Profile & Progress**: Track your stats, level up, and view your scan history.
-   **🌍 Multilingual & Theming**: Full support for English and Arabic (RTL), along with light and dark modes.

## 🛠️ Tech Stack

-   **Frontend**: [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
-   **AI**: [Google Gemini API](https://ai.google.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Routing**: [React Router](https://reactrouter.com/)
-   **Password Analysis**: [zxcvbn](https://github.com/dropbox/zxcvbn)
-   **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) or a compatible package manager
-   A [Google Gemini API Key](https://ai.google.dev/tutorials/get_started_web)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/wathiq-ai.git
    cd wathiq-ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    -   Create a new file named `.env` in the root of the project.
    -   Copy the contents from `.env.example` into your new `.env` file.
    -   Add your Google Gemini API key to the `.env` file:
        ```
        API_KEY=YOUR_GEMINI_API_KEY_HERE
        ```
    > **Security Note**: The API key is used directly on the client-side in this project for demonstration purposes. In a production environment, you **must** proxy these API calls through a secure backend to protect your key.

4.  **Run the development server:**
    ```bash
    npm start
    ```
    The application should now be running on `http://localhost:3000` (or another available port).

## 📂 Project Structure

The project follows a standard React application structure, organized by feature and domain.

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

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.
