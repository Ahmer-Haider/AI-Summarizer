import React from "react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

// --- Icon Components ---
const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    />
  </svg>
);
const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
    />
  </svg>
);
const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367-2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
    />
  </svg>
);
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

// --- API URL Configuration ---
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// --- Main App Component ---
function App() {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [prompt, setPrompt] = useState(
    "Summarize this document in concise bullet points."
  );
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [recipients, setRecipients] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (files.length > 0) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [files]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => {
      const newFiles = selectedFiles.filter(
        (file) => !prevFiles.some((prevFile) => prevFile.name === file.name)
      );
      return [...prevFiles, ...newFiles];
    });
    setText("");
    fileInputRef.current.value = "";
  };

  const handleDeleteFile = (fileNameToDelete) => {
    setFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileNameToDelete)
    );
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
    setFiles([]);
  };

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  const handleGenerateSummary = async () => {
    if (files.length === 0 && !text.trim()) {
      setError("Please upload a file or paste text to summarize.");
      return;
    }
    setError("");
    setIsLoading(true);
    setSummary("");

    const formData = new FormData();
    formData.append("prompt", prompt);

    if (files.length > 0) {
      files.forEach((file) => {
        formData.append("file", file);
      });
    } else {
      formData.append("text", text);
    }

    try {
      const response = await axios.post(`${API_URL}/summarize`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSummary(response.data.summary);
      setIsEditing(false);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Failed to generate summary.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!recipients) return;
    setShareStatus("Sending...");
    try {
      const recipientList = recipients.split(",").map((email) => email.trim());
      await axios.post(`${API_URL}/share`, {
        summary,
        recipients: recipientList,
        emailBody,
      });
      setShareStatus("Email sent successfully!");
      setTimeout(() => {
        setIsShareModalOpen(false);
        setShareStatus("");
        setRecipients("");
        setEmailBody("");
      }, 2000);
    } catch (err) {
      setShareStatus("Failed to send email.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-sans">
      <div className="w-full md:w-1/3 bg-white p-8 shadow-lg overflow-y-auto flex flex-col h-screen">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            AI Document Summarizer
          </h1>
          <p className="text-gray-500">Supports PDF, DOCX, and Text</p>
        </header>
        <div className="space-y-6 flex-grow">
          <div>
            <label className="text-lg font-semibold text-gray-700">
              1. Provide Content
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Paste text directly or upload one or more files.
            </p>
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Paste your text here..."
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <div className="my-4 text-center text-gray-500 font-semibold">
              OR
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt,.pdf,.docx"
              className="hidden"
              multiple
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="w-full flex items-center justify-center bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              <UploadIcon /> Upload File(s)
            </button>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-semibold text-gray-600">
                  Uploaded Files:
                </h3>
                {files.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded-md text-sm"
                  >
                    <span className="truncate pr-2">{file.name}</span>
                    <button
                      onClick={() => handleDeleteFile(file.name)}
                      className="p-1 rounded-full text-red-500 hover:bg-red-100"
                      title="Remove file"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="prompt"
              className="text-lg font-semibold text-gray-700"
            >
              2. Set Your Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows="3"
              className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-auto pt-6">
          <button
            onClick={handleGenerateSummary}
            disabled={isLoading || (files.length === 0 && !text)}
            className="w-full bg-green-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing Document..." : "✨ Generate Summary"}
          </button>
          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        </div>
      </div>
      <div className="w-full md:w-2/3 p-8 flex flex-col h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Generated Summary
          </h2>
          {copyStatus && (
            <span className="text-green-600 font-semibold transition-opacity duration-300">
              {copyStatus}
            </span>
          )}
        </div>
        <div className="relative flex-grow">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border rounded-lg">
              <svg
                className="animate-spin h-10 w-10 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="mt-4 text-lg text-gray-600">
                Generating summary, please wait...
              </p>
            </div>
          ) : (
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              readOnly={!isEditing}
              onFocus={() => setIsEditing(true)}
              placeholder="Your AI-generated summary will appear here..."
              className={`w-full h-full p-4 pr-6 pb-16 text-lg leading-relaxed border rounded-lg resize-none hover:ring-2 hover:ring-blue-200
                                        ${
                                          isEditing
                                            ? "bg-white ring-2 ring-blue-500"
                                            : "bg-gray-50 border-gray-200"
                                        }
                                        transition duration-300`}
            />
          )}
          {!isLoading && summary && (
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center px-3 py-2 text-sm font-semibold rounded-md transition ${
                  isEditing
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <EditIcon /> {isEditing ? "Save" : "Edit"}
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center bg-gray-200 text-gray-700 px-3 py-2 text-sm font-semibold rounded-md hover:bg-gray-300 transition"
              >
                <CopyIcon /> Copy
              </button>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center bg-gray-200 text-gray-700 px-3 py-2 text-sm font-semibold rounded-md hover:bg-gray-300 transition"
              >
                <ShareIcon /> Share
              </button>
            </div>
          )}
        </div>
      </div>
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Share via Email</h3>
            <div className="space-y-4">
              <input
                type="email"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="Enter Gmail IDs, separated by commas"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Add a custom message (optional)..."
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-lg resize-none"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {shareStatus || "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
