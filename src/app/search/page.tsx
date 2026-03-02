import { Metadata } from 'next';
import { Suspense } from 'react';
import SearchPage from '@/components/SearchPage';
import LoadingSpinner from '@/components/LoadingSpinner';
import { SEARCH_PAGE } from '@/constants/gujaratiStrings';

export const metadata: Metadata = {
  title: SEARCH_PAGE.TITLE,
  description: SEARCH_PAGE.DESCRIPTION,
  openGraph: {
    title: SEARCH_PAGE.TITLE,
    description: SEARCH_PAGE.DESCRIPTION,
    images: ['/images/gstv-logo-bg.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEARCH_PAGE.TITLE,
    description: SEARCH_PAGE.DESCRIPTION,
    images: ['/images/gstv-logo-bg.png'],
  },
};

export default function SearchPageRoute() {
  return (
    <>
      <SearchPage />
    </>
  );
}
