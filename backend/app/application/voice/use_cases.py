from dataclasses import dataclass
from typing import Optional

from app.domain.task.value_objects import TaskType
from app.infrastructure.voice.audio_recorder import record_audio
from app.infrastructure.voice.transcriber import transcribe
from app.infrastructure.voice.intent_recognizer import recognize_intent
from app.application.task import use_cases as task_use_cases


@dataclass
class VoiceCommandResult:
    transcription: str
    task_type: Optional[TaskType]
    reason: str
    task_launched: bool


async def handle_voice_command() -> VoiceCommandResult:
    """Record → transcribe → intent → (optionally) launch task."""
    audio_path = await record_audio()
    transcription = await transcribe(audio_path)
    task_type, reason = await recognize_intent(transcription)

    launched = False
    if task_type is not None:
        await task_use_cases.run_task(task_type)
        launched = True

    return VoiceCommandResult(
        transcription=transcription,
        task_type=task_type,
        reason=reason,
        task_launched=launched,
    )
