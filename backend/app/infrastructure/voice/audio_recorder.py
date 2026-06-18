import asyncio
from app.core.config import settings


async def record_audio() -> str:
    """Record audio via arecord for settings.audio_record_seconds seconds.
    Returns the path to the saved WAV file."""
    proc = await asyncio.create_subprocess_exec(
        "arecord",
        "-d", str(settings.audio_record_seconds),
        "-f", "cd",
        settings.audio_tmp_path,
        stdout=asyncio.subprocess.DEVNULL,
        stderr=asyncio.subprocess.DEVNULL,
    )
    await proc.wait()
    return settings.audio_tmp_path
