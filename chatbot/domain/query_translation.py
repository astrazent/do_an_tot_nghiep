from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from domain.llm_factory import get_llm, get_api_key

class QueryTranslation:
    def __init__(self, llm_indexes: list[int] = [4, 5, 6]):
        """
        llm_indexes: list các index của LLM instance dùng cho
                    [multi_query, decomposition, HyDE]
        """
        if len(llm_indexes) != 3:
            raise ValueError("Bạn cần truyền đúng 3 index LLM")
        
        self.llms = [get_llm(i) for i in llm_indexes]

    def multi_query(self, question: str, history: str, k: int = 2) -> list[str]:
        template = f"""
        Bạn là trợ lý tư vấn tại Bếp Sạch Việt. Nhiệm vụ: tạo ra {k} phiên bản khác nhau của câu hỏi người dùng để phục vụ việc tìm kiếm tài liệu/sản phẩm trong vector database. Chỉ in ra các câu hỏi, mỗi câu trên một dòng.
        Câu hỏi gốc: {{question}}
        Lịch sử hội thoại trước đó:
        {history}
        """
        print("LLM 2:", get_api_key(self.llms[0]))
        prompt_template = ChatPromptTemplate.from_template(template)
        # Sử dụng LLM thứ nhất
        chain = prompt_template | self.llms[0] | StrOutputParser() | (lambda x: x.split("\n"))
        queries = chain.invoke({"question": question, "k": k})
        queries_cleaned = [q.strip().lower() for q in queries if q.strip()]

        return queries_cleaned

    def decomposition(self, question: str, k: int = 3) -> list[str]:
        template = """
        Bạn là trợ lý tư vấn tại Bếp Sạch Việt. Hãy phân rã câu hỏi sau thành {k} câu nhỏ, chỉ gồm các **từ khóa quan trọng**.
        Câu hỏi: {question}
        """
        print("LLM 3:", get_api_key(self.llms[1]))
        prompt_template = ChatPromptTemplate.from_template(template)
        # Sử dụng LLM thứ hai
        chain = prompt_template | self.llms[1] | StrOutputParser() | (lambda x: x.split("\n"))
        queries = chain.invoke({"question": question, "k": k})
        return [q.strip().lower() for q in queries if q.strip()]

    def HyDE(self, question: str) -> str:
        template = """
        Bạn là trợ lý tư vấn tại Bếp Sạch Việt, hãy lấy ra các từ khóa quan trọng nhất từ câu hỏi dưới đây (hyDE). Chỉ in ra các từ khóa, phân tách bằng dấu phẩy.
        Câu hỏi: {question}
        """
        print("LLM 4:", get_api_key(self.llms[2]))
        prompt_template = ChatPromptTemplate.from_template(template)
        # Sử dụng LLM thứ ba
        chain = prompt_template | self.llms[2] | StrOutputParser()
        answer = chain.invoke({"question": question})
        return answer.strip().lower()