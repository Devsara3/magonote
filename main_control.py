import os
import time
import json
import subprocess
import shutil
from openai import OpenAI
from dotenv import load_dotenv

# ==========================================
# 初期設定
# ==========================================
# .envファイルからAPIキーを読み込む
load_dotenv()
client = OpenAI()

def listen_to_microphone():
    """Ubuntu純正コマンド(arecord)で強制的に5秒録音する"""
    print("🎤 マイクの準備完了！")
    print("🟢 今から【5秒間】録音します！話しかけてください！ (例: 「お腹空いた」)")
    
    # ALSA/PyAudioのエラーを完全に回避するため、OSの純正コマンドを直接叩く
    command = ["arecord", "-d", "5", "-f", "cd", "temp_audio.wav"]
    # エラーログなどを画面に出さないようにして実行
    subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    print("⏹️ 録音完了！AIに送信します...")
    return "temp_audio.wav"

def transcribe_audio(file_path):
    """録音したwavファイルをWhisper APIに投げてテキスト化する"""
    print("⏳ 音声をテキストに変換中 (Whisper API)...")
    with open(file_path, "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            model="whisper-1", 
            file=audio_file,
            language="ja"
        )
    return transcript.text

def get_intent_from_llm(user_text):
    """テキストをGPT-4oに投げて、JSONを受け取る"""
    print(f"🧠 LLMで意図を解析中: 「{user_text}」")
    
    system_prompt = """
    あなたは介護ロボットの司令塔です。ユーザーの発話から意図を汲み取り、実行すべきタスクをJSONで出力してください。
    出力フォーマットは {"target_policy": "ポリシー名"} のみとすること。
    
    選択肢:
    - お腹が空いた、何か食べたい -> "onigiri_policy"
    - 喉が渇いた、飲み物が欲しい -> "tea_policy"
    - それ以外、判断できない場合 -> "none"
    """

    response = client.chat.completions.create(
        model="gpt-4o",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_text}
        ]
    )
    return json.loads(response.choices[0].message.content)

def execute_real_policy(policy_name):
    """
    LLMが判断したポリシー名に応じて、
    ロボット班が作成した学習済みモデルを読み込み、実機を動かす
    """
    if policy_name == "none":
        print("⚠️ 該当するタスクがありません。待機に戻ります。")
        return

    # 1. ロボット班のモデルが置いてあるデスクトップのパスを指定
    model_path = f"/home/b4/Desktop/{policy_name}_model"
    
    # 2. 上書きエラーを防ぐため、前回のテスト記録フォルダを自動削除
    eval_dataset_path = "/home/b4/datasets/rollout_push_task_eval"
    try:
        shutil.rmtree(eval_dataset_path)
        print(f"🧹 過去のテスト結果を削除しました: {eval_dataset_path}")
    except FileNotFoundError:
        pass

    print(f"\n⚙️ 制御エンジン起動: 【{policy_name}】を実行します...")

    # 3. ロボット班が成功させた推論コマンドをPythonから直接叩く
    command = [
        "lerobot-rollout",
        "--strategy.type=episodic",
        f"--policy.path={model_path}",
        "--robot.type=so101_follower",
        "--robot.port=/dev/ttyACM1",
        "--robot.id=follower_arm",
        '--robot.cameras={"front": {"type": "opencv", "index_or_path": 6, "fps": 30, "width": 640, "height": 480}}',
        "--dataset.repo_id=rollout_push_task_eval",
        f"--dataset.root={eval_dataset_path}",
        f'--dataset.single_task="Execute {policy_name}"',
        "--dataset.episode_time_s=10",
        "--dataset.reset_time_s=5",
        "--dataset.num_episodes=1",
        "--play_sounds=false",
        "--dataset.push_to_hub=false",
        "--display_data=false"
    ]

    try:
        # ロボットのコマンドを実行（ロボットが動き終わるまでここで待機）
        subprocess.run(command, check=True, text=True)
        print("\n🎉 タスク完了！ロボットが初期位置に戻りました。")
    except subprocess.CalledProcessError as e:
        print(f"❌ ロボットの制御中にエラーが発生しました: {e}")

# ==========================================
# メインの無限ループ（システム起動）
# ==========================================
if __name__ == "__main__":
    print("=== 次世代介護支援システム プロトタイプ起動 ===")
    
    while True:
        # 1. マイク録音（wavファイル名が返ってくる）
        audio_file = listen_to_microphone()
        
        try:
            # 2. 録音したファイルを文字起こし
            text = transcribe_audio(audio_file)
            print(f"🗣️ 認識結果: {text}")
            
            # 3. AIに意図を解析させる
            llm_result = get_intent_from_llm(text)
            print(f"📦 LLM出力: {llm_result}")
            
            # 4. ロボット制御モジュールを呼び出す
            target = llm_result.get("target_policy", "none")
            execute_real_policy(target)
            
        except Exception as e:
            print(f"❌ エラーが発生しました: {e}")
            
        print("-" * 50)
