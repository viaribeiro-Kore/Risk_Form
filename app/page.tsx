"use client";

import { useRef, useState } from "react";
import { formSections } from "@/data/form-questions";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Importa as bibliotecas para gerar o PDF
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function RiskProfileForm() {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<"success" | "error" | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // --- LÓGICA PRINCIPAL IMPLEMENTADA AQUI ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validação para garantir que o formulário e o email estão prontos
    if (!formRef.current || !email || !clientName) {
      alert("Por favor, preencha seu nome e e-mail antes de enviar.");
      return;
    }
    
    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      // Create a separate element for PDF generation with inline styles only
      const pdfElement = document.createElement('div');
      pdfElement.style.cssText = `
        background-color: #ffffff;
        color: #171717;
        font-family: Arial, sans-serif;
        padding: 40px;
        max-width: 800px;
        margin: 0 auto;
        line-height: 1.6;
      `;
      
      // Add the form content with inline styles
      pdfElement.innerHTML = `
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #0047AB; font-size: 32px; font-weight: bold; margin: 0;">Kore Solutions</h1>
          <p style="color: #6b7280; margin: 10px 0 0 0;">Formulário de Perfil de Risco</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 30px;">
          <div>
            <label style="display: block; font-weight: bold; margin-bottom: 10px; color: #374151;">Nome:</label>
            <div style="padding: 10px; border: 1px solid #d1d5db; border-radius: 4px; background-color: #f9fafb;">${clientName}</div>
          </div>
          <div>
            <label style="display: block; font-weight: bold; margin-bottom: 10px; color: #374151;">E-mail:</label>
            <div style="padding: 10px; border: 1px solid #d1d5db; border-radius: 4px; background-color: #f9fafb;">${email}</div>
          </div>
        </div>
        
        ${formSections.map(section => `
          <div style="margin-bottom: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <h2 style="font-size: 24px; font-weight: bold; color: #1f2937; border-left: 4px solid #0047AB; padding-left: 16px; margin: 0 0 20px 0;">${section.title}</h2>
            <div style="margin-top: 20px;">
              ${section.questions.map(q => `
                <div style="margin-bottom: 30px;">
                  <label style="display: block; font-weight: bold; margin-bottom: 10px; color: #374151;">${q.text}${q.required ? '<span style="color: #ef4444; margin-left: 4px;">*</span>' : ''}</label>
                  <div style="margin-top: 15px;">
                    ${q.type === 'radio' ? 
                      q.options.map(opt => `
                        <div style="margin-bottom: 8px;">
                          <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="radio" name="${q.id}" value="${opt}" ${answers[q.id] === opt ? 'checked' : ''} style="margin-right: 8px;" disabled>
                            <span style="color: #6b7280;">${opt}</span>
                          </label>
                        </div>
                      `).join('') :
                      q.type === 'checkbox' ?
                      q.options.map(opt => `
                        <div style="margin-bottom: 8px;">
                          <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="checkbox" name="${q.id}" value="${opt}" ${(answers[q.id] || []).includes(opt) ? 'checked' : ''} style="margin-right: 8px;" disabled>
                            <span style="color: #6b7280;">${opt}</span>
                          </label>
                        </div>
                      `).join('') : ''
                    }
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      `;
      
      // Temporarily add to DOM
      document.body.appendChild(pdfElement);
      
      // 1. Usa html2canvas para criar um 'canvas' (uma imagem) da div do formulário
      const canvas = await html2canvas(pdfElement, {
        scale: 1, // Reduced from 2 to 1 to decrease file size
        backgroundColor: '#ffffff', // Define um fundo branco para a captura
        useCORS: true, // Necessário se houver imagens externas
        allowTaint: true, // Permite conteúdo externo
        foreignObjectRendering: false, // Desabilita renderização de objetos estrangeiros
        imageTimeout: 0, // Sem timeout para imagens
        logging: false, // Desabilita logs
        removeContainer: true, // Remove container temporário
        ignoreElements: (element) => {
          // Ignora elementos que podem causar problemas
          return element.tagName === 'SCRIPT' || element.tagName === 'STYLE';
        },
        // Remove size limitations to capture full content
        width: undefined,
        height: undefined,
        scrollX: 0,
        scrollY: 0
      });
      
      // Remove the temporary element
      document.body.removeChild(pdfElement);
      
      // 2. Cria um novo documento PDF no formato A4
      const pdf = new jsPDF({
        orientation: 'portrait', // 'p' ou 'portrait'
        unit: 'mm',
        format: 'a4',
        compress: true // Enable compression
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Calculate how many pages we need
      const pageCount = Math.ceil(imgHeight / pdfHeight);
      
      // Add image to PDF across multiple pages
      for (let i = 0; i < pageCount; i++) {
        // Add new page if not the first page
        if (i > 0) {
          pdf.addPage();
        }
        
        // Calculate the portion of the image to show on this page
        const sourceY = i * canvas.height / pageCount;
        const sourceHeight = canvas.height / pageCount;
        
        // Create a temporary canvas for this page
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = sourceHeight;
        
        // Draw the portion of the original canvas to the temp canvas
        if (!tempCtx) {
          throw new Error('Failed to get 2D context for temporary canvas.');
        }
        tempCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
        
        // Convert temp canvas to image
        const pageImgData = tempCanvas.toDataURL('image/jpeg', 0.7);
        
        // Add this page's image to PDF
        pdf.addImage(pageImgData, 'JPEG', 0, 0, imgWidth, pdfHeight);
      }
      
      // Converte o PDF para o formato Base64, que é uma string de texto.
      // Isso é necessário para enviá-lo dentro de um JSON para nossa API.
      const pdfBase64 = pdf.output('datauristring').split(',')[1];

      // 3. Envia os dados para a nossa API (que criaremos na Etapa 4)
      const response = await fetch('/api/send-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: clientName,
          email: email, 
          pdfBase64: pdfBase64 
        }),
      });

      if (!response.ok) {
        // Se a resposta da API não for 'ok' (ex: erro 500), lança um erro
        throw new Error("Falha ao enviar os dados para o servidor.");
      }

      // Se tudo correu bem, atualiza o status para mostrar a mensagem de sucesso
      setSubmissionStatus('success');

    } catch (error) {
      console.error("Erro no processo de envio:", error);
      setSubmissionStatus('error');
    } finally {
      // Garante que o estado de 'submitting' seja resetado no final
      setIsSubmitting(false);
    }
  };

  // O resto do código é idêntico ao da Etapa 2...

  if (submissionStatus === 'success') {
    return (
      <main className="bg-kore-hero container mx-auto flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl text-center">
          <img src="/kore-logo-black.svg" alt="Kore Solutions" className="mx-auto h-14 md:h-16 w-auto invert font-h1" />
          <h2 className="mt-8 text-3xl font-bold text-white">Obrigado!</h2>
          <p className="mt-3 text-lg text-white/80">Seu perfil de risco foi enviado com sucesso. Enviamos uma confirmação para seu e-mail e nossa equipe entrará em contato em breve.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-kore-hero py-12 md:py-20">
      <div className="container mx-auto max-w-3xl">
        <form onSubmit={handleSubmit}>
          <div ref={formRef} className="card-luxe p-6 md:p-10">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <img src="/kore-logo-black.svg" alt="Kore Solutions" className="h-10 md:h-12 w-auto" onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                }} />
                <span className="text-slate-600 text-sm md:text-base">Conectamos investidores tradicionais ao universo blockchain</span>
              </div>
              <p className="text-slate-500 mt-6">Formulário de Perfil de Risco</p>
            </div>
            <div className="space-y-4 mb-6">
              <Label htmlFor="name" className="text-base font-semibold text-gray-800">Seu nome completo*</Label>
              <Input
                id="name"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                placeholder="Seu nome"
                className="text-base"
              />
            </div>
            <div className="space-y-4 mb-10">
              <Label htmlFor="email" className="text-base font-semibold text-gray-800">Seu e-mail*</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nome@exemplo.com"
                className="text-base"
              />
            </div>
            {formSections.map(section => (
              <div key={section.id} className="mb-10 pt-6 border-t border-slate-200">
                <h2 className="heading-accent text-2xl md:text-3xl font-h2 text-slate-800">
                    {section.title}
                </h2>
                <div className="space-y-8 mt-8">
                  {section.questions.map((q) => (
                    <div key={q.id}>
                      <Label className="text-base font-semibold text-gray-700">{q.text}{q.required && <span className="text-red-500 ml-1">*</span>}</Label>
                      <div className="mt-4 space-y-3">
                        {q.type === 'radio' && (
                          <RadioGroup onValueChange={(value) => handleAnswerChange(q.id, value)} value={typeof answers[q.id] === 'string' ? (answers[q.id] as string) : undefined}>
                            {q.options.map((opt) => (
                              <div key={opt} className="flex items-center space-x-3">
                                <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                                <Label htmlFor={`${q.id}-${opt}`} className="font-normal text-gray-600 cursor-pointer">{opt}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}
                        {q.type === 'checkbox' && (
                          q.options.map((opt) => (
                            <div key={opt} className="flex items-center space-x-3">
                              <Checkbox 
                                id={`${q.id}-${opt}`} 
                                onCheckedChange={(checked) => {
                                  const isChecked = checked === true;
                                  const current = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
                                  const newAnswers = isChecked
                                    ? [...current, opt]
                                    : current.filter((item) => item !== opt);
                                  handleAnswerChange(q.id, newAnswers);
                                }}
                                checked={Array.isArray(answers[q.id]) ? (answers[q.id] as string[]).includes(opt) : false}
                              />
                              <Label htmlFor={`${q.id}-${opt}`} className="font-normal text-gray-600 cursor-pointer">{opt}</Label>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <Button type="submit" size="lg" className="w-full md:w-auto text-lg bg-[#0047AB] hover:bg-[#003a86] text-white shadow-lg shadow-blue-900/30" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Finalizar e Enviar Perfil"}
            </Button>
          </div>
          {submissionStatus === 'error' && <p className="text-red-500 mt-4 text-right">Ocorreu um erro ao enviar. Por favor, tente novamente.</p>}
        </form>
      </div>
    </main>
  );
}
