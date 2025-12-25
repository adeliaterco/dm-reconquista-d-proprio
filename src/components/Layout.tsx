import { ReactNode, useEffect } from 'react';
import { useFacebookEvents } from '../hooks/useFacebookEvents';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  
  // ========================================
  // ✅ NOVA IMPLEMENTAÇÃO: CAPI via API Route
  // ========================================
  useFacebookEvents();
  
  useEffect(() => {
    // ========================================
    // ✅ GOOGLE TAG MANAGER (SERVER-SIDE)
    // ========================================
    const gtmId = 'GTM-T8M558NG';
    const serverUrl = 'https://gtm.reconquistaprp.online';
    
    // GTM Script (Head) - CARREGANDO VIA SERVIDOR
    const gtmScript = document.createElement('script');
    gtmScript.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      '${serverUrl}/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;
    document.head.appendChild(gtmScript);

    // ✅ CONFIGURAR TRANSPORT URL PARA ENVIO VIA SERVIDOR
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'transport_url': serverUrl
    });

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
          src="https://gtm.reconquistaprp.online/ns.html?id=GTM-T8M558NG"
          height="0" 
          width="0" 
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
      
      {children}
    </>
  );
}