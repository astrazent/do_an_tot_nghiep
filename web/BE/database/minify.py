import os
import sqlparse

# Thư mục chứa các file SQL
folder_path = "."  # Thư mục hiện tại, bạn có thể đổi

create_file = None
insert_file = None

# Tìm 2 file create_table.sql và insert_data.sql
for filename in os.listdir(folder_path):
    if filename.lower() == "create_table.sql":
        create_file = os.path.join(folder_path, filename)
    elif filename.lower() == "insert_data.sql":
        insert_file = os.path.join(folder_path, filename)

# Kiểm tra
if not create_file or not insert_file:
    raise FileNotFoundError("Không tìm thấy create_table.sql hoặc insert_data.sql trong thư mục.")

# Đọc nội dung 2 file
with open(create_file, "r", encoding="utf-8") as f:
    create_sql = f.read()

with open(insert_file, "r", encoding="utf-8") as f:
    insert_sql = f.read()

# Ghép 2 file với một dòng trống ở giữa
combined_sql = create_sql.strip() + "\n\n" + insert_sql.strip()

# Minify SQL
minified_sql = sqlparse.format(
    combined_sql,
    strip_comments=True,
    reindent=False,
).replace("\n", " ").replace("\t", " ").strip()

# Ghi ra script.sql
script_path = os.path.join(folder_path, "script.sql")
with open(script_path, "w", encoding="utf-8") as f:
    f.write(minified_sql)

print(f"Hoàn tất! File đã được ghép và minify: {script_path}")