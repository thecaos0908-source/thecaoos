export interface TicketRegistration {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  paid?: boolean;
  token?: string;
  paymentId?: string;
}

export const storage = {
  // Helpers seguros para cookie/localStorage
  _setCookie: (name: string, value: string, days = 7) => {
    try {
      const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    } catch (_) { /* noop */ }
  },
  _getCookie: (name: string): string | null => {
    try {
      const match = document.cookie.split('; ').find(row => row.startsWith(name + '='));
      return match ? decodeURIComponent(match.split('=')[1]) : null;
    } catch (_) { return null; }
  },
  _deleteCookie: (name: string) => {
    try {
      document.cookie = `${name}=; Max-Age=0; path=/`;
    } catch (_) { /* noop */ }
  },
  // Salvar registro de ingresso
  saveTicket: (data: Omit<TicketRegistration, 'id' | 'createdAt'>): TicketRegistration => {
    // Gerar ID de 5 dígitos máximo
    const timestamp = Date.now();
    const id = (timestamp % 100000).toString().padStart(5, '0');
    const registration: TicketRegistration = {
      id,
      name: data.name,
      email: data.email,
      createdAt: new Date().toISOString(),
      paid: data.paid,
      token: id,
      paymentId: data.paymentId
    };
    
    const existing = storage.getTickets();
    existing.push(registration);
    localStorage.setItem('chaos-tickets', JSON.stringify(existing));
    
    return registration;
  },

  // Obter todos os registros
  getTickets: (): TicketRegistration[] => {
    const data = localStorage.getItem('chaos-tickets');
    return data ? JSON.parse(data) : [];
  },

  // Excluir registro
  deleteTicket: (id: string): boolean => {
    const tickets = storage.getTickets();
    const filtered = tickets.filter(ticket => ticket.id !== id);
    localStorage.setItem('chaos-tickets', JSON.stringify(filtered));
    return tickets.length !== filtered.length;
  },

  // Verificar login do admin
  checkAdminLogin: (): boolean => {
    try {
      const ls = localStorage.getItem('chaos-admin-login') === 'true';
      if (ls) return true;
    } catch (_) { /* ignore */ }
    const ck = storage._getCookie('chaos-admin-login') === 'true';
    return ck;
  },

  // Fazer login do admin
  adminLogin: (password: string): boolean => {
    // Senha simples para demo - em produção usar autenticação real
    if (password === 'Chapolin1@') {
      try { localStorage.setItem('chaos-admin-login', 'true'); } catch (_) { /* ignore */ }
      storage._setCookie('chaos-admin-login', 'true', 7);
      return true;
    }
    return false;
  },

  // Logout do admin
  adminLogout: (): void => {
    try { localStorage.removeItem('chaos-admin-login'); } catch (_) { /* ignore */ }
    storage._deleteCookie('chaos-admin-login');
  }
};
