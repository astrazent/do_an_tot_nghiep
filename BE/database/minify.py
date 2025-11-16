import sqlparse

# Đọc file SQL
file_path = "script.sql"
with open(file_path, "r", encoding="utf-8") as f:
    sql_text = f.read()

# Minify SQL
minified_sql = sqlparse.format(
    sql_text,
    strip_comments=True,
    reindent=False,
).replace("\n", " ").replace("\t", " ").strip()

# Ghi đè lại chính file
with open(file_path, "w", encoding="utf-8") as f:
    f.write(minified_sql)

print(f"Hoàn tất! File đã được minify và lưu lại: {file_path}")
