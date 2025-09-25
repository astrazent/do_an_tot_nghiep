module.exports = {
  // Xác định môi trường mà code sẽ chạy
  env: {
    browser: true,  // Cho phép các biến global của trình duyệt (window, document...)
    es2020: true,   // Hỗ trợ các tính năng ES2020
    node: true      // Cho phép các biến global của Node.js (process, __dirname...)
  },

  // Kế thừa các rule sẵn có
  extends: [
    'eslint:recommended',        // Bộ quy tắc mặc định khuyến nghị của ESLint
    'plugin:prettier/recommended' // Tích hợp Prettier, ưu tiên format theo Prettier
  ],

  // Parser để hiểu cú pháp JavaScript
  parser: '@babel/eslint-parser',

  // Cấu hình cho parser
  parserOptions: {
    ecmaVersion: 'latest',            // Dùng phiên bản ECMAScript mới nhất
    sourceType: 'module',             // Cho phép dùng import/export
    allowImportExportEverywhere: true // Cho phép import/export ở bất kỳ đâu
  },

  // Cấu hình cho React
  settings: {
    react: {
      version: '18.2' // Đặt version React (giúp eslint-plugin-react hoạt động chính xác)
    }
  },

  // Các plugin bổ sung (ở đây chưa thêm plugin nào ngoài Prettier)
  plugins: [],

  // Tùy chỉnh rule
  rules: {
    'no-console': 1,     // Cảnh báo khi dùng console.log (0=off,1=warn,2=error)
    'no-lonely-if': 1,   // Cảnh báo khi dùng if lồng không cần thiết
    'no-unused-vars': 1  // Cảnh báo khi khai báo biến nhưng không dùng
  }
}
