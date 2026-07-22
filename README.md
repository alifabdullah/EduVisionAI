# 🧠 EduVisionAI: Intelligent Learning Platform

Empowering personalized education through AI-driven insights and interactive learning environments for students and educators.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license/EduVisionAI-green)
![Stars](https://img.shields.io/github/stars/alifabdullah/EduVisionAI?style=social)
![Forks](https://img.shields.io/github/forks/alifabdullah/EduVisionAI?style=social)

![example-preview-image](/preview_example.png)

---

## ✨ Features

EduVisionAI is designed to transform the educational landscape by integrating cutting-edge AI with intuitive user experiences.

*   **✨ AI-Powered Personalized Learning:** Leverages Google's Generative AI to create dynamic content, provide tailored explanations, and adapt learning paths based on individual student needs and progress.
*   **📊 Interactive Dashboards & Analytics:** Offers comprehensive dashboards for both students and teachers, enabling students to track their progress and teachers to gain deep insights into class performance and individual student engagement using rich data visualizations.
*   **🔒 Secure & Scalable User Management:** Built with Supabase, providing robust authentication, secure data storage, and real-time database capabilities for managing student and teacher accounts efficiently.
*   **🚀 Real-time Performance Insights:** Utilizes libraries like Recharts and Graphifyy to deliver immediate visual feedback on quizzes, assignments, and overall academic trends, helping identify areas for improvement swiftly.
*   **📱 Responsive & Modern UI:** Developed with Next.js and React, ensuring a seamless, high-performance, and visually appealing user experience across all devices, from desktops to mobile phones.

---

## 🛠️ Installation Guide

Follow these steps to get EduVisionAI up and running on your local machine.

### Prerequisites

Ensure you have the following installed:

*   [Node.js](https://nodejs.org/en/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Step-by-Step Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/alifabdullah/EduVisionAI.git
    cd EduVisionAI
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Configuration:**
    Create a `.env.local` file in the root directory of the project and add your environment variables. You will need keys for Supabase and Google Generative AI.

    ```dotenv
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    GOOGLE_API_KEY=YOUR_GOOGLE_GENERATIVE_AI_API_KEY
    ```
    *   Obtain your Supabase URL and Anon Key from your [Supabase project settings](https://app.supabase.com/).
    *   Generate a Google Generative AI API Key from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

4.  **Run the Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will now be accessible at `http://localhost:3000`.

---

## 🚀 Usage Examples

Once the application is running, you can access the login page to begin.

### Basic Application Flow

1.  **Access the Application:** Open your web browser and navigate to `http://localhost:3000`.
2.  **Role Selection:** Choose whether to log in as a `Student` or `Teacher`.
3.  **Authentication:** Sign up or log in using your credentials (managed by Supabase).
4.  **Dashboard Access:**
    *   **Students:** Access personalized learning paths, AI-generated explanations, and track progress on quizzes and assignments.
    *   **Teachers:** Monitor student performance, view analytics, and manage course content.

### Example UI (Placeholder)

Below is a conceptual view of how a dashboard might look:

![Student Dashboard Example](/preview_example.png)
_This image is a placeholder. A live screenshot will be provided upon feature completion._

---

## 🗺️ Project Roadmap

EduVisionAI is under active development, with exciting features planned for future releases.

### Upcoming Milestones

*   **V1.1 - Enhanced AI Agents & Content:**
    *   Implement more sophisticated AI agents for dynamic tutoring and personalized feedback.
    *   Introduce interactive quiz types and AI-generated practice questions.
    *   Expand content library with diverse subjects and learning formats.
*   **V1.2 - Collaborative Learning & Community Features:**
    *   Integrate peer-to-peer learning features, allowing students to collaborate and support each other.
    *   Develop discussion forums and community spaces for knowledge sharing.
    *   Enable teachers to create and manage group projects.
*   **Future Enhancements:**
    *   Mobile application development for iOS and Android.
    *   Integration with popular Learning Management Systems (LMS).
    *   Advanced analytics with predictive modeling for student success.

---

## 🤝 Contribution Guidelines

We welcome contributions to EduVisionAI! Please follow these guidelines to ensure a smooth collaboration process.

### Code Style

*   Adhere to the existing code style, enforced by ESLint and Prettier.
*   Run `npm run lint` and `npm run format` before committing.

### Branch Naming

*   Use descriptive branch names following a conventional pattern:
    *   `feature/your-feature-name`
    *   `bugfix/issue-description`
    *   `docs/update-readme`

### Pull Request Process

1.  **Fork** the repository and **clone** your fork.
2.  Create a new branch from `main`.
3.  Make your changes and ensure they are well-tested.
4.  Commit your changes with clear, concise messages.
5.  Push your branch to your fork.
6.  Open a Pull Request (PR) to the `main` branch of the original repository.
7.  Provide a detailed description of your changes in the PR.
8.  Ensure all automated checks pass.

### Testing

*   All new features and bug fixes should be accompanied by relevant tests.
*   Ensure existing tests pass before submitting a PR.

---

## ⚖️ License Information

This project is currently **unlicensed**. There is no specific open-source license associated with EduVisionAI at this time. All rights are reserved by the project contributors.

Copyright © 2024 alifabdullah. All rights reserved.
