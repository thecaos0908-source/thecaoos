import type { VercelRequest, VercelResponse } from '@vercel/node';

const MP_API = 'https://api.mercadopago.com/checkout/preferences';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = process.env.MP_ACCESS_TOKEN || process.env.MERCADO_PAGO_ACCESS_TOKEN || '';
  if (!token) {
    res.status(500).json({ error: 'Missing MP access token on server' });
    return;
  }

  try {
    const response = await fetch(MP_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Unknown error' });
  }
}


