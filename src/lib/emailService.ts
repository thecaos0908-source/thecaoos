import emailjs from '@emailjs/browser';

// Configurações do EmailJS
const EMAILJS_SERVICE_ID = 'service_x1dh8as';
const EMAILJS_TEMPLATE_ID = 'template_v49iiji';
const EMAILJS_PUBLIC_KEY = 'JVKxR7fR4eA_SRhHx';

export interface EmailData {
  to_name: string;
  to_email: string;
  ticket_id: string;
  event_name: string;
  event_date: string;
  event_time: string;
  event_location: string;
}

export const emailService = {
  // Inicializar EmailJS
  init: () => {
    try {
      emailjs.init(EMAILJS_PUBLIC_KEY);
      console.log('EmailJS inicializado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao inicializar EmailJS:', error);
      return false;
    }
  },

  // Enviar email de confirmação do ingresso
  sendTicketConfirmation: async (data: EmailData): Promise<boolean> => {
    try {
      console.log('Tentando enviar email com dados:', data);
      
      const templateParams = {
        to_name: data.to_name,
        to_email: data.to_email,
        ticket_id: data.ticket_id,
        event_name: data.event_name,
        event_date: data.event_date,
        event_time: data.event_time,
        event_location: data.event_location,
        message: `Olá ${data.to_name}!

Seu ingresso para o evento THE CAOS foi garantido com sucesso!

📋 DETALHES DO INGRESSO:
• ID do Ingresso: ${data.ticket_id}
• Nome: ${data.to_name}
• Email: ${data.to_email}

🎉 DETALHES DO EVENTO:
• Evento: ${data.event_name}
• Data: ${data.event_date}
• Horário: ${data.event_time}
• Local: ${data.event_location}

IMPORTANTE: Guarde este ID (${data.ticket_id}) para apresentar na entrada do evento.

Nos vemos no THE CAOS! 🎪

Equipe THE CAOS`
      };

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log('Resultado do envio:', result);
      console.log('Status:', result.status);
      
      return result.status === 200;
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return false;
    }
  }
};

// Função para simular envio de email (para desenvolvimento)
export const mockEmailService = {
  sendTicketConfirmation: async (data: EmailData): Promise<boolean> => {
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('📧 Email enviado (simulado):', {
      to: data.to_email,
      subject: `THE CAOS - Ingresso Confirmado (ID: ${data.ticket_id})`,
      ticketId: data.ticket_id
    });
    
    return true;
  }
};
