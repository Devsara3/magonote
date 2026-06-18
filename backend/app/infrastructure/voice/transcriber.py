from openai import AsyncOpenAI
from app.core.config import settings

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _client


async def transcribe(audio_path: str) -> str:
    """Send WAV file to Whisper API and return transcribed text."""
    client = _get_client()
    with open(audio_path, "rb") as f:
        result = await client.audio.transcriptions.create(
            model="whisper-1",
            file=f,
            language="ja",
        )
    return result.text
