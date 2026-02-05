import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from app.core.config import settings

class RAGService:
    def __init__(self):
        self.embeddings = OllamaEmbeddings(
            base_url=settings.OLLAMA_BASE_URL,
            model=settings.EMBEDDING_MODEL
        )
        self.llm = ChatOllama(
            base_url=settings.OLLAMA_BASE_URL,
            model=settings.CHAT_MODEL
        )
        self.vector_store_path = "chroma_db"

    async def ingest_document(self, file_path: str):
        loader = PyPDFLoader(file_path)
        documents = loader.load()
        
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        chunks = text_splitter.split_documents(documents)
        
        vector_db = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            persist_directory=self.vector_store_path
        )
        return {"status": "success", "chunks": len(chunks)}

    async def query(self, question: str):
        vector_db = Chroma(
            persist_directory=self.vector_store_path,
            embedding_function=self.embeddings
        )
        retriever = vector_db.as_retriever()

        # Define the prompt template
        template = """Answer the question based only on the following context:
        {context}

        Question: {question}
        """
        prompt = ChatPromptTemplate.from_template(template)

        # Build the RAG chain using LCEL
        rag_chain = (
            {"context": retriever, "question": RunnablePassthrough()}
            | prompt
            | self.llm
            | StrOutputParser()
        )
        
        # In modern LangChain, we can invoke the chain directly
        answer = await rag_chain.ainvoke(question)
        
        # For sources, we can retrieve them separately to keep the LCEL chain simple
        source_docs = await retriever.ainvoke(question)
        
        return {
            "answer": answer,
            "sources": [doc.metadata.get("source") for doc in source_docs]
        }

rag_service = RAGService()
