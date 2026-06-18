from enum import Enum


class TaskType(str, Enum):
    SPON_MIX = "spon_mix_1and2"
    CUP_1 = "cup_1"


class TaskStatus(str, Enum):
    IDLE = "idle"
    RUNNING = "running"
    COMPLETED = "completed"
    ERROR = "error"
    STOPPED = "stopped"
