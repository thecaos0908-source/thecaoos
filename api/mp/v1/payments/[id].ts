import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  if (req.method !== 'GET' || !id) {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = process.env.MP_ACCESS_TOKEN || process.env.MERCADO_PAGO_ACCESS_TOKEN || '';
  if (!token) {
    res.status(500).json({ error: 'Missing MP access token on server' });
    return;
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Unknown error' });
  }
}


