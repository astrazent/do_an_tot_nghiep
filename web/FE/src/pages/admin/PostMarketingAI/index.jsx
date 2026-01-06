import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Alert from '~/components/shared/Alert';
import { createPostMarketing } from '~/services/admin/aiMarketingService';

const PostMarketingAI = () => {
  const [sheetFile, setSheetFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const REQUIRED_COLUMNS_DISPLAY = [
    'product_scope',
    'content_requirement',
    'product_image',
    'time',
    'type',
  ];

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        setErrorMessage('Vui lòng chọn file Excel (.xlsx hoặc .xls)!');
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }
      setSheetFile(file);
      setFileName(file.name);
      setErrorMessage(null);
    }
  };

  const handleRemoveFile = () => {
    setSheetFile(null);
    setFileName('');
    setErrorMessage(null);
  };

  const validateSheetHeaders = () => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheet];
          const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] || [];

          const errors = [];
          REQUIRED_COLUMNS_DISPLAY.forEach(required => {
            if (!headers.includes(required)) {
              errors.push(`File thiếu cột bắt buộc: '${required}'.`);
            }
          });

          if (errors.length > 0) {
            reject(errors.join(' '));
          } else {
            resolve(true);
          }
        } catch (err) {
          reject('Không thể đọc file Excel. Vui lòng kiểm tra file có đúng định dạng không!');
        }
      };
      reader.onerror = () => reject('Lỗi khi đọc file!');
      reader.readAsArrayBuffer(sheetFile);
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!sheetFile) {
      setErrorMessage('Vui lòng chọn file Excel!');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await validateSheetHeaders();

      const formData = new FormData();
      formData.append('google_sheet', sheetFile);

      const response = await createPostMarketing(formData);

      setSuccessMessage(
        response.message || 'Đã gửi file Excel lên server và xử lý thành công!'
      );

      setSheetFile(null);
      setFileName('');
    } catch (error) {
      let errorMsg = 'Có lỗi xảy ra khi xử lý file kiểm tra lại các trường trong file.';
      if (error.message) {
        errorMsg = error.message;
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 lg:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 text-center">
          Đăng Bài Marketing
        </h1>
        <p className="text-base text-gray-600 mb-6 text-center">
          Upload file Excel (.xlsx) chứa thông tin sản phẩm để tự động tạo và đăng bài
        </p>

        {/* Danh sách cột bắt buộc */}
        <div className="mb-8 p-5 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-base font-semibold text-blue-800 mb-3">
            File Excel cần có các cột sau (tên cột phải chính xác):
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-blue-700">
            {REQUIRED_COLUMNS_DISPLAY.map(col => (
              <li key={col} className="font-mono bg-white px-3 py-1.5 rounded-md shadow-sm">
                {col}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Upload file */}
          <div className="text-center">
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              File Excel (.xlsx) <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Chọn file Excel
                </span>
              </label>

              {fileName && (
                <div className="flex items-center space-x-3 bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
                  <span className="text-base text-gray-800 truncate max-w-[220px] sm:max-w-[300px]">
                    {fileName}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                    title="Xóa file"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Nút Submit */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading || !sheetFile}
              className={`px-10 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
                loading ? 'cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang gửi...
                </>
              ) : (
                'Gửi file và đăng bài'
              )}
            </button>
          </div>
        </form>

        {/* Alert */}
        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            duration={5000}
            onClose={() => setErrorMessage(null)}
          />
        )}
        {successMessage && (
          <Alert
            message={successMessage}
            type="success"
            duration={5000}
            onClose={() => setSuccessMessage(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PostMarketingAI;