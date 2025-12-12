from langchain.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import Dict
from domain.llm_factory import get_llm, get_api_key

# Định nghĩa model đầu ra
class RouteQuery(BaseModel):
    # Dùng Dict[str, str] để map câu hỏi -> slug
    datasources: Dict[str, str] = Field(description="Mapping câu hỏi sang datasource slug")

class Router:
    def __init__(self, llm_index: int, datasources: dict):
        self.datasource_info = datasources
        self.datasource_slugs = list(datasources.keys())
        self.llm_index=llm_index
        # Cấu hình LLM trả về đúng định dạng RouteQuery
        self.llm = get_llm(llm_index).with_structured_output(RouteQuery)
        self.retrievers = {slug: None for slug in self.datasource_slugs}

    def routing_document(self, queries: list[str]) -> dict[str, list[str]]:
        sources_list = "\n".join(
            [f"- '{slug}': {desc}" for slug, desc in self.datasource_info.items()]
        )
        
        # SỬ DỤNG 4 DẤU NGOẶC ĐỂ ESCAPE TRONG F-STRING
        system = f"""
        Bạn là chuyên gia định tuyến câu hỏi của người dùng.

        Dưới đây là danh sách các nguồn dữ liệu và mô tả nội dung của chúng:
        {sources_list}

        Nhiệm vụ: Phân loại từng câu hỏi xem nó thuộc nguồn dữ liệu nào dựa trên mô tả.
        
        Hãy trả về kết quả khớp với cấu trúc JSON sau:
        {{{{
            "datasources": {{{{
                "câu hỏi gốc 1": "slug tương ứng",
                "câu hỏi gốc 2": "slug tương ứng"
            }}}}
        }}}}
        
        Nếu câu hỏi không liên quan đến bất kỳ nguồn nào, hãy gán slug là "khong_lien_quan".
        """

        human_prompt = "Các câu hỏi cần phân loại:\n" + "\n".join([f"{i+1}. {q}" for i, q in enumerate(queries)])
        print("LLM 5:", get_api_key(get_llm(self.llm_index)))
        prompt = ChatPromptTemplate.from_messages([
            ("system", system),
            ("human", human_prompt)
        ])

        router_chain = prompt | self.llm
        
        try:
            result = router_chain.invoke({})
            mapping = getattr(result, "datasources", None)
        except Exception as e:
            mapping = {q: "khong_lien_quan" for q in queries}

        # Gom nhóm kết quả
        routing = {slug: [] for slug in self.datasource_slugs}
        routing["khong_lien_quan"] = []

        for q, ds in mapping.items():
            # Chuẩn hóa slug phòng trường hợp LLM trả về sai case
            ds_clean = ds.strip()
            
            # Đôi khi LLM trả về slug không tồn tại, cần kiểm tra
            if ds_clean in self.retrievers:
                routing[ds_clean].append(q)
            else:
                # Nếu slug không khớp hoặc model trả lời "khong_lien_quan"
                routing["khong_lien_quan"].append(q)

        return routing