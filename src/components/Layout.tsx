import { ReactNode, useEffect } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  
  useEffect(() => {
    // ========================================
    // 🚀 SERVER-SIDE TRACKING INTERCEPTOR
    // ⚠️ DEVE VIR ANTES DO GTM!
    // ========================================
    const serverUrl = 'https://gtm.reconquistaprp.online';
    
    // Intercepta fetch (GA4 usa isso)
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      let url = args[0];
      
      if (typeof url === 'string' && url.includes('google-analytics.com')) {
        args[0] = url.replace(/https?:\/\/(www\.)?google-analytics\.com/g, serverUrl);
        console.log('✅ [CAPI] Evento redirecionado para servidor:', args[0]);
      }
      
      return originalFetch.apply(this, args);
    };
    
    // Intercepta sendBeacon (usado ao sair da página)
    const originalBeacon = navigator.sendBeacon;
    navigator.sendBeacon = function(url, data) {
      if (typeof url === 'string' && url.includes('google-analytics.com')) {
        url = url.replace(/https?:\/\/(www\.)?google-analytics\.com/g, serverUrl);
        console.log('✅ [CAPI] Beacon redirecionado para servidor:', url);
      }
      return originalBeacon.call(navigator, url, data);
    };
    
    console.log('🚀 [CAPI] Server-Side Tracking ativo:', serverUrl);

    // ========================================
    // ✅ GOOGLE TAG MANAGER
    // ========================================
    const gtmId = 'GTM-T8M558NG';
    
    // GTM Script (Head)
    const gtmScript = document.createElement('script');
    gtmScript.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;
    document.head.appendChild(gtmScript);

    // ========================================
    // ✅ UTMIFY PIXEL
    // ========================================
    window.pixelId = "683e4507be02a8b1bece6041";
    const utmifyPixelScript = document.createElement("script");
    utmifyPixelScript.setAttribute("async", "");
    utmifyPixelScript.setAttribute("defer", "");
    utmifyPixelScript.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
    document.head.appendChild(utmifyPixelScript);

    // ========================================
    // ✅ UTMIFY UTM TRACKER
    // ========================================
    const utmifyUtmScript = document.createElement("script");
    utmifyUtmScript.setAttribute("src", "https://cdn.utmify.com.br/scripts/utms/latest.js");
    utmifyUtmScript.setAttribute("data-utmify-prevent-subids", "");
    utmifyUtmScript.setAttribute("async", "");
    utmifyUtmScript.setAttribute("defer", "");
    document.head.appendChild(utmifyUtmScript);

  }, []);

  return (
    <>
      {/* GTM NoScript (fallback) */}
      <noscript>
        <iframe 
          src="https://www.googletagmanager.com/ns.html?id=GTM-T8M558NG"
          height="0" 
          width="0" 
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
      
      {/* ✅ Renderiza os componentes filhos (Chat, Result, etc) */}
      {children}
    </>
  );
}