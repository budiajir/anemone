export const ADMIN_WHATSAPP_NUMBER = "628569044778";

/**
 * Returns universal WhatsApp URL that works on mobile app and WhatsApp web
 */
export function getWhatsAppUrl(text = "", phone = ADMIN_WHATSAPP_NUMBER) {
  const cleanPhone = String(phone).replace(/\D/g, "");
  const encodedText = encodeURIComponent(text);
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
}

/**
 * Reliably opens WhatsApp across Mobile (iOS/Android) and Desktop browsers
 * without triggering browser popup blockers
 */
export function openWhatsAppChat(text = "", phone = ADMIN_WHATSAPP_NUMBER) {
  const url = getWhatsAppUrl(text, phone);

  if (typeof window === "undefined") return;

  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  if (isMobile) {
    // Direct location assignment opens WhatsApp native app immediately
    window.location.href = url;
  } else {
    // On desktop, try opening new tab
    const win = window.open(url, "_blank", "noopener,noreferrer");
    // Fallback if popup blocker intercepted
    if (!win || win.closed || typeof win.closed === "undefined") {
      window.location.href = url;
    }
  }
}
