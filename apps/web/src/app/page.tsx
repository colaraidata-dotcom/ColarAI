import { Navbar } from '@/components/ui/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { ProfilesSection } from '@/components/sections/ProfilesSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { PlatformSection } from '@/components/sections/PlatformSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { TrustSection } from '@/components/sections/TrustSection';
import { CTASection } from '@/components/sections/CTASection';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <ProfilesSection />
        <FeaturesSection />
        <PlatformSection />
        <TrustSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
