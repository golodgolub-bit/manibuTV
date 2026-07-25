export interface Channel {
  id: string;
  name: string;
  logo: string;
  url: string; // m3u8 stream URL
  category: string;
  countryCode: string; // e.g. "RU", "US", "FR", "JP", "GB", "DE"
  countryName: string;
  timezone: string; // e.g. "Europe/Moscow", "America/New_York", "Asia/Tokyo"
  city: string; // e.g. "Москва", "New York", "Tokyo"
  language: string; // e.g. "Russian", "English", "Japanese"
  isHD?: boolean;
  quality?: string; // e.g. "1080p", "720p"
  description?: string;
  isCustom?: boolean;
}

export interface CountryInfo {
  code: string;
  nameRu: string;
  nameEn: string;
  flag: string;
  capital: string;
  timezone: string;
  region: string;
}

export interface CategoryInfo {
  id: string;
  nameRu: string;
  nameEn: string;
  icon: string;
}

export interface StreamQuality {
  index: number;
  height: number;
  bandwidth: number;
  label: string;
}
