import { ReactNode, useEffect } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  
  useEffect(() => {
    // ========================================
    // ✅ GOOGLE TAG MANAGER (SERVER-SIDE)
    // ========================================
    const gtmId = 'GTM-T8M558NG';
    const serverUrl = 'https://gtm.reconquistaprp.online';
    
    // Inicializar dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // GTM Script
    const gtmScript = document.createElement('script');
    gtmScript.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      '${serverUrl}/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;
    document.head.appendChild(gtmScript);

  }, []);

  return (
    <>
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