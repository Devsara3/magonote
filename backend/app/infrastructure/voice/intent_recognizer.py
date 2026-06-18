import json
from openai import AsyncOpenAI
from app.core.config import settings
from app.domain.task.value_objects import TaskType

_client: AsyncOpenAI | None = None

_SYSTEM_PROMPT = """
あなたは介護ロボットの司令塔です。
ユーザーの発話から意図を読み取り、実行すべきタスクを以下のJSONフォーマットのみで返してください。

出力フォーマット:
{"task_type": "<値>", "reason": "<判断理由を一言で>"}

task_type の選択肢:
- "spon_mix_1and2" : お腹が空いた・食べ物が欲しい・スポンジ・何か食べたいなど食事に関する発話
- "cup_1"          : 喉が渇いた・飲み物が欲しい・水・お茶・カップなど飲料に関する発話
- "none"           : 上記に当てはまらない、または判断できない場合

余計なテキストは一切含めないこと。
""".strip()


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _client


async def recognize_intent(text: str) -> tuple[TaskType | None, str]:
    """Return (task_type, reason). task_type is None when intent is 'none'."""
    client = _get_client()
    response = await client.chat.completions.create(
        model="gpt-4o",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user", "content": text},
        ],
    )
    data = json.loads(response.choices[0].message.content)
    raw = data.get("task_type", "none")
    reason = data.get("reason", "")
    try:
        return TaskType(raw), reason
    except ValueError:
        return None, reason
