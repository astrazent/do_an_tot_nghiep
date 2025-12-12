#!/bin/bash
export CHROMA_TELEMETRY=False
export LANGCHAIN_TELEMETRY=False

while true; do
    uvicorn app.main:app --host 0.0.0.0 --port 8000 &
    APP_PID=$!

    now=$(date +%s)
    midnight=$(date -d "tomorrow 00:00" +%s)
    sleep_seconds=$(( midnight - now ))

    echo "⏳ Task đồng bộ sẽ kích hoạt sau $sleep_seconds giây (12h đêm)"
    sleep $sleep_seconds

    echo "⚡ Restart FastAPI và chạy task..."
    kill $APP_PID
    wait $APP_PID || true

    echo "🚀 Bắt đầu chạy task..."
    python -m load_data.generate_sys_chunks
    echo "✅ Task hoàn tất"
done