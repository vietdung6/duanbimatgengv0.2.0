// Script tạo 3 tài khoản mặc định: admin, staff, fan
const bcrypt = require('bcryptjs')
const mysql = require('mysql2/promise')

async function createDefaultUsers() {
    console.log('🚀 Đang kết nối database...')

    // Kết nối database
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '', // Thay đổi nếu MySQL có password
        database: 'geng_fandom'
    })

    console.log('✅ Đã kết nối database\n')

    try {
        // Hash password "admin"
        const adminHash = await bcrypt.hash('admin', 10)
        const staffHash = await bcrypt.hash('staff123', 10)
        const fanHash = await bcrypt.hash('fan123', 10)

        // Xóa users cũ nếu có (để chạy lại script)
        await connection.query(`DELETE FROM users WHERE email IN ('admin@geng.gg', 'staff@geng.gg', 'fan@geng.gg')`)
        console.log('🗑️  Đã xóa users cũ (nếu có)\n')

        // Tạo Admin
        await connection.query(`
      INSERT INTO users (
        email, username, display_name, password_hash, role, points, total_points, created_at
      ) VALUES (
        'admin@geng.gg', 
        'admin', 
        'Administrator', 
        ?, 
        'admin', 
        0, 
        0, 
        NOW()
      )
    `, [adminHash])
        console.log('✅ Đã tạo tài khoản ADMIN')
        console.log('   📧 Email: admin@geng.gg')
        console.log('   👤 Username: admin')
        console.log('   🔑 Password: admin')
        console.log('   🎭 Role: admin\n')

        // Tạo Staff
        await connection.query(`
      INSERT INTO users (
        email, username, display_name, password_hash, role, points, total_points, created_at
      ) VALUES (
        'staff@geng.gg', 
        'staff', 
        'Staff Member', 
        ?, 
        'staff', 
        0, 
        0, 
        NOW()
      )
    `, [staffHash])
        console.log('✅ Đã tạo tài khoản STAFF')
        console.log('   📧 Email: staff@geng.gg')
        console.log('   👤 Username: staff')
        console.log('   🔑 Password: staff123')
        console.log('   🎭 Role: staff\n')

        // Tạo Fan (User)
        await connection.query(`
      INSERT INTO users (
        email, username, display_name, password_hash, role, points, total_points, created_at
      ) VALUES (
        'fan@geng.gg', 
        'fan', 
        'Fan User', 
        ?, 
        'fan', 
        100, 
        100, 
        NOW()
      )
    `, [fanHash])
        console.log('✅ Đã tạo tài khoản FAN')
        console.log('   📧 Email: fan@geng.gg')
        console.log('   👤 Username: fan')
        console.log('   🔑 Password: fan123')
        console.log('   🎭 Role: fan')
        console.log('   💎 Points: 100\n')

        console.log('🎉 HOÀN TẤT! Đã tạo 3 tài khoản thành công!')
        console.log('\n📝 THÔNG TIN ĐĂNG NHẬP:')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('ADMIN    → admin@geng.gg / admin')
        console.log('STAFF    → staff@geng.gg / staff123')
        console.log('FAN      → fan@geng.gg / fan123')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    } catch (error) {
        console.error('❌ Lỗi:', error.message)
    } finally {
        await connection.end()
        console.log('👋 Đã đóng kết nối database')
    }
}

createDefaultUsers()
