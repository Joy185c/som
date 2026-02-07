import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedWorks } from '@/components/home/FeaturedWorks';
import { ReviewsSlider } from '@/components/home/ReviewsSlider';
import { TeamHighlights } from '@/components/home/TeamHighlights';
import { CTASection } from '@/components/home/CTASection';
import { AwardsSection } from '@/components/home/AwardsSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedWorks />
      <ReviewsSlider />
      <TeamHighlights />
      <AwardsSection />
      <CTASection />
    </>
  );
}
