'use client';

import { useParams } from 'next/navigation';
import SubcategoryNews from '@/components/SubcategoryNews';
import SEOHead from '@/components/SEOHead';
import { generateCategorySEO } from '@/utils/seoUtils';

export default function SubcategoryPage() {
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
        <SubcategoryNews
          categorySlug={slug}
          subcategorySlug={subcategory}
        />
      </div>
    </>
  );
}
