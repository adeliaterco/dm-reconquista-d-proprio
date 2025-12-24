// ========================================
// SISTEMA DE TRACKING GA4 VIA DATALAYER
// ========================================

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

class GA4Tracking {
  
  // ✅ Envia evento via dataLayer (GTM captura)
  private sendEvent(eventName: string, params?: Record<string, any>) {
    if (typeof window !== 'undefined') {
      // Inicializa dataLayer se não existir
      window.dataLayer = window.dataLayer || [];
      
      // Envia evento para dataLayer
      window.dataLayer.push({
        event: eventName,
        ...params
      });
      
      console.log(`📊 GA4 Event (via dataLayer): ${eventName}`, params);
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
      page: 'chat'
    });
  }

  questionAnswered(questionId: number, questionText: string, answer: string) {
    this.sendEvent('question_answered', {
      question_id: questionId,
      question_text: questionText,
      answer: answer,
      page: 'chat'
    });
  }

  chatCompleted() {
    this.sendEvent('chat_completed', {
      page: 'chat'
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
      page: 'resultado'
    });
  }

  videoStarted() {
    this.sendEvent('video_started', {
      video_name: 'VSL Plan Personalizado',
      page: 'resultado'
    });
  }

  offerRevealed() {
    this.sendEvent('offer_revealed', {
      page: 'resultado'
    });
  }

  offerViewed() {
    this.sendEvent('offer_viewed', {
      page: 'resultado'
    });
  }

  ctaBuyClicked(buttonLocation: string) {
    this.sendEvent('cta_buy_click', {
      button_id: buttonLocation,
      button_name: 'Comprar Ahora',
      page: 'resultado',
      value: 197 // Valor do produto
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
      page: 'resultado'
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