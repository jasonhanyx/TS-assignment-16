export const template = (
  code: string,
  firstName: string,
  subject: string,
): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="background:#f4f4f4;padding:40px 0;"
  >
    <tr>
      <td align="center">

        <table
          width="600"
          cellpadding="0"
          cellspacing="0"
          style="background:#ffffff;border-radius:8px;overflow:hidden;"
        >

          <!-- Header -->
          <tr>
            <td
              style="
                background:#2563eb;
                color:#ffffff;
                padding:20px;
                text-align:center;
                font-size:24px;
                font-weight:bold;
              "
            >
              ${subject}
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px 30px;">

              <h2 style="margin:0 0 20px;color:#333;">
                Hello ${firstName},
              </h2>

              <p style="font-size:16px;color:#555;line-height:1.6;">
                Thank you for using our service.
              </p>

              <p style="font-size:16px;color:#555;line-height:1.6;">
                Please use the verification code below:
              </p>

              <!-- Verification Code -->
              <div style="text-align:center;margin:35px 0;">
                <span
                  style="
                    display:inline-block;
                    background:#2563eb;
                    color:#ffffff;
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:8px;
                    padding:18px 35px;
                    border-radius:8px;
                  "
                >
                  ${code}
                </span>
              </div>

              <p style="font-size:14px;color:#777;line-height:1.6;">
                This code will expire shortly. If you didn't request this email,
                you can safely ignore it.
              </p>

              <p style="margin-top:30px;font-size:16px;color:#333;">
                Best Regards,<br />
                <strong>Your Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              style="
                background:#f8f8f8;
                padding:20px;
                text-align:center;
                color:#888;
                font-size:12px;
              "
            >
              © ${new Date().getFullYear()} Your Company. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
};
