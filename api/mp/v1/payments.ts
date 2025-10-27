import type { VercelRequest, VercelResponse } from '@vercel/node';

const MP_API = 'https://api.mercadopago.com/v1/payments';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = process.env.MP_ACCESS_TOKEN || process.env.MERCADO_PAGO_ACCESS_TOKEN || '';
  if (!token) {
    res.status(500).json({ error: 'Missing MP access token on server' });
    return;
  }

  try {
    if (req.method === 'POST') {
      const response = await fetch(MP_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Idempotency-Key': (req.headers['x-idempotency-key'] as string) || `chaos-${Date.now()}`,
        },
        body: JSON.stringify(req.body),
      });
      const text = await response.text();
      res.status(response.status).send(text);
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Unknown error' });
  }
}


