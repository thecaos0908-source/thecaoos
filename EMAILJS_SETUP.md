# Configuração do EmailJS para Envio de Emails

## Passo 1: Criar Conta no EmailJS

1. Acesse [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crie uma conta gratuita
3. Faça login no painel

## Passo 2: Configurar Serviço de Email

1. No painel, vá para **Email Services**
2. Clique em **Add New Service**
3. Escolha seu provedor de email (Gmail, Outlook, etc.)
4. Siga as instruções para conectar sua conta
5. Anote o **Service ID** gerado

## Passo 3: Criar Template de Email

1. Vá para **Email Templates**
2. Clique em **Create New Template**
3. Use este template:

**Subject:** `THE CAOS - Ingresso Confirmado (ID: {{ticket_id}})`

**Body:**
```
Olá {{to_name}}!

Seu ingresso para o evento THE CAOS foi garantido com sucesso!

📋 DETALHES DO INGRESSO:
• ID do Ingresso: {{ticket_id}}
• Nome: {{to_name}}
• Email: {{to_email}}

🎉 DETALHES DO EVENTO:
• Evento: {{event_name}}
• Data: {{event_date}}
• Horário: {{event_time}}
• Local: {{event_location}}

IMPORTANTE: Guarde este ID ({{ticket_id}}) para apresentar na entrada do evento.

Nos vemos no THE CAOS! 🎪

Equipe THE CAOS
```

4. Salve o template e anote o **Template ID**

## Passo 4: Obter Chave Pública

1. Vá para **Account** > **General**
2. Copie sua **Public Key**

## Passo 5: Configurar no Código

1. Abra `src/lib/emailService.ts`
2. Substitua as constantes:

```typescript
const EMAILJS_SERVICE_ID = 'SEU_SERVICE_ID_AQUI';
const EMAILJS_TEMPLATE_ID = 'SEU_TEMPLATE_ID_AQUI';
const EMAILJS_PUBLIC_KEY = 'SUA_PUBLIC_KEY_AQUI';
```

## Passo 6: Ativar Email Real

1. Em `src/pages/TicketForm.tsx`
2. Troque `mockEmailService` por `emailService`:

```typescript
// Trocar esta linha:
const emailSent = await mockEmailService.sendTicketConfirmation(emailData);

// Por esta:
const emailSent = await emailService.sendTicketConfirmation(emailData);
```

## Teste

Após configurar, teste garantindo um ingresso. O usuário deve receber um email com:
- ID do ingresso
- Detalhes do evento
- Confirmação de garantia

## Limites Gratuitos

- EmailJS gratuito: 200 emails/mês
- Para mais emails, considere upgrade do plano
