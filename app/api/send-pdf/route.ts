import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicializa o Resend com a chave de API que virá das variáveis de ambiente
const resend = new Resend(process.env.RESEND_API_KEY);

// Pega o e-mail da empresa das variáveis de ambiente.
// Se não estiver definido, usa um valor padrão para evitar erros.
const companyEmail = process.env.COMPANY_EMAIL;

export async function POST(request: Request) {
  // Validação inicial para garantir que as chaves estão configuradas
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY não está definida.");
    return NextResponse.json(
      { error: 'Chave da API Resend não configurada.' }, 
      { status: 500 }
    );
  }

  if (!companyEmail) {
    console.error("COMPANY_EMAIL não está definido.");
    return NextResponse.json(
      { error: 'E-mail da empresa não configurado.' }, 
      { status: 500 }
    );
  }

  try {
    // Pega os dados enviados pelo frontend (email do cliente e o PDF em base64)
    const { email, pdfBase64 } = await request.json();

    if (!email || !pdfBase64) {
      return NextResponse.json({ error: 'Dados incompletos. E-mail e PDF são obrigatórios.' }, { status: 400 });
    }

    console.log(`Tentando enviar e-mails para: ${email} e ${companyEmail}`);

    // Check if we're using test domain (onboarding@resend.dev)
    const canSendToExternal = false; // Set to true when you verify your domain

    // 1. Enviar o e-mail principal para a sua empresa
    try {
      // Only send to company email if it's the same as the sender or we have a verified domain
      if (canSendToExternal || companyEmail === 'victor@koresolutions.com.br') {
        const companyEmailResult = await resend.emails.send({
          from: 'Kore Solutions <onboarding@resend.dev>', // IMPORTANTE: Use seu domínio verificado aqui
          to: [companyEmail],
          subject: `Novo Perfil de Risco Recebido: ${email}`,
          html: `
            <h1>Novo Formulário Recebido</h1>
            <p>Um novo formulário de perfil de risco foi preenchido pelo cliente com o e-mail: <strong>${email}</strong>.</p>
            <p>O PDF com todas as respostas está anexado a este e-mail.</p>
            <br>
            <p><em>Esta é uma mensagem automática.</em></p>
          `,
          attachments: [
            {
              filename: `perfil-risco-${email}.pdf`,
              content: pdfBase64,
            },
          ],
        });
        
        console.log('E-mail para empresa enviado com sucesso:', companyEmailResult);
      } else {
        console.log('Pulando e-mail para empresa - domínio não verificado');
      }
    } catch (companyEmailError) {
      console.error('Erro ao enviar e-mail para empresa:', companyEmailError);
      // Continue para tentar enviar o e-mail de confirmação
    }

    // 2. Enviar um e-mail de confirmação para o cliente
    try {
      // Only send confirmation if it's the same as the sender or we have a verified domain
      if (canSendToExternal || email === 'victor@koresolutions.com.br') {
        const clientEmailResult = await resend.emails.send({
          from: 'Kore Solutions <onboarding@resend.dev>', // IMPORTANTE: Use seu domínio verificado aqui
          to: [email],
          subject: 'Recebemos seu Perfil de Risco - Kore Solutions',
          html: `
            <h1>Obrigado por seu interesse!</h1>
            <p>Olá,</p>
            <p>Confirmamos o recebimento do seu formulário de perfil de risco. Nossa equipe já foi notificada e analisará suas respostas.</p>
            <p>Entraremos em contato em breve.</p>
            <br>
            <p>Atenciosamente,</p>
            <p><strong>Equipe Kore Solutions</strong></p>
          `,
        });
        
        console.log('E-mail de confirmação enviado com sucesso:', clientEmailResult);
      } else {
        console.log('Pulando e-mail de confirmação - domínio não verificado');
      }
    } catch (clientEmailError) {
      console.error('Erro ao enviar e-mail de confirmação:', clientEmailError);
      // Continue mesmo se o e-mail de confirmação falhar
    }

    // Retorna uma resposta de sucesso para o frontend
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erro na API /api/send-pdf:', error);
    return NextResponse.json({ error: 'Falha ao processar a solicitação.' }, { status: 500 });
  }
}