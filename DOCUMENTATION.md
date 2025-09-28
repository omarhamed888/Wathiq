
# Wathiq AI - Full Documentation

This document provides an in-depth explanation of the Wathiq AI project's architecture, components, services, and state management.

## 1. Introduction

### 1.1. Project Overview

Wathiq AI is a client-side web application built with React and TypeScript, designed as a comprehensive digital safety toolkit. It leverages the Google Gemini API to provide powerful analysis features for media, URLs, and news. The application is designed to be user-friendly, responsive, and educational, with a focus on privacy and security.

### 1.2. Target Audience

The application is built for a general audience, with specific content (like the Learning Hub) tailored for different age groups: kids, teens, and adults. It serves anyone looking to enhance their awareness and safety in the digital world.

---

## 2. Architecture

### 2.1. Frontend Architecture

The application is a Single Page Application (SPA) built on **React**. Key architectural patterns include:

-   **Component-Based Structure**: The UI is broken down into small, reusable components located in `src/components`.
-   **Declarative UI**: State changes automatically trigger UI updates, managed by React's lifecycle.
-   **Routing**: Client-side routing is handled by **React Router DOM**, allowing for seamless navigation between different pages without full page reloads.

### 2.2. State Management

State is managed using a combination of React hooks and `localStorage`:

-   **Local Component State**: `useState` is used for state that is local to a single component (e.g., form inputs, loading states).
-   **Global State**: `useContext` is used for application-wide state that is shared across many components:
    -   `ThemeContext`: Manages the light/dark mode theme.
    -   `LanguageContext`: Manages the application language (English/Arabic) and provides translation functions.
-   **Persistent User State**: The custom hook `useUserProgress` (`src/hooks/useUserProgress.ts`) manages all user-specific data (profile, points, completed lessons). It uses `localStorage` to persist this data across sessions, providing a continuous user experience.

### 2.3. Styling

-   **Tailwind CSS**: A utility-first CSS framework is used for all styling. This allows for rapid development and a consistent design system.
-   **Dark Mode**: The theme is managed via the `ThemeContext` which adds a `dark` class to the `<html>` element, enabling Tailwind's `dark:` variants.
-   **RTL Support**: The `LanguageContext` adds `dir="rtl"` to the `<html>` element when the language is Arabic, allowing for CSS properties like `margin-inline-start` and Flexbox to adapt automatically.

---

## 3. Core Features & Implementation

### 3.1. Gemini API Service (`src/services/geminiService.ts`)

This file is the central point of interaction with the Google Gemini API. It abstracts all API calls into dedicated, asynchronous functions.

**Security Warning**: In this project, the API key is used on the client-side for demonstration purposes. **This is not secure for a production application.** In a real-world scenario, all calls to the Gemini API must be proxied through a secure backend server where the API key can be stored safely.

#### Key Functions:

-   **`analyzeImage(base64Image, mimeType)`**:
    -   **Purpose**: Analyzes an image for signs of AI generation or manipulation.
    -   **Prompt**: Instructs the model to act as a forensic image analyst, checking for inconsistencies in anatomy, lighting, background, texture, and AI artifacts.
    -   **Schema (`imageForensicsSchema`)**: Enforces a strict JSON output containing a `verdict`, `trust_score`, `summary`, and `detailed_findings`.

-   **`analyzeVideo(base64Video, mimeType)`**:
    -   **Purpose**: Analyzes a video for signs of deepfakes or manipulation.
    -   **Prompt**: Similar to image analysis, but focused on video-specific artifacts like facial movements, lip-sync, object consistency, and compression.
    -   **Schema (`videoForensicsSchema`)**: Enforces a JSON output tailored for video analysis.

-   **`analyzeUrlWithGemini(url)`**:
    -   **Purpose**: Scans a URL for safety and potential threats.
    -   **Configuration**: Uses the `googleSearch` tool to ground the AI's response in real-time web search results.
    -   **Prompt**: Instructs the model to act as a cybersecurity analyst, identify threats (phishing, malware, scams), and provide a verdict, summary, and list of threats. It then parses the free-text response into a structured object.

-   **`verifyNewsWithGemini(query)`**:
    -   **Purpose**: Fact-checks a news headline or claim.
    -   **Prompt**: Asks the model to act as an expert fact-checker, analyzing factual accuracy, source credibility, language tone, and propaganda techniques.
    -   **Schema (`newsAnalysisSchema`)**: Enforces a JSON output with a `verdict`, `credibility_score`, `summary`, and lists of key findings and detected biases.

-   **"Generate Once" Caching in Learning Hub**
    -   **Purpose**: The Learning Hub uses `generateLearningContent` to create dynamic lessons. To prevent re-generating the same lesson on every view (which costs API calls and time), the content is generated once and then cached in `localStorage` via the `useUserProgress` hook.
    -   **Workflow**:
        1. User clicks a lesson.
        2. The app checks if the lesson content exists in the `moduleCache`.
        3. **If cached**: The content is loaded instantly from `localStorage`.
        4. **If not cached**: The app calls `generateLearningContent`, displays a loading state, and upon receiving the response, saves the content to the `moduleCache` before displaying it.
    -   This ensures a fast, efficient, and cost-effective user experience on subsequent visits.

### 3.2. User Progress Hook (`src/hooks/useUserProgress.ts`)

This custom hook is the single source of truth for all user-related data.

-   **State**: Manages `user` (profile info), `stats`, `completedModules`, and `moduleCache`.
-   **Persistence**: Uses `useEffect` hooks to write any changes to these state variables into `localStorage`, ensuring data is saved between sessions.
-   **Initialization**: When the hook is first called, it reads from `localStorage` to hydrate the initial state. If no data is found, it falls back to a default initial state.
-   **Functions**:
    -   `completeModule(moduleId, points)`: Adds a module to the `completedModules` set and updates the user's points and level.
    -   `updateProfilePhoto(base64)`: Updates the user's profile picture.
    -   `cacheModuleContent(moduleId, data)`: The key function for the "Generate Once" pattern, saving generated lesson content to the cache.

### 3.3. Password Checker (`src/pages/PasswordCheckerPage.tsx`)

This component demonstrates a key security principle: **never send sensitive data like passwords over the network unless absolutely necessary.**

-   **Offline Analysis**: It uses the `zxcvbn` library, loaded via a `<script>` tag in `index.html`.
-   **Debounced Input**: A `setTimeout` in a `useEffect` hook waits for the user to stop typing before running the analysis, preventing performance issues on every keystroke.
-   **No API Calls**: The analysis is performed entirely in the browser. The `geminiService` is not used here.

---

## 4. Component Library (`src/components`)

### 4.1. UI Components (`/ui`)

These are generic, reusable components that form the building blocks of the application's UI.

-   `Card.tsx`: A flexible container component with `CardHeader`, `CardTitle`, and `CardContent` parts.
-   `Button.tsx`: A versatile button with `variant` and `size` props for different styles.
-   `Input.tsx`: A styled text input component.
-   `Alert.tsx`: A component for displaying informational or error messages, with a `destructive` variant.

### 4.2. Layout Components (`/layout`)

-   `Layout.tsx`: The main layout wrapper that includes the sidebar and the main content area. It handles the mobile vs. desktop view.
-   `Sidebar.tsx`: The primary navigation component, containing `NavLink` items from React Router for page navigation.

---

## 5. Deployment

### 5.1. Build Process

To create a production-ready build, run:
```bash
npm run build
```
This command will create a `build` directory with optimized, minified, and static HTML, CSS, and JavaScript files.

### 5.2. Hosting

The `build` directory can be deployed to any static web hosting service, such as:

-   Vercel
-   Netlify
-   GitHub Pages
-   Firebase Hosting

Since this is a client-side application, no server-side logic is required for hosting.
