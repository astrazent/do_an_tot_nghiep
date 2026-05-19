# Website thương mại điện tử tích hợp AI hỗ trợ doanh nghiệp nhỏ và siêu nhỏ

## Giới thiệu dự án

Đây là đồ án tốt nghiệp với đề tài **Website thương mại điện tử tích hợp AI hỗ trợ doanh nghiệp nhỏ và siêu nhỏ**, được xây dựng nhằm hỗ trợ các doanh nghiệp trong quá trình chuyển đổi số, đặc biệt đối với các doanh nghiệp gặp khó khăn về chi phí triển khai hệ thống và nguồn nhân lực.

Hệ thống được phát triển dựa trên mô hình website bán hàng trực tuyến kết hợp với các chức năng trí tuệ nhân tạo (AI), hỗ trợ hoạt động bán hàng, chăm sóc khách hàng và marketing tự động.

Đối tượng áp dụng thử nghiệm trong đồ án là doanh nghiệp **Bếp Sạch Việt**, chuyên kinh doanh thực phẩm sạch và các sản phẩm OCOP.

---

## Hệ thống đã xây dựng những gì?

### Chức năng phía khách hàng

- Đăng ký, đăng nhập tài khoản
- Quản lý thông tin cá nhân
- Xem danh sách sản phẩm
- Xem chi tiết sản phẩm
- Tìm kiếm sản phẩm
- Thêm sản phẩm vào giỏ hàng
- Tăng giảm số lượng sản phẩm trong giỏ hàng
- Đặt hàng và thanh toán
- Theo dõi trạng thái đơn hàng
- Đánh giá sản phẩm
- Xem bài viết và tin tức
- Tư vấn sản phẩm thông qua chatbot AI

---

### Chức năng phía quản trị

- Quản lý sản phẩm
- Quản lý danh mục
- Quản lý đơn hàng
- Quản lý người dùng
- Quản lý banner
- Quản lý bài viết
- Quản lý khuyến mãi
- Quản lý mã giảm giá
- Quản lý doanh thu
- Thống kê dữ liệu bán hàng
- Phân tích dữ liệu kho
  
---

### Chức năng AI và Marketing

- Chatbot hỗ trợ khách hàng bằng mô hình RAG
- Gợi ý sản phẩm dựa trên hành vi người dùng
- Sinh nội dung marketing tự động
- Theo dõi hành vi khách hàng bằng Google Analytics 4
- Gửi email marketing tự động
- Đăng bài marketing tự động

---

### Chức năng tự động hóa với n8n

Hệ thống sử dụng n8n để xây dựng các workflow tự động hóa nhằm giảm các thao tác thủ công.

Một số workflow đã triển khai:

- Tự động sinh nội dung marketing
- Gửi email chăm sóc khách hàng
- Gửi email khuyến mãi
- Đăng bài định kỳ

Việc áp dụng workflow giúp doanh nghiệp tiết kiệm thời gian vận hành và giảm khối lượng công việc lặp lại.

---

## Công nghệ sử dụng

### Frontend

- ReactJS
- Vite
- Redux Toolkit
- TanStack Query
- TailwindCSS

### Backend

- NodeJS
- ExpressJS

### AI Service

- FastAPI
- LangChain
- RAG
- HuggingFace Embedding
- ChromaDB

### Database

- MySQL
- Redis

### Automation và Analytics

- n8n
- Google Analytics 4

### Khác

- JWT Authentication
- Docker
- REST API

---

## Tại sao nhóm chọn stack này?

Trong quá trình thực hiện đồ án, nhóm lựa chọn các công nghệ dựa trên tiêu chí:

- Dễ phát triển
- Dễ mở rộng
- Phù hợp với doanh nghiệp nhỏ
- Có cộng đồng hỗ trợ lớn

### ReactJS + Vite

Nhóm lựa chọn ReactJS để xây dựng giao diện do React hỗ trợ mô hình component giúp tái sử dụng code tốt và dễ bảo trì. Ngoài ra Vite hỗ trợ tốc độ khởi động và build nhanh hơn, giúp quá trình phát triển thuận tiện hơn.

---

### Redux Toolkit + TanStack Query

Dự án có nhiều dữ liệu cần quản lý như:

- Người dùng
- Giỏ hàng
- Đơn hàng
- Sản phẩm

Redux Toolkit giúp quản lý state tập trung trong khi TanStack Query hỗ trợ xử lý dữ liệu bất đồng bộ, cache dữ liệu và giảm số lượng API request không cần thiết.

---

### NodeJS + ExpressJS

NodeJS được lựa chọn do sử dụng JavaScript ở cả frontend và backend, giúp giảm thời gian học thêm công nghệ mới.

ExpressJS hỗ trợ xây dựng REST API nhanh và có cấu trúc đơn giản.

---

### MySQL

Dữ liệu của hệ thống như:

- Người dùng
- Sản phẩm
- Đơn hàng
- Khuyến mãi

đều có cấu trúc rõ ràng và liên kết với nhau, do đó MySQL phù hợp để đảm bảo tính toàn vẹn dữ liệu.

---

### Redis

Redis được sử dụng để:

- Lưu cache
- Lưu session
- Lưu ngữ cảnh hội thoại chatbot
- Giảm tải cho database

Việc sử dụng Redis giúp tăng tốc độ phản hồi của hệ thống.

---

### FastAPI + LangChain + RAG

Nhóm sử dụng FastAPI để xây dựng AI service do framework này có tốc độ xử lý cao và phù hợp với Python.

LangChain được sử dụng để xây dựng workflow cho chatbot.

RAG được lựa chọn do:

- Có thể sử dụng dữ liệu riêng của doanh nghiệp
- Không cần huấn luyện lại mô hình
- Dễ cập nhật dữ liệu mới

Chatbot có thể trả lời dựa trên:

- Thông tin sản phẩm
- Chính sách doanh nghiệp
- FAQ
- Khuyến mãi

thay vì chỉ dựa trên dữ liệu có sẵn của mô hình.

---

### n8n

Nhóm lựa chọn n8n để xây dựng workflow tự động hóa do công cụ này hỗ trợ kéo thả trực quan và dễ tích hợp với nhiều dịch vụ thông qua API.

n8n giúp triển khai:

- Gửi email tự động
- Đăng bài tự động
- Marketing automation
- Kết nối các dịch vụ trong hệ thống

So với việc xây dựng toàn bộ workflow bằng code, việc sử dụng n8n giúp tiết kiệm thời gian phát triển và dễ mở rộng hơn.

---

### Docker

Docker được sử dụng để đóng gói các thành phần của hệ thống thành các container riêng biệt.

Việc sử dụng Docker giúp:

- Đồng bộ môi trường phát triển
- Dễ triển khai
- Hạn chế lỗi khác biệt môi trường

---

## Những gì học được sau dự án

Sau quá trình thực hiện đồ án, nhóm học được nhiều kiến thức và kinh nghiệm thực tế:

### Về Frontend

- Xây dựng SPA bằng React
- Quản lý state với Redux Toolkit
- Xử lý dữ liệu bất đồng bộ bằng TanStack Query
- Tối ưu giao diện và trải nghiệm người dùng

### Về Backend

- Xây dựng REST API
- Xử lý authentication bằng JWT
- Thiết kế kiến trúc hệ thống

### Về cơ sở dữ liệu

- Thiết kế cơ sở dữ liệu thực tế
- Xây dựng quan hệ dữ liệu
- Tối ưu truy vấn

### Về AI

- Tìm hiểu mô hình RAG
- Xây dựng chatbot sử dụng dữ liệu riêng
- Làm việc với Embedding
- Tìm hiểu cách truy xuất dữ liệu ngữ nghĩa

### Về hệ thống

- Làm việc với Redis
- Làm việc với Docker
- Tích hợp Google Analytics
- Thiết kế workflow bằng n8n
- Kết nối nhiều service trong cùng hệ thống

### Kỹ năng mềm

- Làm việc nhóm
- Quản lý tiến độ
- Quản lý source code bằng Git
- Phân tích yêu cầu và giải quyết vấn đề

Ngoài ra, trong quá trình thực hiện nhóm cũng gặp nhiều khó khăn như xử lý dữ liệu giữa nhiều service, tối ưu hiệu năng API và tích hợp AI vào hệ thống hiện có. Những khó khăn này giúp nhóm có thêm nhiều kinh nghiệm thực tế.

---


