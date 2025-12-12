from domain.retriever import Retriever
from domain.query_translation import QueryTranslation
from domain.routing import Router
from config import settings
from langchain_core.documents.base import Document
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import json
from app.database import SessionLocal
from concurrent.futures import ThreadPoolExecutor, as_completed
from load_data.add_new_documents import get_all_datasources
from domain.llm_factory import get_llm, get_api_key
import time
from app.redis_client import redis_client, JSON
from redis.commands.json.path import Path

class ChatBot:
    def __init__(
        self,
        model: str = settings.GEMINI_MODEL,
        embedding_model: str = settings.EMBEDDING_MODEL,
        top_k: int = 5
    ):
        self.top_k = top_k
        self.r = redis_client
        self.embedding_model = embedding_model
        # Load tất cả retrievers từ DB
        self.retrievers = self.load_retrievers_from_db()
        # --------------------------------------------
        self.llm = get_llm(0)
        self.llm2 = get_llm(1)
        self.llm3 = get_llm(2)
        self.router = Router(
            llm_index=3,
            datasources=self.load_datasource_info_from_db()
        )
        self.query_translation = QueryTranslation(llm_indexes=[4, 5, 6])

    def load_datasource_info_from_db(self):
        db = SessionLocal()
        datasources = get_all_datasources(db)
        result = {ds.slug: ds.description for ds in datasources}
        db.close()
        return result

    def load_retrievers_from_db(self):
        db = SessionLocal()
        retrievers = {}

        datasources = get_all_datasources(db)

        for ds in datasources:
            retriever = Retriever(
                collection_name=ds.slug,
                embedding_model=self.embedding_model
            )
            retrievers[ds.slug] = retriever
        db.close()
        return retrievers

    def translate_query(self, query: str, history: str,  k_query: int = 6) -> list[str]:
        if k_query < 1:
            return []

        queries = [query]  # luôn có câu gốc
        remaining_slots = max(k_query - 2, 0)  # dành slot cho multi + decomposition

        multi_k = remaining_slots // 2
        decomposition_k = remaining_slots - multi_k

        results = {}
        timings = {}

        def run_multi():
            print("[multi] bắt đầu")
            start = time.time()
            results['multi'] = self.query_translation.multi_query(query, history, k=multi_k) if multi_k > 0 else []
            end = time.time()
            timings['multi'] = end - start
            print("[multi] kết thúc")

        def run_decomp():
            print("[decomp] bắt đầu")
            start = time.time()
            results['decomp'] = self.query_translation.decomposition(query, k=decomposition_k) if decomposition_k > 0 else []
            end = time.time()
            timings['decomp'] = end - start
            print("[decomp] kết thúc")

        def run_hyde():
            print("[hyde] bắt đầu")
            start = time.time()
            results['hyde'] = [self.query_translation.HyDE(query)]
            end = time.time()
            timings['hyde'] = end - start
            print("[hyde] kết thúc")

        # Chạy song song 3 tác vụ
        with ThreadPoolExecutor(max_workers=3) as executor:
            futures = [
                executor.submit(run_multi),
                executor.submit(run_decomp),
                executor.submit(run_hyde)
            ]
            for _ in as_completed(futures):
                pass  # chỉ đợi tất cả hoàn thành

        # Gom kết quả
        queries.extend(results.get('multi', []))
        queries.extend(results.get('decomp', []))

        if len(queries) < k_query:
            queries.extend(results.get('hyde', []))

        print("Thời gian thực hiện từng task (s):", timings)

        return queries[:k_query]

    # --- Tìm kiếm tài liệu theo routing ---
    def retrival(self, routing: dict[str, list[str]]) -> list[Document]:
        results = []
        for ds_slug, queries in routing.items():
            if ds_slug == "khong_lien_quan" or not queries:
                continue
            retriever = self.retrievers[ds_slug]
            results.extend(retriever.multi_query(queries, top_k=self.top_k))
        return results

    def limit_docs_by_chars(self, docs, max_chars=3000):
        out = []
        length = 0
        for d in docs:
            c = d.page_content
            if length + len(c) > max_chars:
                break
            out.append(c)
            length += len(c)
        return "\n\n".join(out)

    def mmr_engine(self, question: str, history_messages: list[str]) -> str:
        history_text = "\n".join(history_messages[-10:]) if len(history_messages) > 10 else "\n".join(history_messages)

        start = time.perf_counter()
        queries = self.translate_query(question, history_text, k_query=6)
        end = time.perf_counter()
        print(f"translate_query time: {end - start:.4f}s")

        start = time.perf_counter()
        routing = self.router.routing_document(queries)
        end = time.perf_counter()
        print(f"routing_document time: {end - start:.4f}s")

        start = time.perf_counter()
        documents = self.retrival(routing)
        end = time.perf_counter()
        print(f"retrival time: {end - start:.4f}s")
        
        print("--------------------------")
        for ds_slug, qs in routing.items():
            print(f"có {len(qs)} câu hỏi thuộc về {ds_slug}")
        print(f"tìm được tổng cộng {len(documents)} tài liệu")
        print("--------------------------\n")

        context = self.limit_docs_by_chars(documents, 3000)

        template = """
        Bạn là một chuyên gia tư vấn sản phẩm của Bếp Sạch Việt – website chuyên cung cấp các đặc sản vùng miền.

        Nhiệm vụ của bạn:
        - Sử dụng thông tin từ kiến thức (context) và ký ức hội thoại trước đó (history) để trả lời câu hỏi mới của người dùng.
        - Trả lời chính xác, ngắn gọn, đúng trọng tâm, ưu tiên thông tin sản phẩm, xuất xứ, cách dùng, bảo quản, giá cả, nguồn gốc đặc sản theo dữ liệu có sẵn.
        - Nếu câu hỏi vượt ngoài phạm vi kiến thức hoặc không có dữ liệu liên quan, hãy nói rằng bạn không có thông tin đó và gợi ý người dùng liên hệ hotline 0868839655 | 0963538357.
        - Nếu khách muốn đặt hàng trả về tên và giá tiền của sản phẩm đó kèm theo câu hỏi: bạn muốn đặt sản phẩm này phải không? (lưu ý: **chỉ 1 sản phẩm đúng nhất**)
        - Nếu trong câu trả lời có giá tiền, luôn phải viết ở dạng x.000 VND (VD: 230.000 VND)
        - Nếu khách trả lời câu hỏi: bạn muốn đặt sản phẩm này phải không?, yêu cầu khách cung cấp thông tin sau:
            + Phương thức thanh toán
            + Phương thức vận chuyển
            + Số lượng
            + Tên người nhận
            + Số điện thoại
            + Địa chỉ nhận hàng
            + Ghi chú (nếu có)
        - **Định dạng câu trả lời:** câu trả lời || id sản phẩm xuất hiện đầu tiên trong câu trả lời đó.
        Kiến thức (context): 
        {context}

        Ký ức hội thoại trước đó (history):  
        {history}

        Câu hỏi mới của người dùng:  
        {question}
        """

        start = time.perf_counter()
        print("LLM 6:", get_api_key(self.llm2))
        prompt = ChatPromptTemplate.from_template(template)
        chain = prompt | self.llm2 | StrOutputParser()
        answer = chain.invoke({
            "question": question,
            "context": context,
            "history": history_text
        })
        end = time.perf_counter()
        print(f"mmr_engine runtime: {end - start:.4f}s")

        return answer

    def is_stat_question(self, question: str, history_messages: list[str]) -> str:
        # Xử lý history text
        history_text = "\n".join(history_messages[-4:]) if len(history_messages) > 4 else "\n".join(history_messages)
        
        template = """
        Bạn là chuyên gia phân loại câu hỏi thống kê.

        Lịch sử hội thoại gần đây:
        {history}

        Câu hỏi hiện tại: "{question}"

        Kiểm tra xem câu hỏi này có thể generate SQL để thực hiện các thống kê sau không:
        - Thống kê số lượng
        - Thống kê tổng giá trị
        - Thống kê theo điều kiện (giá, trạng thái)
        - Thống kê cao nhất/nhỏ nhất
        - Thống kê trung bình

        Quy tắc:
        1. Nếu khách muốn đặt một **món ăn, sản phẩm** hay bất kì thứ gì, lập tức **trả lời "no"**
        2. Nếu câu hỏi là yêu cầu đặt hàng nhưng **không nói rõ tên món ăn, sản phẩm** cụ thể, trả lời "order"
        3. Nếu câu hỏi kèm theo **thông tin cá nhân, ghi chú**, trả lời "order"
        4. Nếu câu hỏi là một câu khẳng định, kiểm tra câu trả lời của bot trước đó, nếu liên quan đến đặt hàng thì trả lời "order"
        5. Nếu câu hỏi chỉ rõ tên của một đối tượng cụ thể, trả lời "no".
        6. Nếu câu hỏi có thể generate SQL thống kê, trả lời "yes".
        7. Nếu không thuộc các trường hợp trên, trả lời "no".

        Trả lời **chỉ** bằng một trong các giá trị: "yes", "no", "order".
        """
        start = time.perf_counter()
        print("LLM 1: ", get_api_key(self.llm))

        prompt = ChatPromptTemplate.from_template(template)
        chain = prompt | self.llm | StrOutputParser()

        answer = chain.invoke({
            "question": question,
            "history": history_text
        })
        end = time.perf_counter()
        print(f"is_stat_question runtime: {end - start:.4f}s")
        
        return answer

    def generate_redisjson_query(self, question: str) -> str:
            """
            Sinh lệnh RedisJSON để truy vấn dữ liệu dựa trên câu hỏi.
            """

            # Dữ liệu mẫu
            context_examples = {
                "product": {
                    "key_pattern": "product:*",
                    "example": {
                        "product_name": "Mè xửng Huế",
                        "product_slug": "me-xung-hue",
                        "product_description": "Đặc sản mè xửng Huế dẻo thơm, ngọt bùi.",
                        "origin_price": 50000,
                        "price": 45000,
                        "buyed": 400,
                        "rate_point_total": 285,
                        "rate_count": 60,
                        "stock_qty": 500,
                        "ocop_rating": 3,
                        "category_name": "Thực phẩm khác",
                        "category_description": "Tổng hợp các món ăn đặc sản.",
                        "discount_name": "Free Ship 0đ",
                        "discount_description": "Miễn phí vận chuyển cho đơn hàng đặc sản.",
                        "discount_start_date": "2025-08-31T17:00:00.000Z",
                        "discount_end_date": "2025-09-30T16:59:59.000Z",
                    }
                },

                "payment": {
                    "key_pattern": "payment:*",
                    "example": {
                        "method": "CreditCard",
                    }
                },

                "shipment": {
                    "key_pattern": "shipment:*",
                    "example": {
                        "name": "Viettel Post",
                        "description": "Viettel Post, giao hàng toàn quốc.",
                        "base_fee": 25000,
                    }
                }
            }
            context_str = json.dumps(context_examples, ensure_ascii=False, indent=2)

            template = """
            Bạn là chuyên gia tạo lệnh RedisJSON và RediSearch dựa trên câu hỏi người dùng và dữ liệu mẫu.

            Câu hỏi: {question}

            Quy định bắt buộc:
            1. Chỉ sử dụng các key Redis có sẵn, mỗi bảng có ví dụ key thực tế:
            - Bảng sản phẩm (product):
                Ví dụ RedisJSON với redis-py: self.r.execute_command("JSON.GET", "product:1", "$")
                Ví dụ RediSearch với redis-py: self.r.execute_command("FT.SEARCH", "products_idx", "*", "SORTBY", "price", "DESC", "LIMIT", 0, 1)
            - Bảng thanh toán (payment):
                Ví dụ RedisJSON: self.r.execute_command("JSON.GET", "payment:1", "$")
                Ví dụ RediSearch: self.r.execute_command("FT.SEARCH", "payments_idx", "*", "SORTBY", "status", "ASC", "LIMIT", 0, 1)
            - Bảng vận chuyển (shipment):
                Ví dụ RedisJSON: self.r.execute_command("JSON.GET", "shipment:1", "$")
                Ví dụ RediSearch: self.r.execute_command("FT.SEARCH", "shipments_idx", "*", "SORTBY", "base_fee", "ASC", "LIMIT", 0, 1)

            2. Chỉ sử dụng các lệnh RedisJSON: JSON.GET, JSON.SET, JSON.ARRLEN, JSON.NUMINCRBY  
            và RediSearch: FT.SEARCH, FT.AGGREGATE, SORTBY, LIMIT.

            3. Không được tự tạo key hay index mới, không đổi tên key/index.  
            4. Nếu câu hỏi không liên quan đến dữ liệu có sẵn, trả về `None`.  
            5. Luôn trả về **lệnh RedisJSON hoặc RediSearch hoàn chỉnh dưới dạng `self.r.execute_command(...)`**, không giải thích, không markdown, không bình luận.

            Ví dụ dữ liệu mẫu trong Redis (dưới key tương ứng):
            {context}

            Hướng dẫn tạo lệnh (tất cả phải sinh theo kiểu redis-py):

            1. Thống kê số lượng:
            - Ví dụ: "Có bao nhiêu sản phẩm còn hàng?"
            - RedisJSON: self.r.execute_command("JSON.ARRLEN", "product:1", "$") hoặc self.r.execute_command("JSON.GET", "product:1", "$")
            2. Thống kê theo điều kiện (giá, trạng thái):
            - Ví dụ: "Có bao nhiêu sản phẩm giá trên 100000?"
            - RediSearch: self.r.execute_command("FT.SEARCH", "products_idx", "@price:[100000 +inf]")
            3. Thống kê min/max:
            - Ví dụ: "Sản phẩm có giá cao nhất/thấp nhất"
            - RediSearch: self.r.execute_command("FT.SEARCH", "products_idx", "*", "SORTBY", "price", "DESC", "LIMIT", 0, 1)
            4. Thống kê trung bình:
            - Ví dụ: "Giá trung bình của tất cả sản phẩm là bao nhiêu?"
            - RedisJSON: self.r.execute_command("JSON.GET", "product:1", "$") + tính trung bình trong Python
            """
            start = time.perf_counter()
            print("LLM 2:", get_api_key(self.llm2))

            prompt = ChatPromptTemplate.from_template(template)
            chain = prompt | self.llm2 | StrOutputParser()

            redis_command = chain.invoke({
                "question": question,
                "context": context_str
            })
            end = time.perf_counter()
            print(f"generate_redisjson_query runtime: {end - start:.4f}s")

            return redis_command

    def run_redis_query(self, question):
        # Sinh lệnh Redis dưới dạng Python code (redis-py)
        redis_cmd = self.generate_redisjson_query(question)
        print("Generated Redis command:\n", redis_cmd)
        
        try:
            # Thực thi lệnh bằng eval
            result = eval(redis_cmd)
            return result
        except Exception as e:
            print("Error executing Redis command:", e)
            return None

    def statistic_answer(self, question, redis_result):
        context = ""  # Khởi tạo giá trị mặc định để tránh lỗi UnboundLocalError nếu try fail
        try:
            context = redis_result
        except Exception as e:
            print("Error get redis_result:", e)

        # Template prompt
        # SỬA: Bỏ chữ 'f' ở đầu. Để LangChain tự inject biến context và question
        template = """
        Bạn là chuyên gia tư vấn của Bếp Sạch Việt - website chuyên cung cấp các đặc sản vùng miền.

        Bối cảnh: Hệ thống ĐÃ thực hiện truy vấn cơ sở dữ liệu (đã lọc, đã so sánh, đã tìm kiếm) để ra được kết quả cuối cùng cho câu hỏi của người dùng.

        Nhiệm vụ của bạn:
        1. Sử dụng "Kết quả từ hệ thống" bên dưới để trả lời người dùng.
        2. Coi kết quả này là ĐÁP ÁN CHÍNH XÁC và DUY NHẤT. 
            - Ví dụ: Nếu người dùng hỏi "Sản phẩm nào đắt nhất" và kết quả chỉ có 1 sản phẩm, hãy khẳng định đó chính là sản phẩm đắt nhất. 
            - KHÔNG được trả lời kiểu "Dựa trên thông tin tôi có..." hay "Tôi không thể xác định vì chỉ có 1 sản phẩm...".
        3. Diễn đạt lại câu trả lời một cách tự nhiên, hấp dẫn, mời chào mua hàng.
        4. Tuyệt đối không được hiển thị ID sản phẩm trong nội dung trả lời cho người dùng.
        5. Nếu trong câu trả lời có giá tiền, luôn phải viết ở dạng x.000 VND (VD: 230.000 VND)
        6. Nếu "Kết quả từ hệ thống" là None hoặc rỗng, lúc đó mới báo không tìm thấy thông tin và gợi ý liên hệ hotline 0868839655 | 0963538357.
        7. **Định dạng câu trả lời:** câu trả lời || id sản phẩm xuất hiện đầu tiên trong câu trả lời đó. (nơi duy nhất cho phép truyền id)
        ----------------
        Kết quả từ hệ thống (context):
        {context}
        ----------------

        Câu hỏi của người dùng:
        {question}
        """
        
        start = time.perf_counter()
        # LangChain sẽ tự tìm {context} và {question} trong chuỗi trên
        print("LLM 3:", get_api_key(self.llm3))
        prompt = ChatPromptTemplate.from_template(template)
        
        chain = prompt | self.llm3 | StrOutputParser()
        
        # Truyền dữ liệu vào tại đây
        answer = chain.invoke({
            "question": question,
            "context": context if context else "None", # Xử lý trường hợp context rỗng/lỗi
        })
        end = time.perf_counter()
        print(f"statistic_answer runtime: {end - start:.4f}s")
        return answer
    
    def get_all_json(self,prefix: str):
        """
        Lấy toàn bộ JSON đã lưu trong Redis theo prefix.
        Ví dụ: prefix="product" => lấy product:1, product:2, ...
        """
        cursor = 0
        results = []

        while True:
            cursor, keys = redis_client.scan(
                cursor=cursor,
                match=f"{prefix}:*",
                count=200
            )

            for key in keys:
                try:
                    data = JSON.get(key)
                    results.append({
                        "key": key,
                        "data": data
                    })
                except Exception:
                    # Key không phải JSON → bỏ qua
                    pass

            if cursor == 0:
                break

        return results

    def prepare_order(self, history, question, conversation_id):
        prepared_key = f"prepared_order:{conversation_id}"
        product_data = JSON.get(prepared_key, Path.root_path())  # RedisJSON
        shipment_data = self.get_all_json("shipment")
        payment_data = self.get_all_json("payment")
        payment_data = [p for p in payment_data if p['data']['method'].upper() == "COD"]

        if product_data:
            context = product_data
        else:
            context = {}

        # 2. Lấy 5 đoạn chat gần nhất
        relevant_history = "\n".join(history[-10:]) if len(history) > 10 else "\n".join(history)

        # 3. Tạo prompt cho LLM
        template = """
        Bạn là trợ lý đặt hàng thông minh của Bếp Sạch Việt.

        Bạn sẽ nhận:
        - Lịch sử chat của người dùng: {history}
        - Câu hỏi mới: {question}
        - Sản phẩm đặt hàng: {context}
        - Phương thức giao hàng có sẵn: {shipment_options}
        - Phương thức thanh toán có sẵn: {payment_options}

        Nhiệm vụ:
        1. Kiểm tra lịch sử chat xem khách hàng đã xác nhận sản phẩm muốn đặt chưa. 
        Nếu chưa, trả về tên và giá sản phẩm kèm câu hỏi: bạn muốn đặt sản phẩm này không?
        2. Kiểm tra xem người dùng đã cung cấp đầy đủ thông tin để đặt hàng chưa. Thông tin cần có:
            - Phương thức vận chuyển
            - Số lượng
            - Tên người nhận
            - Số điện thoại
            - Địa chỉ nhận hàng (định dạng: <số nhà>, <phường xã>, <quận/huyện>, <thành phố>)
            - Ghi chú (nếu có)
        3. Nếu thông tin nào còn thiếu, yêu cầu người dùng cung cấp thêm, kèm hướng dẫn format như trên.
        4. Thông báo cho người dùng về việc phương thức thanh toán là COD, muốn thanh toán bằng hình thức khác thì vui lòng đặt trên hệ thống
        5. Địa chỉ nhận hàng không được viết tắt bất kì thông tin nào, nếu phát hiện viết tắt yêu cầu viết lại
        6. Nếu thông tin đầy đủ, trả về **chỉ JSON hợp lệ**, **không bao gồm ```json hoặc bất kỳ ký tự nào khác**, với định dạng:
        {{
            "payment_id": <id của payment_options có method COD>, 
            "status": "pending",
            "shipment_status": "pending",
            "product_price": <giá tiền sản phẩm>, # chuyển về số nguyên
            "shipment_id": <id của shipment>,
            "product_id": <id của sản phẩm>,
            "quantity": <Số lượng>,
            "deli_name": <Tên người nhận>,
            "deli_phone": <Số điện thoại>,
            "deli_address": <Địa chỉ nhận hàng>,
            "shipping_fee": [base_fee + random(10.000, 55.000)],
            "message": <Ghi chú>
        }}

        ----------------
        Lịch sử chat:
        {history}
        ----------------
        Sản phẩm đặt hàng:
        {context}
        ----------------
        Phương thức giao hàng có sẵn:
        {shipment_options}
        ----------------
        Phương thức thanh toán có sẵn:
        {payment_options}
        (Chỉ có COD được chọn tự động. Nếu muốn dùng phương thức khác, khách vui lòng đặt trực tiếp trên hệ thống)
        ----------------
        Câu hỏi mới:
        {question}
        """

        # Chuyển shipment_data và payment_data thành dạng dễ đọc cho LLM
        shipment_options = "\n".join([f"{s['data']['id']}: {s['data']['name']} (Phí: {s['data']['base_fee']})" for s in shipment_data])
        payment_options = "\n".join([f"{p['data']['id']}: {p['data']['method']}" for p in payment_data])

        start = time.perf_counter()
        print("LLM 2: ", get_api_key(self.llm2))
        prompt = ChatPromptTemplate.from_template(template)
        chain = prompt | self.llm2 | StrOutputParser()

        answer = chain.invoke({
            "history": relevant_history,
            "question": question,
            "context": context,
            "shipment_options": shipment_options,
            "payment_options": payment_options
        })
        end = time.perf_counter()
        print(f"prepare_order runtime: {end - start:.4f}s")
        # 4. Phân loại kết quả LLM
        if "product_name" in answer or "quantity" in answer:
            return {
                "status": "order_ready",
                "message": "Đặt hàng thành công, bạn có thể kiểm tra đơn hàng trong mục 'đơn hàng của tôi', xin cảm ơn.",
                "order_data": answer
            }
        else:
            return {
                "status": "order_missing_info",
                "message": answer
            }

    # --- Hàm chính chat ---
    def chat(self, question: str, history_messages: list[str], conversation_id: str) -> str:
        stat_check = self.is_stat_question(question, history_messages).lower()
        if stat_check == "yes":
            # Xử lý câu hỏi thống kê
            answer = self.statistic_answer(question, self.run_redis_query(question))
        elif stat_check == "order":
            answer = self.prepare_order(history_messages, question, conversation_id)

            # Nếu order_data là dict và có key "order_data" lồng trong, lấy ra
            if answer.get("status") == "order_ready":
                order_data = answer.get("order_data")
                if isinstance(order_data, dict) and "order_data" in order_data:
                    answer["order_data"] = order_data["order_data"]

            answer = json.dumps(answer, ensure_ascii=False)
        else:
            # MMR engine tự xử lý toàn bộ và trả về answer
            answer = self.mmr_engine(question, history_messages)
        return answer