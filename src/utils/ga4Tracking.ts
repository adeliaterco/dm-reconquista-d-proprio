// ========================================
// SISTEMA DE TRACKING GA4 + FACEBOOK CAPI
// ========================================

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

class GA4Tracking {
  
  // ========================================
  // FUNÇÕES AUXILIARES PARA FACEBOOK CAPI
  // ========================================
  
  /**
   * Gera event_id único para deduplicação Facebook
   */
  private generateEventId(eventName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${eventName}_${timestamp}_${random}`;
  }

  /**
   * Captura cookies do Facebook (fbp e fbc)
   */
  private getFacebookCookies() {
    if (typeof document === 'undefined') return { fbp: null, fbc: null };
    
    const cookies = document.cookie.split(';');
    
    const fbp = cookies
      .find(c => c.trim().startsWith('_fbp='))
      ?.split('=')[1] || null;
    
    const fbc = cookies
      .find(c => c.trim().startsWith('_fbc='))
      ?.split('=')[1] || null;
    
    return { fbp, fbc };
  }

  // ========================================
  // MÉTODO PRINCIPAL DE ENVIO
  // ========================================
  
  /**
   * Envia evento via dataLayer (GTM captura)
   * Agora com event_id e cookies Facebook
   */
  private sendEvent(eventName: string, params?: Record<string, any>) {
    if (typeof window !== 'undefined') {
      // Gera event_id único
      const eventId = this.generateEventId(eventName);
      
      // Captura cookies Facebook
      const { fbp, fbc } = this.getFacebookCookies();
      
      // Inicializa dataLayer se não existir
      window.dataLayer = window.dataLayer || [];
      
      // Envia evento para dataLayer com dados extras
      window.dataLayer.push({
        event: eventName,
        event_id: eventId,
        event_time: Math.floor(Date.now() / 1000),
        fbp: fbp,
        fbc: fbc,
        ...params
      });
      
      console.log(`📊 GA4 Event (via dataLayer): ${eventName}`, {
        event_id: eventId,
        fbp: fbp ? '✅' : '❌',
        fbc: fbc ? '✅' : '❌',
        ...params
      });
    }
  }

  // ========================================
  // LANDING PAGE
  // ========================================

  landingPageView() {
    this.sendEvent('page_view_gamificado', {
      page: 'landing',
      page_title: 'Landing Page',
      page_location: typeof window !== 'undefined' ? window.location.href : '',
      page_path: '/'
    });
  }

  landingCTAClick() {
    this.sendEvent('cta_click', {
      button_id: 'landing_primary',
      button_name: 'Iniciar Análisis',
      page: 'landing'
    });
  }

  // ========================================
  // CHAT
  // ========================================

  chatPageView() {
    this.sendEvent('page_view_gamificado', {
      page: 'chat',
      page_title: 'Chat Analysis',
      page_location: typeof window !== 'undefined' ? window.location.href : '',
      page_path: '/chat'
    });
  }

  chatStarted() {
    this.sendEvent('chat_started', {
      page: 'chat',
      content_name: 'Quiz Iniciado',
      content_category: 'Quiz'
    });
  }

  questionAnswered(questionId: number, questionText: string, answer: string) {
    this.sendEvent('question_answered', {
      question_id: questionId,
      question_text: questionText,
      answer: answer,
      page: 'chat',
      content_name: `Pergunta ${questionId}`,
      content_category: 'Quiz'
    });
  }

  chatCompleted() {
    this.sendEvent('chat_completed', {
      page: 'chat',
      content_name: 'Quiz Completo',
      content_category: 'Quiz'
    });
  }

  chatCTAClick() {
    this.sendEvent('cta_click', {
      button_id: 'chat_complete',
      button_name: 'Ver Mi Plan Personalizado',
      page: 'chat'
    });
  }

  // ========================================
  // RESULTADO
  // ========================================

  resultPageView() {
    this.sendEvent('page_view_gamificado', {
      page: 'resultado',
      page_title: 'Result Page',
      page_location: typeof window !== 'undefined' ? window.location.href : '',
      page_path: '/resultado'
    });
  }

  revelationViewed(revelationName: string) {
    this.sendEvent('revelation_viewed', {
      revelation_type: revelationName,
      page: 'resultado',
      content_name: `Revelação: ${revelationName}`,
      content_category: 'Resultado'
    });
  }

  videoStarted() {
    this.sendEvent('video_started', {
      video_name: 'VSL Plan Personalizado',
      page: 'resultado',
      content_name: 'VSL Iniciado',
      content_category: 'Video'
    });
  }

  offerRevealed() {
    this.sendEvent('offer_revealed', {
      page: 'resultado',
      content_name: 'Oferta Revelada - Quiz PRP',
      content_category: 'Oferta',
      currency: 'BRL',
      value: 0
    });
  }

  offerViewed() {
    this.sendEvent('offer_viewed', {
      page: 'resultado',
      content_name: 'Oferta Visualizada',
      content_category: 'Oferta'
    });
  }

  ctaBuyClicked(buttonLocation: string) {
    this.sendEvent('cta_buy_click', {
      button_id: buttonLocation,
      button_name: 'Comprar Ahora',
      page: 'resultado',
      content_name: 'Clique Botão Compra - Quiz PRP',
      content_category: 'Checkout',
      currency: 'BRL',
      value: 197
    });
  }

  // ========================================
  // CONVERSÃO (PURCHASE)
  // ========================================
  // NOTA: Este evento será disparado via webhook (UTM + GTM Server)
  // Mantemos aqui apenas para referência/testes

  purchase(transactionId: string, value: number, currency: string = 'BRL') {
    this.sendEvent('purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: [{
        item_id: 'reconquista-21-dias',
        item_name: 'Plan de Reconquista 21 Días',
        item_category: 'Digital Product',
        price: value,
        quantity: 1
      }]
    });
  }

  // ========================================
  // PROGRESSÃO DE FASES
  // ========================================

  phaseProgressionClicked(phaseFrom: number, phaseTo: number, timeSpent: number) {
    this.sendEvent('phase_progression_clicked', {
      phase_from: phaseFrom,
      phase_to: phaseTo,
      time_spent_seconds: Math.round(timeSpent / 1000),
      page: 'resultado',
      content_name: `Progressão Fase ${phaseFrom} → ${phaseTo}`,
      content_category: 'Navegação'
    });
  }

  offerSectionReached(pathTaken: string, totalTimeSpent: number) {
    this.sendEvent('offer_section_reached', {
      path_taken: pathTaken,
      total_time_spent_seconds: Math.round(totalTimeSpent / 1000),
      page: 'resultado'
    });
  }

  finalCtaImpression(ctaPosition: string, visibilityTime: number) {
    this.sendEvent('final_cta_impression', {
      cta_position: ctaPosition,
      visibility_time_seconds: Math.round(visibilityTime / 1000),
      page: 'resultado'
    });
  }
}

// ✅ Exporta instância única
export const ga4Tracking = new GA4Tracking();