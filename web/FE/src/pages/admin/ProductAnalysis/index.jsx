import React, { useState, useEffect } from 'react'
import InventoryStats from '~/components/admin/inventory/InventoryStats'
import CategoryDistributionChart from '~/components/admin/inventory/CategoryDistributionChart'
import SalesPerformanceChart from '~/components/admin/inventory/SalesPerformanceChart'
import UnsoldProductsTable from '~/components/admin/inventory/UnsoldProductsTable'
import SwitchableTopList from '~/components/admin/inventory/SwitchableTopList'
import { getUnsoldProductsThisMonth, getTop5Customers } from '~/services/admin/productAdminService'

function ProductAnalysis() {
  const [unsoldProducts, setUnsoldProducts] = useState([])
  const [topCustomers, setTopCustomers] = useState([])
  const [loadingUnsold, setLoadingUnsold] = useState(true)
  const [loadingTopCustomers, setLoadingTopCustomers] = useState(true)

  // Lấy sản phẩm không bán được trong tháng
  useEffect(() => {
    const fetchUnsold = async () => {
      try {
        const data = await getUnsoldProductsThisMonth()
        const sorted = (data.data || data).sort((a, b) => b.daysUnsold - a.daysUnsold)
        setUnsoldProducts(sorted)
      } catch (err) {
        console.error('Lỗi lấy sản phẩm ế:', err)
        setUnsoldProducts([])
      } finally {
        setLoadingUnsold(false)
      }
    }
    fetchUnsold()
  }, [])

  // Lấy 5 khách hàng mua nhiều nhất
  useEffect(() => {
    const fetchTopCustomers = async () => {
      try {
        const data = await getTop5Customers()
        setTopCustomers(data.data) 
      } catch (err) {
        console.error('Lỗi lấy top khách hàng:', err)
        setTopCustomers([])
      } finally {
        setLoadingTopCustomers(false)
      }
    }
    fetchTopCustomers()
  }, [])

  // Dữ liệu cho SwitchableTopList – chỉ phần "Người dùng mua nhiều nhất" là thật
  const topListsData = [
    {
      title: 'Người dùng mua nhiều nhất',
      columnHeaders: { left: 'Tên', right: 'Số lượng' },
      items: loadingTopCustomers
        ? [] // đang tải
        : topCustomers.length > 0
        ? topCustomers.map(c => ({
            id: c.id,
            name: c.name || 'Khách lẻ',
            value: c.value || 0
          }))
        : [{ id: 1, name: 'Chưa có dữ liệu', value: 0 }]
    },
  ]

  return (
    <div className="w-full">
      <div className="bg-gray-100 min-h-screen flex flex-col gap-6">
        <InventoryStats />

        <div className="min-h-screen font-sans w-full">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 w-full">
            {/* Cột trái */}
            <div className="flex flex-col gap-4 sm:gap-6 xl:col-span-2">
              <div className="xl:row-span-1">
                <SalesPerformanceChart />
              </div>

              <div className="xl:row-span-2">
                <div className="overflow-auto">
                  {loadingUnsold ? (
                    <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
                      Đang tải danh sách sản phẩm chưa bán...
                    </div>
                  ) : (
                    <UnsoldProductsTable products={unsoldProducts} />
                  )}
                </div>
              </div>
            </div>

            {/* Cột phải */}
            <div className="flex flex-col gap-4 sm:gap-6 xl:col-span-1">
              <div className="xl:row-span-2 h-[890px]">
                <CategoryDistributionChart />
              </div>

              <div className="xl:row-span-1">
                <SwitchableTopList listsData={topListsData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductAnalysis
