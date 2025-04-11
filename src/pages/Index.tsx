
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import HeroSection from '@/components/home/HeroSection';
import Categories from '@/components/Categories';
import FeaturesSection from '@/components/home/FeaturesSection';
import ItemsSection from '@/components/home/ItemsSection';
import CallToAction from '@/components/home/CallToAction';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import SmartRecommendations from '@/components/home/SmartRecommendations';

const Index = () => {
  return (
    <PageLayout>
      <HeroSection />
      <Categories />
      <SmartRecommendations />
      <ItemsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CallToAction />
    </PageLayout>
  );
};

export default Index;
