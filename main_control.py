import os
import time
import json
import speech_recognition as sr
from openai import OpenAI
from dotenv import load_dotenv

# ==========================================
# 初期設定
# ==========================================
# .envファイルからAPIキーをこっそり読み込む
load_dotenv()
client = OpenAI()

def listen_to_microphone():
    """マイクから音声を拾い、録音データを返す"""
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("\n🎤 マイクの準備中... (周囲のノイズを計測しています)")
        recognizer.adjust_for_ambient_noise(source, duration=1)
        print("🟢 話しかけてください！ (例: 「お腹空いた」 / 終わると自動で録音停止します)")
        
        try:
            # 音声が途切れるまで録音
            audio_data = recognizer.listen(source, timeout=5, phrase_time_limit=10)
            return audio_data
        except sr.WaitTimeoutError:
            print("無音が続いたため、待機に戻ります。")
            return None

def transcribe_audio(audio_data):
    """録音データをWhisper APIに投げてテキスト化する"""
    print("⏳ 音声をテキストに変換中 (Whisper API)...")
    with open("temp_audio.wav", "wb") as f:
        f.write(audio_data.get_wav_data())
    
    with open("temp_audio.wav", "rb") as audio_file:
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

def execute_dummy_policy(policy_name):
    """ダミーファイルの読み込みと実行ループ"""
    if policy_name == "none":
        print("⚠️ 該当するタスクがありません。待機に戻ります。")
        return

    policy_path = f"policies/{policy_name}"
    print(f"\n⚙️ フォルダ【 {policy_path} 】からAIの脳みそをロードしています...")
    time.sleep(2) # ロード時間のダミー
    print("✅ ロード完了！ロボットの制御を開始します。\n")
    
    for i in range(30):
        print(f"🤖 [{policy_name}] を実行中... (モーター制御信号送信: step {i+1}/30)")
        time.sleep(0.1)
        
    print("\n🎉 タスク完了！ロボットが初期位置に戻りました。")

# ==========================================
# メインの無限ループ（システム起動）
# ==========================================
if __name__ == "__main__":
    print("=== 次世代介護支援システム プロトタイプ起動 ===")
    
    while True:
        audio = listen_to_microphone()
        if not audio:
            continue
            
        try:
            text = transcribe_audio(audio)
            print(f"🗣️ 認識結果: {text}")
            
            llm_result = get_intent_from_llm(text)
            print(f"📦 LLM出力: {llm_result}")
            
            target = llm_result.get("target_policy", "none")
            execute_dummy_policy(target)
            
        except Exception as e:
            print(f"❌ エラーが発生しました: {e}")
            
        print("-" * 50)