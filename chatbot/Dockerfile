# Chọn image Python nhẹ
FROM python:3.11-slim

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy file requirements trước để tận dụng cache
COPY requirements.txt .

# Cài đặt dependencies
# Không dùng --no-cache-dir để cache được lưu vào volume
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Copy toàn bộ source code vào container
COPY . .

# Expose port uvicorn sẽ chạy
EXPOSE 8000

# Chạy wrapper script thay vì uvicorn trực tiếp
RUN chmod +x /app/entrypoint.sh
CMD ["/app/entrypoint.sh"]