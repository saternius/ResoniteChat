"use client";

import { GreetingHeader } from "@/components/dashboard/GreetingHeader";
import { FriendLocationsSection } from "@/components/dashboard/FriendLocationsSection";
import { DiscoverySection } from "@/components/dashboard/DiscoverySection";

export default function HomePage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <GreetingHeader />
      <FriendLocationsSection />
      <DiscoverySection />
    </div>
  );
}
