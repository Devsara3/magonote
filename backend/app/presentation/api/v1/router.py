from fastapi import APIRouter
from app.presentation.api.v1.endpoints.tasks import router as tasks_router
from app.presentation.api.v1.endpoints.voice import router as voice_router

api_router = APIRouter()
api_router.include_router(tasks_router, prefix="/api", tags=["tasks"])
api_router.include_router(voice_router, prefix="/api", tags=["voice"])
