import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import connectDB from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Email API called');
    
    const body = await request.json();
    console.log('📧 Received form data:', body);
    
    const { name, email, mobile, courseInterest, neetScore } = body;

    // Validate required fields
    if (!name || !email || !courseInterest) {
      console.log('❌ Validation failed - missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and course interest are required' },
        { status: 400 }
      );
    }

    // Connect to database and save enquiry
    console.log('📊 Connecting to database...');
    await connectDB();
    
    console.log('💾 Saving enquiry to database...');
    const enquiry = new Enquiry({
      name,
      email,
      mobile,
      courseInterest,
      neetScore,
    });
    
    await enquiry.save();
    console.log('✅ Enquiry saved successfully with ID:', enquiry._id);

    // Check environment variables
    console.log('🔧 Environment check:');
    console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('RESEND_API_KEY length:', process.env.RESEND_API_KEY?.length || 0);
    console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
    console.log('FROM_EMAIL:', process.env.FROM_EMAIL);

    // Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'sagarbishtz589@gmail.com';
    console.log('📨 Sending admin email to:', adminEmail);
    
    const courseLabel = courseInterest.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

    const emailContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f4f7fc;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fc;padding:30px 10px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#0F2042,#1E3A8A);padding:32px 36px;text-align:center;">
                <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">📋 New Admission Inquiry</h1>
                <p style="margin:6px 0 0;font-size:14px;color:#94a3b8;">${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </td>
            </tr>
            <!-- Student Info -->
            <tr>
              <td style="padding:32px 36px 8px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:14px 18px;background:#f8fafc;border-radius:12px;border-left:4px solid #F1B82D;">
                      <table width="100%" cellpadding="6" cellspacing="0">
                        <tr><td style="font-size:14px;color:#64748b;padding:4px 0;width:110px;">👤 Name</td><td style="font-size:14px;font-weight:600;color:#0f172a;padding:4px 0;">${name}</td></tr>
                        <tr><td style="font-size:14px;color:#64748b;padding:4px 0;width:110px;">📧 Email</td><td style="font-size:14px;font-weight:600;color:#0f172a;padding:4px 0;"><a href="mailto:${email}" style="color:#2563eb;text-decoration:none;">${email}</a></td></tr>
                        <tr><td style="font-size:14px;color:#64748b;padding:4px 0;width:110px;">📞 Mobile</td><td style="font-size:14px;font-weight:600;color:#0f172a;padding:4px 0;">${mobile || '<span style="color:#94a3b8;">Not provided</span>'}</td></tr>
                        <tr><td style="font-size:14px;color:#64748b;padding:4px 0;width:110px;">🎯 Course</td><td style="font-size:14px;font-weight:600;color:#0f172a;padding:4px 0;"><span style="display:inline-block;background:#F1B82D/10;color:#D99B1E;padding:2px 10px;border-radius:6px;font-size:13px;">${courseLabel}</span></td></tr>
                        <tr><td style="font-size:14px;color:#64748b;padding:4px 0;width:110px;">📊 NEET Score</td><td style="font-size:14px;font-weight:600;color:#0f172a;padding:4px 0;">${neetScore || '<span style="color:#94a3b8;">Not provided</span>'}</td></tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- CTA -->
            <tr>
              <td style="padding:16px 36px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background:#0F2042;border-radius:12px;padding:20px 24px;text-align:center;">
                      <p style="margin:0 0 12px;font-size:14px;color:#94a3b8;line-height:1.5;">This inquiry was submitted from the Himalayan Education admission portal. Please contact the student as soon as possible.</p>
                      <a href="mailto:${email}" style="display:inline-block;background:#F1B82D;color:#0F2042;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;">Reply to ${name}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background:#f8fafc;padding:20px 36px;text-align:center;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:12px;color:#94a3b8;">This is an automated notification from <strong style="color:#0f172a;">Himalayan Education</strong></p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>`;

    console.log('📧 Attempting to send admin email...');
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: [adminEmail],
      subject: `New Admission Inquiry: ${name} - ${courseInterest}`,
      html: emailContent,
    });

    console.log('📧 Admin email response:', { data, error });

    if (error) {
      console.error('❌ Admin email sending failed (enquiry saved):', error);
    } else {
      console.log('✅ Admin email sent successfully!');
    }

    // Send confirmation email to student
    const confirmationContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f4f7fc;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fc;padding:30px 10px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#0F2042,#1E3A8A);padding:32px 36px;text-align:center;">
                <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">✅ Inquiry Received!</h1>
                <p style="margin:6px 0 0;font-size:14px;color:#94a3b8;">Himalayan Education</p>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:32px 36px;">
                <p style="font-size:16px;color:#0f172a;line-height:1.6;margin:0 0 6px;">Dear <strong style="color:#F1B82D;">${name}</strong>,</p>
                <p style="font-size:15px;color:#334155;line-height:1.7;margin:0 0 20px;">Thank you for your interest in <strong style="color:#0F2042;">${courseLabel}</strong>. We have received your inquiry and our admission team will contact you within <strong>24-48 hours</strong>.</p>
                <!-- Steps -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                  <tr>
                    <td style="padding:18px 20px;background:#f8fafc;border-radius:12px;">
                      <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;">📌 What happens next</p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr><td style="padding:5px 0;font-size:14px;color:#475569;"><span style="display:inline-block;width:22px;height:22px;background:#F1B82D;color:#fff;border-radius:6px;text-align:center;font-size:12px;font-weight:700;line-height:22px;margin-right:8px;">1</span>Our counselor reviews your profile</td></tr>
                        <tr><td style="padding:5px 0;font-size:14px;color:#475569;"><span style="display:inline-block;width:22px;height:22px;background:#F1B82D;color:#fff;border-radius:6px;text-align:center;font-size:12px;font-weight:700;line-height:22px;margin-right:8px;">2</span>We reach out via call / email</td></tr>
                        <tr><td style="padding:5px 0;font-size:14px;color:#475569;"><span style="display:inline-block;width:22px;height:22px;background:#F1B82D;color:#fff;border-radius:6px;text-align:center;font-size:12px;font-weight:700;line-height:22px;margin-right:8px;">3</span>Personalized college recommendations</td></tr>
                        <tr><td style="padding:5px 0;font-size:14px;color:#475569;"><span style="display:inline-block;width:22px;height:22px;background:#F1B82D;color:#fff;border-radius:6px;text-align:center;font-size:12px;font-weight:700;line-height:22px;margin-right:8px;">4</span>End-to-end admission support</td></tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <!-- Urgent -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background:linear-gradient(135deg,#0F2042,#1E3A8A);border-radius:12px;padding:20px 24px;text-align:center;">
                      <p style="margin:0 0 4px;font-size:13px;color:#94a3b8;">Need immediate assistance?</p>
                      <p style="margin:0;font-size:16px;font-weight:700;color:#F1B82D;">${process.env.ADMIN_PHONE || '+91 93540 23968'}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background:#f8fafc;padding:24px 36px;text-align:center;border-top:1px solid #e2e8f0;">
                <p style="margin:0 0 4px;font-size:13px;color:#475569;font-weight:600;">Himalayan Education</p>
                <p style="margin:0 0 12px;font-size:12px;color:#94a3b8;">Unit 05, 16th Floor, Silver Tower, Wave One, Sector 18, Noida, U.P.</p>
                <a href="https://himalyaneducation.com" style="display:inline-block;font-size:12px;color:#2563eb;text-decoration:none;">himalyaneducation.com</a>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>`;

    console.log('📧 Attempting to send student confirmation email...');
    const studentResponse = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: [email],
      subject: 'Your MBBS Admission Inquiry - Himalayan Education',
      html: confirmationContent,
    });

    console.log('📧 Student email response:', studentResponse);

    if (studentResponse.error) {
      console.error('❌ Student email sending failed:', studentResponse.error);
    } else {
      console.log('✅ Student confirmation email sent successfully!');
    }

    console.log('🎉 Form submission completed successfully!');
    return NextResponse.json(
      { 
        success: true, 
        message: 'Your enquiry has been submitted successfully! Our team will contact you soon.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
