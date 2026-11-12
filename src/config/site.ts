/** Public branding values are embedded by Vite at build time. Never put secrets here. */
const value = (key: string, fallback = "") =>
  String(import.meta.env[key] ?? fallback).trim();
const webUrl = (key: string) => {
  const raw = value(key);
  try {
    return ["https:", "http:"].includes(new URL(raw).protocol) ? raw : "";
  } catch {
    return "";
  }
};

export const site = {
  brand: value("VITE_SITE_BRAND", "ONE IP"),
  copyright: value("VITE_SITE_COPYRIGHT", "ONE IP"),
  repositoryUrl: webUrl("VITE_SITE_REPOSITORY_URL"),
  documentationUrl: webUrl("VITE_SITE_DOCUMENTATION_URL"),
  commercialUrl: webUrl("VITE_SITE_COMMERCIAL_URL"),
  contactEmail: value("VITE_SITE_CONTACT_EMAIL"),
  // A public image path (e.g. /contact/wechat.jpg) or an HTTPS URL.
  wechatQr: value("VITE_SITE_WECHAT_QR"),
};

export const siteMessages: Record<string, string> = Object.fromEntries(
  [
    ["navigation.siteTitle", value("VITE_SITE_TITLE")],
    ["navigation.siteDescription", value("VITE_SITE_DESCRIPTION")],
    ["home.overviewIpTools", value("VITE_HOME_TITLE")],
    ["home.networkOverview", value("VITE_HOME_HEADING")],
    ["policy.contactAuthor", value("VITE_SITE_CONTACT_LABEL")],
    ["contact.weChatRemarkHint", value("VITE_SITE_WECHAT_HINT")],
  ].filter(([, text]) => text),
);
