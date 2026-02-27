

'use client';

import { useParams } from 'next/navigation';
import CategoryNews from '@/components/CategoryNews';
import SEOHead from '@/components/SEOHead';
import { generateCategorySEO } from '@/utils/seoUtils';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const subcategory = params?.subcategory as string;

  // Generate SEO data for subcategory page
  const seoData = generateCategorySEO(slug, subcategory);

  return (
    <>
      {/* SEO Meta Tags */}
      <SEOHead seoData={seoData} pageType="website" />

      <div className="subcategory-page">
        <CategoryNews
          categorySlug={slug}
        />
      </div>
    </>
  );
}
