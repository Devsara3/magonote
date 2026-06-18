import asyncio

from app.core.config import settings
from app.domain.task.value_objects import TaskType

_TASK_ARGS: dict[TaskType, dict] = {
    TaskType.SPON_MIX: {
        "cleanup_dir": f"{settings.datasets_root}/rollout_spon_mix_1and2_eval",
        "cmd": [
            settings.lerobot_rollout_bin,
            "--strategy.type=episodic",
            f"--policy.path={settings.spon_model_path}",
            "--robot.type=so101_follower",
            f"--robot.port={settings.robot_port}",
            "--robot.id=follower_arm",
            '--robot.cameras={"front": {"type": "opencv", "index_or_path": 4, "fps": 30, "width": 640, "height": 480}}',
            "--dataset.repo_id=rollout_spon_mix_1and2_eval",
            f"--dataset.root={settings.datasets_root}/rollout_spon_mix_1and2_eval",
            "--dataset.single_task=Push the object to the left.",
            "--dataset.episode_time_s=50",
            "--dataset.reset_time_s=7",
            "--dataset.num_episodes=1",
            "--play_sounds=false",
            "--dataset.push_to_hub=false",
            "--display_data=false",
        ],
    },
    TaskType.CUP_1: {
        "cleanup_dir": f"{settings.datasets_root}/rollout_cup_1_eval",
        "cmd": [
            settings.lerobot_rollout_bin,
            "--strategy.type=episodic",
            f"--policy.path={settings.cup_model_path}",
            "--robot.type=so101_follower",
            f"--robot.port={settings.robot_port}",
            "--robot.id=follower_arm",
            '--robot.cameras={"front": {"type": "opencv", "index_or_path": 4, "fps": 30, "width": 640, "height": 480}}',
            "--dataset.repo_id=rollout_cup_1_eval",
            f"--dataset.root={settings.datasets_root}/rollout_cup_1_eval",
            "--dataset.single_task=Push the object to the left.",
            "--dataset.episode_time_s=50",
            "--dataset.reset_time_s=7",
            "--dataset.num_episodes=1",
            "--play_sounds=false",
            "--dataset.push_to_hub=false",
            "--display_data=false",
        ],
    },
}


async def launch_task(task_type: TaskType) -> asyncio.subprocess.Process:
    """Delete previous dataset dir and start lerobot-rollout as async subprocess."""
    args = _TASK_ARGS[task_type]

    cleanup = await asyncio.create_subprocess_exec(
        "rm", "-rf", args["cleanup_dir"],
        stdout=asyncio.subprocess.DEVNULL,
        stderr=asyncio.subprocess.DEVNULL,
    )
    await cleanup.wait()

    return await asyncio.create_subprocess_exec(
        *args["cmd"],
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.STDOUT,
    )
