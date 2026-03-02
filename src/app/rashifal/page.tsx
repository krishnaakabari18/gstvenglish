import RashifalPage from "./RashifalClient";
import { RASHIFAL_PAGE } from "@/constants/gujaratiStrings";

export const metadata = {
  title: "12 Zodiac Signs (Rashi) - Traits, Horoscope & Astrology Info | GSTV News",
  description: RASHIFAL_PAGE.META_DESCRIPTION,
  keywords: [
    RASHIFAL_PAGE.META_KEYWORDS,
    "daily rashifal",
    "today rashifal",
    "gujarati rashifal",
    "rashifal in gujarati",
    "zodiac prediction"
  ],
  openGraph: {
    title: "12 Zodiac Signs (Rashi) - Traits, Horoscope & Astrology Info | GSTV News",
    description: RASHIFAL_PAGE.META_DESCRIPTION,
    url: "https://english.gstv.in/rashifal",
    siteName: "GSTV",
    type: "website",
    images: [
      {
        url: "https://english.gstv.in/public/assets/images/gstv-logo.png",
        width: 1200,
        height: 630,
        alt: RASHIFAL_PAGE.OG_ALT
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "12 Zodiac Signs (Rashi) - Traits, Horoscope & Astrology Info | GSTV News",
    description: RASHIFAL_PAGE.META_DESCRIPTION,
    images: ["https://english.gstv.in/public/assets/images/gstv-logo.png"],
  },
  alternates: {
    canonical: "https://english.gstv.in/rashifal",
  },
};

export default function Page() {
  return <RashifalPage />;
}
