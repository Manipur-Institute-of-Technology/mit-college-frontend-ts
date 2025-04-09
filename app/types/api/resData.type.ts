export type NoticeData = {
  href: string;
  linkText: string;
  publishedDate: string;
  urgency: "high" | "medium" | "low";
};

export type AccountInfo = {
  name: string;
  email: string;
  imageURL: string;
};

export type ImageCarouselData = {
  id: number;
  title: string;
  description: string;
  imageURL: string;
  createdAt: string;
};

export type NavbarData = {
  navbarTitle: string;
  logoURL: string;
  menus: {
    name: string;
    href: string;
    target?: string;
    childrens?: {
      name: string;
      href: string;
      target?: string;
    }[];
  }[];
};

export type Weather = {
  latitude: number;
  longitude: number;
  elevation: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    precipitation: string;
    weather_code: string;
    wind_speed_10m: string;
    wind_direction_10m: string;
  };
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
};

export type FooterData = {
  logo: string;
  contactInfo: {
    location: {
      address: string;
      pinCode: string;
      country: string;
      state: string;
      district: string;
    };
    phone: string;
    email: string;
    webAddress: string;
  };
  socialMedia: Array<{ platform: string; url: string }>;
  copyright: string;
  links: Array<{
    listHeader: string;
    lists: Array<{ linkText: string; href: string }>;
  }>;
};
