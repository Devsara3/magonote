from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from app.application.task import use_cases
from app.domain.task.value_objects import TaskType

router = APIRouter()


def _task_to_dict(task) -> dict:
    if task is None:
        return {"status": "idle", "task_type": None, "pid": None}
    return {
        "status": task.status,
        "task_type": task.task_type,
        "pid": task.pid,
        "started_at": task.started_at.isoformat() if task.started_at else None,
        "finished_at": task.finished_at.isoformat() if task.finished_at else None,
        "error_message": task.error_message,
    }


@router.post("/run-task/{task_type}")
async def run_task(task_type: TaskType):
    try:
        task = await use_cases.run_task(task_type)
        return JSONResponse(status_code=202, content=_task_to_dict(task))
    except RuntimeError as e:
        raise HTTPException(status_code=409, detail=str(e))


@router.post("/stop-task")
async def stop_task():
    task = await use_cases.stop_task()
    return _task_to_dict(task)


@router.get("/task-status")
async def task_status():
    task = use_cases.get_current_task()
    return _task_to_dict(task)
