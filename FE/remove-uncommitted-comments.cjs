const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const strip = require('strip-comments')

// Lấy danh sách file bị thay đổi
const diffFiles = execSync('git diff --name-only', { encoding: 'utf8' })
    .split('\n')
    .filter(f => f.endsWith('.js') && fs.existsSync(f))

if (diffFiles.length === 0) {
    console.log('✅ Không có file JS nào thay đổi.')
    process.exit(0)
}

for (const file of diffFiles) {
    // Lấy phần diff của file (chỉ nội dung thay đổi)
    const diffContent = execSync(`git diff HEAD -- ${file}`, {
        encoding: 'utf8',
    })
    if (!diffContent.includes('+')) continue

    // Đọc toàn bộ file
    const code = fs.readFileSync(file, 'utf8')
    const cleanCode = strip(code)

    // Ghi đè file
    fs.writeFileSync(file, cleanCode, 'utf8')
    console.log(`🧹 Đã xóa comment trong: ${file}`)
}

console.log('✨ Hoàn tất.')
