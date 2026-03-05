"use client";

import { Download, Monitor, Apple, Glasses } from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";

const downloads = [
  {
    platform: "Windows",
    icon: Monitor,
    description: "Windows 10/11 (64-bit)",
    url: "https://store.steampowered.com/app/2519830/Resonite/",
    badge: "Steam",
  },
  {
    platform: "Linux",
    icon: Monitor,
    description: "SteamOS / Linux (64-bit)",
    url: "https://store.steampowered.com/app/2519830/Resonite/",
    badge: "Steam",
  },
  {
    platform: "VR Headsets",
    icon: Glasses,
    description: "SteamVR, Oculus, Windows MR, Vive",
    url: "https://store.steampowered.com/app/2519830/Resonite/",
    badge: "Steam",
  },
];

export default function DownloadPage() {
  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div className="flex items-center gap-2">
        <Download className="h-6 w-6 text-accent" />
        <h1 className="font-heading text-2xl font-bold text-text-primary">
          Download Resonite
        </h1>
      </div>

      <p className="text-text-secondary">
        Resonite is available on Steam for Windows, Linux, and VR platforms.
      </p>

      <div className="grid gap-4">
        {downloads.map((dl) => (
          <Card key={dl.platform} hover className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <dl.icon className="h-7 w-7 text-primary-light" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-semibold text-text-primary">
                  {dl.platform}
                </h3>
                <Badge variant="accent">{dl.badge}</Badge>
              </div>
              <p className="text-sm text-text-muted">{dl.description}</p>
            </div>
            <a href={dl.url} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="sm">
                <Download className="h-4 w-4" />
                Get
              </Button>
            </a>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
          System Requirements
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="text-primary-light font-medium mb-2">Minimum</h4>
            <ul className="space-y-1 text-text-muted">
              <li>OS: Windows 10 / Linux</li>
              <li>CPU: Dual Core 2GHz+</li>
              <li>RAM: 8 GB</li>
              <li>GPU: DirectX 11 compatible</li>
              <li>Storage: 5 GB</li>
            </ul>
          </div>
          <div>
            <h4 className="text-accent-light font-medium mb-2">Recommended</h4>
            <ul className="space-y-1 text-text-muted">
              <li>OS: Windows 10/11 / Linux</li>
              <li>CPU: Quad Core 3GHz+</li>
              <li>RAM: 16 GB</li>
              <li>GPU: GTX 1070 / RX 580+</li>
              <li>Storage: 10 GB SSD</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
