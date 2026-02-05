from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.rag_service import rag_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        result = await rag_service.query(request.message)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
