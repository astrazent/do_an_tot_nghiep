import React from 'react'
// Bạn cần lưu ảnh vào thư mục public hoặc src và import vào
import xucXichCom from '~/assets/image/shared/product/xuc-xich-com.png'

const ArticleBody = () => {
    return (
        <article className="text-base text-gray-800 leading-relaxed">
            <p className="font-semibold text-lg mb-4">
                Xúc xích cốm – món ăn kết hợp độc đáo giữa hương vị truyền thống
                và hiện đại, đang dần trở thành “ngôi sao mới” trong làng ẩm
                thực Việt.
            </p>

            <ul className="list-disc list-inside space-y-2 mb-6 bg-gray-50 p-4 rounded-md border-l-4 border-green-600">
                <li>
                    Hòa quyện hương thơm của cốm non với vị đậm đà của thịt xay.
                </li>
                <li>
                    Phù hợp cho mọi lứa tuổi – từ bữa sáng nhanh gọn đến món
                    nhậu hấp dẫn.
                </li>
            </ul>

            <div className="space-y-6">
                <p>
                    Xúc xích cốm được làm từ thịt heo tươi, trộn cùng cốm làng
                    Vòng – loại cốm dẻo thơm nổi tiếng của Hà Nội. Sau khi hấp
                    chín, lớp vỏ căng mọng và màu vàng nhẹ tạo nên cảm giác ngon
                    mắt, trong khi bên trong dậy mùi thơm đặc trưng của cốm hòa
                    cùng vị ngọt của thịt.
                </p>

                <p>
                    Món ăn này không chỉ phù hợp cho các bữa ăn gia đình mà còn
                    được nhiều quán ăn và nhà hàng đưa vào thực đơn như một món
                    đặc sản Hà Thành. Khi chiên hoặc nướng, xúc xích cốm tỏa
                    hương thơm ngậy, giòn nhẹ bên ngoài, mềm mọng bên trong –
                    khiến ai đã thử một lần khó lòng quên được.
                </p>

                <figure className="my-8">
                    <img
                        src={xucXichCom}
                        alt="Xúc xích cốm Hà Nội"
                        className="w-full h-auto rounded-lg shadow-md"
                    />
                    <figcaption className="text-sm text-gray-600 mt-2 italic text-center">
                        Xúc xích cốm – sự hòa quyện giữa vị thịt đậm đà và hương
                        cốm dịu nhẹ.
                    </figcaption>
                </figure>

                <p>
                    Ngày nay, xúc xích cốm không chỉ được bày bán trong các cửa
                    hàng đặc sản mà còn có thể dễ dàng tìm thấy ở các siêu thị
                    lớn. Với sự tiện lợi và giá cả hợp lý, đây chắc chắn là lựa
                    chọn tuyệt vời cho những ai yêu thích ẩm thực Việt Nam
                    truyền thống nhưng vẫn muốn trải nghiệm hương vị mới mẻ.
                </p>
            </div>
        </article>
    )
}

export default ArticleBody
