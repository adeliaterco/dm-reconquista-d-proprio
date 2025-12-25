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
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return {
    fbp: cookies._fbp || null,
    fbc: cookies._fbc || null,
  };
};

export const useFacebookEvents = () => {
  // Enviar evento para a API
  const trackEvent = useCallback(async ({ eventName, userData = {}, customData = {} }: FacebookEventParams) => {
    try {
      const { fbp, fbc } = getFacebookCookies();
      
      const response = await fetch('/api/facebook-capi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_name: eventName,
          event_id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          user_data: {
            ...userData,
            fbp,
            fbc,
          },
          custom_data: customData,
          event_source_url: window.location.href,
        }),
      });

      const data = await response.json();

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
    trackEvent({ eventName: 'PageView' });
  }, [trackEvent]);

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