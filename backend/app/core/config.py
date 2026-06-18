from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "HRI Robot Control API"
    allow_origins: list[str] = ["http://localhost:3000"]
    lerobot_rollout_bin: str = "/home/b4/miniforge3/envs/lerobot/bin/lerobot-rollout"
    robot_port: str = "/dev/ttyACM1"
    datasets_root: str = "/home/b4/datasets"
    spon_model_path: str = "/home/b4/Desktop/spon_mix_1and2_model"
    cup_model_path: str = "/home/b4/Desktop/cup_1"


settings = Settings()
