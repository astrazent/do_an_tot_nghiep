```bash
    docker-compose build --no-cache
    docker-compose up -d
    docker system prune -a --volumes # xoá toàn bộ mọi thứ
    docker volume ls # volume luôn tồn tại dù cho có chạy lệnh phía trên --> dữ liệu luôn được lưu
    for /f "tokens=*" %v in ('docker volume ls -q') do docker volume rm %v # xoá tất cả volume
    docker volume rm do_an_tot_nghiep_mariadb_chatbot_data # xoá volume của container đó nếu gặp lỗi user denied