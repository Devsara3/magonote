from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from .value_objects import TaskType, TaskStatus


@dataclass
class Task:
    task_type: TaskType
    status: TaskStatus = TaskStatus.IDLE
    pid: Optional[int] = None
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    error_message: Optional[str] = None

    def start(self, pid: int) -> None:
        self.status = TaskStatus.RUNNING
        self.pid = pid
        self.started_at = datetime.now()

    def complete(self) -> None:
        self.status = TaskStatus.COMPLETED
        self.finished_at = datetime.now()

    def fail(self, message: str) -> None:
        self.status = TaskStatus.ERROR
        self.error_message = message
        self.finished_at = datetime.now()

    def stop(self) -> None:
        self.status = TaskStatus.STOPPED
        self.finished_at = datetime.now()
