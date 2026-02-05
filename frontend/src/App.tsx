import { DocumentUpload } from './components/features/DocumentUpload'
import { ChatInterface } from './components/features/ChatInterface'

function App() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">AI Document Question Answering</h1>
          <p className="text-slate-500 mt-2">Powered by RAG, LangChain, and Ollama</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <DocumentUpload />
          </div>
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
