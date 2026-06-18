import asyncio
from typing import Optional

from app.domain.task.entities import Task
from app.domain.task.value_objects import TaskType, TaskStatus
from app.infrastructure.robot.subprocess_runner import launch_task

# In-memory state: only one task can run at a time for safety
_current_task: Optional[Task] = None
_current_process: Optional[asyncio.subprocess.Process] = None


def get_current_task() -> Optional[Task]:
    return _current_task


async def run_task(task_type: TaskType) -> Task:
    """
    Idempotency guard: reject if another task is already running.
    Otherwise launch the subprocess and return immediately (non-blocking).
    """
    global _current_task, _current_process

    if _current_task and _current_task.status == TaskStatus.RUNNING:
        raise RuntimeError(
            f"Task '{_current_task.task_type}' is already running. Stop it first."
        )

    task = Task(task_type=task_type)
    _current_task = task

    process = await launch_task(task_type)
    task.start(pid=process.pid)
    _current_process = process

    # Monitor in background — update task state when process exits
    asyncio.create_task(_monitor(task, process))

    return task


async def stop_task() -> Optional[Task]:
    global _current_task, _current_process

    if not _current_task or _current_task.status != TaskStatus.RUNNING:
        return _current_task

    if _current_process:
        _current_process.terminate()
        try:
            await asyncio.wait_for(_current_process.wait(), timeout=5.0)
        except asyncio.TimeoutError:
            _current_process.kill()

    _current_task.stop()
    return _current_task


async def _monitor(task: Task, process: asyncio.subprocess.Process) -> None:
    await process.wait()
    if task.status == TaskStatus.RUNNING:
        if process.returncode == 0:
            task.complete()
        else:
            task.fail(f"Process exited with code {process.returncode}")
