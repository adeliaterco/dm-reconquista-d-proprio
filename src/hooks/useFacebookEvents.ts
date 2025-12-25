import { useEffect, useCallback } from 'react';

interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
}

interface FacebookEventParams {
  eventName: string;
  userData?: UserData;
  customData?: Record<string, any>;
}

// Função para pegar cookies do Facebook
const getFacebookCookies = () => {
  console.log('🔍 [DEBUG] getFacebookCookies chamada');
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const result = {
    fbp: cookies._fbp || null,
    fbc: cookies._fbc || null,
  };
  
  console.log('🔍 [DEBUG] Cookies encontrados:', result);
  return result;
};

export const useFacebookEvents = () => {
  console.log('🔍 [DEBUG] useFacebookEvents hook iniciado');
  
  // Enviar evento para a API
  const trackEvent = useCallback(async ({ eventName, userData = {}, customData = {} }: FacebookEventParams) => {
    console.log(`🔍 [DEBUG] trackEvent chamado para: ${eventName}`);
    
    try {
      const { fbp, fbc } = getFacebookCookies();
      
      const payload = {
        event_name: eventName,
        event_id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_data: {
          ...userData,
          fbp,
          fbc,
        },
        custom_data: customData,
        event_source_url: window.location.href,
      };
      
      console.log('🔍 [DEBUG] Payload preparado:', payload);
      console.log('🔍 [DEBUG] Fazendo fetch para /api/facebook-capi');
      
      const response = await fetch('/api/facebook-capi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('🔍 [DEBUG] Response status:', response.status);
      
      const data = await response.json();
      
      console.log('🔍 [DEBUG] Response data:', data);

      if (data.success) {
        console.log(`✅ [CAPI] ${eventName} enviado:`, data.event_id);
      } else {
        console.error(`❌ [CAPI] Erro ${eventName}:`, data);
      }

      return data;
    } catch (error) {
      console.error(`❌ [CAPI] Erro requisição ${eventName}:`, error);
      return { success: false, error };
    }
  }, []);

  // Enviar PageView automaticamente quando o componente montar
  useEffect(() => {
    console.log('🔍 [DEBUG] useEffect executado - vai enviar PageView');
    trackEvent({ eventName: 'PageView' });
  }, [trackEvent]);

  console.log('🔍 [DEBUG] useFacebookEvents hook retornando funções');

  return {
    trackPageView: () => trackEvent({ eventName: 'PageView' }),
    trackViewContent: (customData?: Record<string, any>) => 
      trackEvent({ eventName: 'ViewContent', customData }),
    trackAddToCart: (customData?: Record<string, any>) => 
      trackEvent({ eventName: 'AddToCart', customData }),
    trackLead: (userData?: UserData, customData?: Record<string, any>) => 
      trackEvent({ eventName: 'Lead', userData, customData }),
    trackCustomEvent: (eventName: string, userData?: UserData, customData?: Record<string, any>) =>
      trackEvent({ eventName, userData, customData }),
  };
};