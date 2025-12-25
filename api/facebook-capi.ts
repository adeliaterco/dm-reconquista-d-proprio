import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  fbc?: string;
  fbp?: string;
}

interface CustomData {
  [key: string]: any;
}

interface RequestBody {
  event_name: string;
  event_id?: string;
  user_data?: UserData;
  custom_data?: CustomData;
  event_source_url?: string;
}

// Função para hash SHA256
const hashData = (data: string | undefined | null): string | null => {
  if (!data) return null;
  return crypto
    .createHash('sha256')
    .update(data.toLowerCase().trim())
    .digest('hex');
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      event_name,
      event_id,
      user_data = {},
      custom_data = {},
      event_source_url,
    }: RequestBody = req.body;

    // Validação básica
    if (!event_name) {
      return res.status(400).json({ error: 'event_name is required' });
    }

    // Gerar Event ID se não fornecido
    const finalEventId = event_id || `evt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    // Pegar IP real
    const clientIp = 
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      (req.headers['x-real-ip'] as string) ||
      '';

    // Montar payload para a Meta
    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id: finalEventId,
          event_source_url: event_source_url || req.headers.referer || '',
          action_source: 'website',
          user_data: {
            em: hashData(user_data.email),
            ph: hashData(user_data.phone),
            fn: hashData(user_data.firstName),
            client_ip_address: clientIp,
            client_user_agent: req.headers['user-agent'] || '',
            fbc: user_data.fbc || null,
            fbp: user_data.fbp || null,
          },
          custom_data,
        },
      ],
      access_token: process.env.META_CAPI_TOKEN,
    };

    // Log para debug
    console.log('📤 Enviando para Meta CAPI:', {
      event_name,
      event_id: finalEventId,
      has_fbp: !!user_data.fbp,
      client_ip: clientIp,
    });

    // Enviar para a Meta
    const response = await fetch(
      `https://graph.facebook.com/v21.0/559798737198143/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Erro Meta CAPI:', data);
      return res.status(response.status).json({ 
        error: 'Meta API error', 
        details: data 
      });
    }

    console.log('✅ Sucesso Meta CAPI:', data);

    return res.status(200).json({
      success: true,
      event_id: finalEventId,
      meta_response: data,
    });

  } catch (error) {
    console.error('❌ Erro interno:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}