// хук изменяет ответ config/toggles

export interface Toggles {
  minVersionCode: number;
  lastVersionCode: number;
  whatsNew: string;
  downloadLink: string;
  minGPVersionCode: number;
  lastGPVersionCode: number;
  gpWhatsNew: string;
  gpDownloadLink: string;
  overrideGPVersion: boolean;
  inAppUpdates: boolean;
  inAppUpdatesImmediate: boolean;
  inAppUpdatesFlexibleDelay: number;
  impMessageEnabled: boolean;
  impMessageText: string;
  impMessageBackgroundColor: string;
  impMessageTextColor: string;
  impMessageLink: string;
  adBannerBlockId: string;
  adBannerSizeType: number;
  adInterstitialBlockId: string;
  adBannerDelay: number;
  adInterstitialDelay: number;
  kodikVideoLinksUrl: string;
  kodikIframeAd: boolean;
  sibnetRandUserAgent: boolean;
  sibnetUserAgent: string;
  torlookUrl: string;
  baseUrl: string;
  apiUrl: string;
  apiAltUrl: string;
  apiAltAvailable: boolean;
  iframeEmbedUrl: string;
  kodikAdIframeUrl: string;
  sponsorshipPromotion: boolean;
  sponsorshipText: string;
  sponsorshipAvailable: boolean;
  pageNoConnectionUrl: string;
  snowfall: boolean;
  searchBarIconUrl: string;
  searchBarIconTint: string;
  searchBarIconAction: string;
  searchBarIconValue: string;
  min_blog_create_rating_score: number;
}

export function match(path: string): boolean {
  if (path == "/config/toggles") return true;
  return false;
}

export async function get(data: Toggles, url: URL) {
  data.lastVersionCode = 25062200;

  data.impMessageEnabled = true;
  data.impMessageText = "разработчик AniX / Api-Prox-Service";
  data.impMessageLink = "https://wah.su/radiquum";
  data.impMessageBackgroundColor = "ffb3d0";
  data.impMessageTextColor = "ffffff";

  data.apiAltAvailable = false;
  data.apiAltUrl = "";

  data.sponsorshipAvailable = false;
  data.sponsorshipPromotion = false;
  data.kodikIframeAd = false;
  data.kodikAdIframeUrl = "";

  if (process.env.HOST_URL) {
    data.iframeEmbedUrl = `${process.env.HOST_URL}/player?url=`;
  }

  return data;
}
