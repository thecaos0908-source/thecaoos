// Serviço de pagamento com Mercado Pago (Checkout Pro via preferências públicas de teste)

export type PaymentStatus = 'approved' | 'rejected' | 'pending' | 'in_process' | 'unknown';

export interface CreatePreferenceParams {
	itemTitle: string;
	itemQuantity: number;
	itemUnitPrice: number; // BRL
	payerEmail: string;
	returnUrl: string; // rota no app para retornar (success, failure, pending)
}

export interface PreferenceResponse {
	id: string;
	init_point: string;
	sandbox_init_point?: string;
}

export interface CreatePixPaymentParams {
  amount: number;
  description: string;
  payerEmail: string;
  payerFirstName?: string;
}

export interface PixPaymentResponse {
  id: string;
  status: string;
  point_of_interaction?: {
    transaction_data?: {
      qr_code: string;
      qr_code_base64: string;
    };
  };
}

declare global {
	interface Window {
		MercadoPago?: any;
		MP_PUBLIC_KEY?: string;
	}
}

// Local (Vite): usa proxy "/mp" com Authorization no cliente
// Produção (Vercel): usa "/api/mp" (serverless com token no servidor)
const MP_API_BASE = import.meta.env.DEV ? '/mp' : '/api/mp';

// ATENÇÃO: Para produção, usar o backend seguro (rotas /api/mp) com o Access Token no servidor.
// Em desenvolvimento local, usamos um Access Token definido em VITE_MP_ACCESS_TOKEN ou caímos no token abaixo.
const TEST_ACCESS_TOKEN = 'APP_USR-8709275922573784-102619-20edb8b179924bf227645b16f89202be-2943677940';
const DEV_ACCESS_TOKEN = (import.meta as any).env?.VITE_MP_ACCESS_TOKEN || TEST_ACCESS_TOKEN;

export const paymentService = {
    openPredefinedCheckout: (): void => {
        if (!window.MercadoPago) {
            throw new Error('SDK do Mercado Pago não encontrado');
        }
        const prefId = (import.meta as any).env?.VITE_MP_PREFERENCE_ID || (import.meta as any).env?.VITE_MP_PREFERENCE_ID_SANDBOX;
        if (!prefId) {
            throw new Error('VITE_MP_PREFERENCE_ID não definido');
        }
        const mp = new window.MercadoPago(window.MP_PUBLIC_KEY, { locale: 'pt-BR' });
        mp.checkout({ preference: { id: prefId } });
    },
	createPreference: async (params: CreatePreferenceParams): Promise<PreferenceResponse> => {
		const body = {
			items: [
				{
					title: params.itemTitle,
					quantity: params.itemQuantity,
					currency_id: 'BRL',
					unit_price: params.itemUnitPrice,
				},
			],
			payer: { email: params.payerEmail },
			payment_methods: {
				// manter apenas Pix (bank_transfer)
				excluded_payment_types: [
					{ id: 'credit_card' },
					{ id: 'debit_card' },
					{ id: 'ticket' },
					{ id: 'atm' },
					{ id: 'account_money' },
					{ id: 'prepaid_card' },
					{ id: 'digital_currency' },
				],
				default_payment_method_id: 'pix',
				installments: 1,
			},
			binary_mode: false,
			back_urls: {
				success: `${params.returnUrl}?status=success`,
				failure: `${params.returnUrl}?status=failure`,
				pending: `${params.returnUrl}?status=pending`,
			},
			auto_return: 'approved',
		};

		const response = await fetch(`${MP_API_BASE}/checkout/preferences`, {
			method: 'POST',
			headers: (() => {
                const h: Record<string, string> = { 'Content-Type': 'application/json' };
                if (import.meta.env.DEV) {
                    h.Authorization = `Bearer ${DEV_ACCESS_TOKEN}`;
				}
				return h;
			})(),
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			let detail = '';
			try {
				const err = await response.json();
				detail = err?.message || err?.error || (err?.cause && err.cause[0]?.description) || '';
			} catch (_) {
				const text = await response.text();
				detail = text;
			}
			throw new Error(`Falha ao criar preferência (${response.status}): ${detail}`);
		}

		return (await response.json()) as PreferenceResponse;
	},

	// Preferência para Checkout Pro com cartão (crédito/débito)
	createCardPreference: async (params: CreatePreferenceParams): Promise<PreferenceResponse> => {
		const includeAutoReturn = /^https:\/\//.test(params.returnUrl);
		const body: any = {
			items: [
				{
					title: params.itemTitle,
					quantity: params.itemQuantity,
					currency_id: 'BRL',
					unit_price: params.itemUnitPrice,
				},
			],
			payer: { email: params.payerEmail },
			payment_methods: {
				// Força cartão: remove Pix (bank_transfer) e seta o tipo padrão como cartão
				excluded_payment_types: [
					{ id: 'bank_transfer' },
				],
				default_payment_type_id: 'credit_card',
				installments: 12,
			},
			binary_mode: false,
			back_urls: {
				success: `${params.returnUrl}?status=success`,
				failure: `${params.returnUrl}?status=failure`,
				pending: `${params.returnUrl}?status=pending`,
			},
		};
		if (includeAutoReturn) body.auto_return = 'approved';

		const response = await fetch(`${MP_API_BASE}/checkout/preferences`, {
			method: 'POST',
			headers: (() => {
                const h: Record<string, string> = { 'Content-Type': 'application/json' };
                if (import.meta.env.DEV) {
                    h.Authorization = `Bearer ${DEV_ACCESS_TOKEN}`;
				}
				return h;
			})(),
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			let detail = '';
			try {
				const err = await response.json();
				detail = err?.message || err?.error || (err?.cause && err.cause[0]?.description) || '';
			} catch (_) {
				const text = await response.text();
				detail = text;
			}
			throw new Error(`Falha ao criar preferência cartão (${response.status}): ${detail}`);
		}

		return (await response.json()) as PreferenceResponse;
	},

	openCheckout: (preferenceId: string): void => {
		if (!window.MercadoPago) {
			throw new Error('SDK do Mercado Pago não encontrado');
		}
		const mp = new window.MercadoPago(window.MP_PUBLIC_KEY, { locale: 'pt-BR' });
		mp.checkout({ preference: { id: preferenceId } });
	},

	mapQueryStatusToPaymentStatus: (queryStatus?: string | null): PaymentStatus => {
		switch (queryStatus) {
			case 'success':
				return 'approved';
			case 'failure':
				return 'rejected';
			case 'pending':
				return 'pending';
			default:
				return 'unknown';
		}
	},

	createPixPayment: async (params: CreatePixPaymentParams): Promise<PixPaymentResponse> => {
    const body = {
      transaction_amount: params.amount,
      description: params.description,
      payment_method_id: 'pix',
      payer: {
        email: params.payerEmail,
				first_name: params.payerFirstName,
				identification: {
					type: 'CPF',
					number: '19119119100', // CPF de teste
				},
      },
    };

    // Header de idempotência obrigatório pela API
    const idempotencyKey = `chaos-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

		const response = await fetch(`${MP_API_BASE}/v1/payments`, {
      method: 'POST',
      headers: (() => {
        const h: Record<string, string> = {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        };
        if (import.meta.env.DEV) {
          h.Authorization = `Bearer ${DEV_ACCESS_TOKEN}`;
        }
        return h;
      })(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
			let detail = '';
			try {
				const err = await response.json();
				detail = err?.message || err?.error || (err?.cause && err.cause[0]?.description) || '';
			} catch (_) {
				const text = await response.text();
				detail = text;
			}
			throw new Error(`Falha ao criar pagamento PIX (${response.status}): ${detail}`);
    }

    return (await response.json()) as PixPaymentResponse;
  },

  getPaymentStatus: async (paymentId: string): Promise<PaymentStatus> => {
    const response = await fetch(`${MP_API_BASE}/v1/payments/${paymentId}`, {
      headers: (() => {
        const h: Record<string, string> = {};
        if (import.meta.env.DEV) {
          h.Authorization = `Bearer ${DEV_ACCESS_TOKEN}`;
        }
        return h;
      })(),
    });
    if (!response.ok) {
      return 'unknown';
    }
    const data = (await response.json()) as { status?: string };
    switch (data.status) {
      case 'approved':
        return 'approved';
      case 'rejected':
        return 'rejected';
      case 'in_process':
        return 'in_process';
      case 'pending':
        return 'pending';
      default:
        return 'unknown';
    }
  },

  // Search payments by filters (server-side proxy)
  searchPayments: async (params: Record<string, string | number | boolean | undefined>): Promise<any> => {
    const usp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) usp.set(k, String(v));
    });
    const response = await fetch(`${MP_API_BASE}/v1/payments/search?${usp.toString()}`, {
      headers: (() => {
        const h: Record<string, string> = {};
        if (import.meta.env.DEV) {
          h.Authorization = `Bearer ${DEV_ACCESS_TOKEN}`;
        }
        return h;
      })(),
    });
    if (!response.ok) {
      throw new Error(`Falha ao buscar pagamentos (${response.status})`);
    }
    return await response.json();
  },
};


