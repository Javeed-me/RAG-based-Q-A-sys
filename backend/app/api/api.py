from fastapi import APIRouter
from app.api.v1 import upload, chat

api_router = APIRouter()
api_router.include_router(upload.router, prefix="/documents", tags=["documents"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
