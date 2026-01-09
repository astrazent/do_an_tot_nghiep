import transporter from '~/utils/mailer.js'
import { env } from '~/config/environment'
export const sendResetPasswordEmail = (email, resetLink) => {
    return transporter.sendMail({
        from: '"Bếp Sạch Việt Support" <no-reply@bepsachviet.com>',
        to: email,
        subject: 'Xác nhận yêu cầu đổi mật khẩu',
        html: `
            <div style="background-color:#f3f7f4;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
                <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                    
                    <div style="background:#2f855a;padding:24px;text-align:center;">
                        <h1 style="color:#ffffff;margin:0;font-size:24px;">
                            Bếp Sạch Việt
                        </h1>
                        <p style="color:#c6f6d5;margin-top:6px;font-size:14px;">
                            "Mang hương vị vùng miền đến bếp nhà bạn."
                        </p>
                    </div>

                    <div style="padding:32px;color:#2d3748;">
                        <h2 style="margin-top:0;color:#2f855a;">
                            Yêu cầu đặt lại mật khẩu
                        </h2>

                        <p style="font-size:15px;line-height:1.6;">
                            Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
                            Nếu đây là bạn, vui lòng nhấn vào nút bên dưới để tiếp tục.
                        </p>

                        <div style="text-align:center;margin:32px 0;">
                            <a href="${resetLink}"
                            style="background:#04bd4a;color:#ffffff;text-decoration:none;
                                    padding:14px 28px;border-radius:6px;
                                    font-size:16px;font-weight:bold;
                                    display:inline-block;">
                                Đặt lại mật khẩu
                            </a>
                        </div>

                        <p style="font-size:14px;color:#4a5568;line-height:1.6;">
                            Link này sẽ hết hạn sau <strong>${env.RESET_PASSWORD_EXPIRES.replace('m', '')} phút</strong>.
                            Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.
                        </p>

                        <p style="font-size:14px;color:#4a5568;margin-top:24px;">
                            Trân trọng,<br/>
                            <strong>Bếp Sạch Việt</strong>
                        </p>
                    </div>

                    <div style="background:#edf2f7;padding:16px;text-align:center;font-size:12px;color:#718096;">
                        © ${new Date().getFullYear()} Bếp Sạch Việt. All rights reserved.
                    </div>

                </div>
            </div>
        `,
    })
}
