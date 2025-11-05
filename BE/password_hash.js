import bcrypt from 'bcryptjs'

const users = [
    { username: 'nguyen55', password: 'nguyen55' },
    { username: 'minhtuan89', password: 'abcdef' },
    { username: 'hoanglong_hn', password: 'longpassword' },
    { username: 'maiphuong_95', password: 'qwerty' },
    { username: 'quanghuy.dev', password: 'dev@123' },
    { username: 'thanhthao_88', password: 'thao1988' },
    { username: 'duc.anh.le', password: 'letmein' },
    { username: 'ngocbich2000', password: 'bich2k' },
    { username: 'trungdung_it', password: 'dungit123' },
    { username: 'linhchi_beauty', password: 'chixinhgai' },
    { username: 'nnn', password: '88888888' },
]

for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10)
    console.log(`('${u.username}', '${hash}', 'email@example.com', ...)`)
}
