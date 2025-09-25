module.exports = {
  arrowParens: "avoid",             // Arrow function không có ngoặc đơn khi có một tham số
  bracketSameLine: false,           // JSX/HTML: dấu '>' xuống dòng riêng, không cùng dòng cuối
  bracketSpacing: true,             // Có khoảng trắng trong object { a: 1 }
  endOfLine: "lf",                  // Xuống dòng theo Unix (LF), đồng bộ môi trường
  htmlWhitespaceSensitivity: "css", // HTML: tôn trọng quy tắc whitespace theo CSS display
  insertPragma: false,              // Không chèn @format vào đầu file
  jsxSingleQuote: false,            // JSX dùng nháy kép thay vì nháy đơn
  printWidth: 80,                   // Giới hạn độ dài dòng = 80 ký tự
  proseWrap: "preserve",            // Markdown giữ nguyên xuống dòng, không wrap thêm
  quoteProps: "as-needed",          // Chỉ quote key object khi thật sự cần
  requirePragma: false,             // Không yêu cầu file phải có @format mới format
  semi: false,                       // Bỏ dấu ; ở cuối câu lệnh
  singleAttributePerLine: false,    // JSX: nhiều attribute có thể nằm chung 1 dòng
  singleQuote: true,               // Dùng nháy đơn trong JS thay vì nháy kép
  tabWidth: 4,                      // Mỗi tab = 4 spaces
  trailingComma: "es5",             // Thêm dấu , cuối khi hợp lệ trong ES5 (array, object)
  useTabs: false,                   // Không dùng tab, chỉ dùng space
  vueIndentScriptAndStyle: false    // Vue: không indent code trong <script> và <style>
}
