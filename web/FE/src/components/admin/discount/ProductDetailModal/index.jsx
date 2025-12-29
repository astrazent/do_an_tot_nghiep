import React from 'react'
import BaseModal from '../BaseModal';
import { formatCurrency } from '~/utils/formatCurrency'

const ProductDetailModal = ({ product, onClose }) => {
    if (!product) return null;
    const isLowStock = product.stock_qty <= product.low_stock_threshold;

    const InfoRow = ({ label, children }) => (
        <div className="flex justify-between items-center py-2 text-sm">
            <span className="text-gray-500">{label}:</span>
            <span className="font-semibold text-gray-800 text-right">{children}</span>
        </div>
    );

    return (
        <BaseModal
            isOpen={!!product}
            onClose={onClose}
            title={product.name}
            maxWidth="max-w-3xl"
        >
            <div className="pl-6 pr-6 flex flex-col gap-6 pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">{product.category_name}</span>
                            <span className={`px-2 py-0.5 text-xs rounded font-medium ${product.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {product.status ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
                            </span>
                        </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">ID: #{product.id}</div>
                </div>

                {product.images && product.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {product.images.map((img, i) => (
                            <div key={i} className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-xs text-gray-400">
                                Img {i + 1}
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Giá bán hiện tại</div>
                        <div className="text-lg font-bold text-blue-600">{formatCurrency(product.price)}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Giá gốc</div>
                        <div className="text-lg font-medium text-gray-600 line-through">{formatCurrency(product.origin_price)}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Giá nhập</div>
                        <div className="text-lg font-medium text-gray-800">{formatCurrency(product.import_price)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-15">
                    <InfoRow label="Tồn kho">
                        <span className={isLowStock ? 'text-red-600 font-bold' : ''}>
                            {product.stock_qty} {isLowStock && '(Sắp hết hàng)'}
                        </span>
                    </InfoRow>
                    <InfoRow label="Đã bán">{product.buyed}</InfoRow>
                    <InfoRow label="Đánh giá">
                        <span className="font-bold text-yellow-600">
                            {product.rate_count > 0 ? (product.rate_point_total / product.rate_count).toFixed(1) : 0}/5.0
                        </span>
                    </InfoRow>
                    <InfoRow label="OCOP">{product.ocop_rating ? `${product.ocop_rating} sao` : 'Chưa có'}</InfoRow>
                </div>

                <div className="text-sm text-gray-700 p-4 bg-gray-50 rounded-lg">{product.description}</div>
            </div>
        </BaseModal>
    )
}

export default ProductDetailModal
