from fastapi import APIRouter, HTTPException
from app.application.voice.use_cases import handle_voice_command
from app.application.task.use_cases import get_current_task
from app.domain.task.value_objects import TaskStatus

router = APIRouter()


@router.post("/voice-command")
async def voice_command():
    """Record 5s audio → Whisper → GPT-4o intent → auto-launch matched task."""
    current = get_current_task()
    if current and current.status == TaskStatus.RUNNING:
        raise HTTPException(
            status_code=409,
            detail="別のタスクが実行中です。停止してから音声コマンドを使用してください。",
        )

    result = await handle_voice_command()

    return {
        "transcription": result.transcription,
        "task_type": result.task_type,
        "reason": result.reason,
        "task_launched": result.task_launched,
    }
