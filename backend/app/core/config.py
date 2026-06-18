from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "HRI Robot Control API"
    allow_origins: list[str] = ["http://localhost:3000"]
    lerobot_rollout_bin: str = "/home/b4/miniforge3/envs/lerobot/bin/lerobot-rollout"
    robot_port: str = "/dev/ttyACM1"
    datasets_root: str = "/home/b4/datasets"
    spon_model_path: str = "/home/b4/Desktop/spon_mix_1and2_model"
    cup_model_path: str = "/home/b4/Desktop/cup_1"
    # Loaded from .env at project root
    openai_api_key: str = ""
    audio_record_seconds: int = 5
    audio_tmp_path: str = "/tmp/hri_voice.wav"

    model_config = {"env_file": "/home/b4/magonote/.env", "extra": "ignore"}


settings = Settings()
