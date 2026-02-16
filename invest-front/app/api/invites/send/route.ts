import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

// Inicializar SendGrid com a chave de API
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { email, fullName, message, tenantId } = await request.json();

    // Validações
    if (!email || !fullName) {
      return NextResponse.json(
        { success: false, message: "Email e nome são obrigatórios" },
        { status: 400 }
      );
    }

    // Gerar link de convite (exemplo - adaptado para sua aplicação)
    const inviteToken = Buffer.from(`${email}:${Date.now()}`).toString("base64");
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invites/${inviteToken}`;

    // Montando o corpo do email
    const htmlContent = `
      <h2>Convite para Investir</h2>
      <p>Olá ${fullName},</p>
      
      <p>Você foi convidado para se juntar à nossa plataforma de investimentos!</p>
      
      ${message ? `<p><strong>Mensagem:</strong> ${message}</p>` : ""}
      
      <p>
        <a href="${inviteLink}" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Aceitar Convite
        </a>
      </p>
      
      <p>Se o botão acima não funcionar, copie este link:</p>
      <p>${inviteLink}</p>
      
      <p>Atenciosamente,<br>Equipe de Investimentos</p>
    `;

    // Enviar email via SendGrid
    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@invest.com",
      subject: "Convite para Investir na Plataforma",
      html: htmlContent,
    });

    // Aqui você pode salvar o convite no banco de dados
    // await saveInviteToDatabase({ email, fullName, inviteToken, tenantId });

    return NextResponse.json(
      {
        success: true,
        message: "Convite enviado com sucesso!",
        inviteLink, // Opcional: retornar o link para testes
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao enviar convite:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Erro ao enviar convite",
      },
      { status: 500 }
    );
  }
}
