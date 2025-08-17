# AI Document Summarizer 📄✨

A powerful MERN stack application that leverages the Google Gemini API to summarize text, PDF, and DOCX files. Users can upload documents, provide custom prompts, edit the generated summaries, and share them seamlessly via email.

![Made with MERN](https://img.shields.io/badge/Made%20with-MERN-blue.svg)



---
## Key Features 🚀

* **Multi-Format Support:** Upload and process content from `.txt`, `.pdf`, and `.docx` files, or simply paste raw text.
* **Custom AI Prompts:** Guide the AI by providing custom instructions (e.g., "Summarize for a 5th grader," "Extract only action items").
* **Multiple File Handling:** Upload and combine several documents to be summarized together.
* **Interactive UI:** Easily add and remove files from the queue before processing.
* **Editable Summaries:** The generated summary is fully editable, allowing you to make refinements.
* **Email Sharing:** Share the final summary with multiple recipients directly from the app, with an option to add a custom message.

---
## Tech Stack & Modules Used 🛠️

#### **Frontend**
* **Core Libraries:**
    * `react`: A JavaScript library for building user interfaces.
    * `react-dom`: Serves as the entry point to the DOM and server renderers for React.
    * `axios`: A promise-based HTTP client for making API requests to the backend.
* **Styling:**
    * `tailwindcss`: A utility-first CSS framework for rapid UI development.
* **Build Tools & Development:**
    * `vite`: A next-generation frontend build tool and development server.
    * `eslint`: A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.

#### **Backend**
* **Core Framework:**
    * `express`: A minimal and flexible Node.js web application framework.
    * `node.js`: A JavaScript runtime environment.
* **API & Services:**
    * `@google/generative-ai`: The official Node.js client for the Google Gemini API.
    * `nodemailer`: A module for sending emails from the server via SMTP.
* **Middleware & Utilities:**
    * `cors`: Node.js package for providing a Connect/Express middleware that can be used to enable CORS.
    * `dotenv`: Loads environment variables from a `.env` file.
    * `multer`: Middleware for handling `multipart/form-data`, used for file uploads.
* **File Parsing:**
    * `pdf-parse`: A library to extract text content from PDF files.
    * `mammoth`: A library to convert `.docx` documents to HTML and extract raw text.
* **Development Tools:**
    * `nodemon`: A tool that automatically restarts the node application when file changes are detected.

---
## Getting Started 🏁

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

* **Node.js** (v18 or later recommended)
* **npm** (Node Package Manager)
* **Git**

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd AI_SUMMARIZER
    ```

2.  **Backend Setup:**
    * Navigate to the backend directory:
        ```bash
        cd backend
        ```
    * Create a `.env` file and add your secret keys. See the **Environment Variables** section below for details.
    * Install the dependencies:
        ```bash
        npm install
        ```
    * Start the backend server:
        ```bash
        npm start
        ```
    * The server will be running on `http://localhost:5001`.

3.  **Frontend Setup:**
    * Open a new terminal and navigate to the frontend directory:
        ```bash
        cd frontend
        ```
    * Create a `.env` file and add the API URL. See the **Environment Variables** section below.
    * Install the dependencies:
        ```bash
        npm install
        ```
    * Start the frontend development server:
        ```bash
        npm run dev
        ```
    * Open your browser and go to `http://localhost:5173` (or the port specified in your terminal).

---
## Environment Variables 🔒

You need to create `.env` files in both the `frontend` and `backend` directories.

#### **`backend/.env`**
```env
# Your Google Gemini API Key from Google AI Studio
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Your Gmail credentials for sending emails
# IMPORTANT: Use a 16-character Google App Password if you have 2-Step Verification
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-google-app-password"
