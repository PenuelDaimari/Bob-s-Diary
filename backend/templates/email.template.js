export const getOtpEmailTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:30px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
                    
                    <tr>
                        <td style="background:#111827;padding:24px;text-align:center;">
                            <h1 style="margin:0;color:#ffffff;font-size:28px;">
                                Bob's Stop
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:40px 35px;">
                            <h2 style="margin-top:0;color:#1f2937;">
                                Verify Your Email Address
                            </h2>

                            <p style="color:#4b5563;font-size:16px;line-height:1.6;">
                                Thank you for registering with Bob's Stop.
                                Please use the verification code below to complete your account setup.
                            </p>

                            <div style="text-align:center;margin:35px 0;">
                                <div style="
                                    display:inline-block;
                                    background:#f3f4f6;
                                    padding:18px 40px;
                                    border-radius:10px;
                                    font-size:32px;
                                    font-weight:700;
                                    letter-spacing:8px;
                                    color:#111827;
                                    border:1px solid #e5e7eb;
                                ">
                                    ${otp}
                                </div>
                            </div>

                            <p style="color:#4b5563;font-size:15px;line-height:1.6;">
                                This code will expire in <strong>5 minutes</strong>.
                            </p>

                            <p style="color:#4b5563;font-size:15px;line-height:1.6;">
                                If you did not create an account with Bob's Stop,
                                you can safely ignore this email.
                            </p>

                            <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;" />

                            <p style="font-size:13px;color:#6b7280;line-height:1.5;">
                                For your security, never share this verification code with anyone.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background:#f9fafb;padding:20px;text-align:center;">
                            <p style="margin:0;font-size:13px;color:#6b7280;">
                                © ${new Date().getFullYear()} Bob's Stop. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;


export const getPasswordResetTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:30px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">

                    <tr>
                        <td style="background:#111827;padding:24px;text-align:center;">
                            <h1 style="margin:0;color:#ffffff;font-size:28px;">
                                Bob's Stop
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:40px 35px;">
                            <h2 style="margin-top:0;color:#dc2626;">
                                Password Reset Request
                            </h2>

                            <p style="color:#4b5563;font-size:16px;line-height:1.6;">
                                We received a request to reset the password associated with your Bob's Stop account.
                            </p>

                            <p style="color:#4b5563;font-size:16px;line-height:1.6;">
                                Use the authorization code below to continue:
                            </p>

                            <div style="text-align:center;margin:35px 0;">
                                <div style="
                                    display:inline-block;
                                    background:#fef2f2;
                                    color:#dc2626;
                                    padding:18px 40px;
                                    border-radius:10px;
                                    font-size:32px;
                                    font-weight:700;
                                    letter-spacing:8px;
                                    border:1px solid #fecaca;
                                ">
                                    ${otp}
                                </div>
                            </div>

                            <p style="color:#4b5563;font-size:15px;line-height:1.6;">
                                This code will expire in <strong>5 minutes</strong>.
                            </p>

                            <p style="color:#4b5563;font-size:15px;line-height:1.6;">
                                If you did not request a password reset, please ignore this email.
                                Your account remains secure.
                            </p>

                            <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;" />

                            <p style="font-size:13px;color:#6b7280;line-height:1.5;">
                                Never share this code with anyone. Bob's Stop employees will never ask for your OTP.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background:#f9fafb;padding:20px;text-align:center;">
                            <p style="margin:0;font-size:13px;color:#6b7280;">
                                © ${new Date().getFullYear()} Bob's Stop. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
