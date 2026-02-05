Walkthrough - AI Document QA System

I have successfully built the AI Document Question Answering System using React, FastAPI, LangChain, and Ollama.

Architecture

check the architecture.png for better view.

Project Overview

The system allows users to upload PDF documents, which are then processed, indexed into a vector database (ChromaDB), and made available for conversational QA using a local LLM (Ollama).

Key Features

•	Document Upload: Securely upload and process PDF documents.

•	RAG Pipeline: Leverages LangChain for document ingestion, splitting, and vector search.

•	Local AI: Uses Ollama for embeddings (nomic-embed-text) and chat (llama3).

•	Interactive Chat: A modern React interface for real-time questions and answers with source attribution.

Setup & Usage

1. Requirements

 •	Ollama: Must be running locally.

 •	Models: llama3 and nomic-embed-text should be pulled (ollama pull llama3, ollama pull nomic-embed-text).

2. Backend

 1.	Navigate to the backend directory.

 2.	Install dependencies: pip install -r requirements.txt.

 3.	Start the server: python -m uvicorn app.main:app --reload.

 4.	API docs are available at http://localhost:8000/docs.

3. Frontend

 1.	Navigate to the frontend directory.

 2.	Install dependencies: npm install.

 3.	Start the dev server: npm run dev.

 4.	Open the app at http://localhost:5173.

Verification Results

 •	 Frontend Build: Successfully compiled without errors.

 •	 Backend Logic: API routes and RAG service implemented and verified (logic-wise).

•	 UI Components: Modern, responsive design using Tailwind CSS and Lucide icons.

NOTE

The application is configured to connect to Ollama at http://localhost:11434. Ensure Ollama is accessible.




