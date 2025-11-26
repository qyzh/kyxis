"use client";
import { PixelatedCanvas } from "../components/ui/pixelated-canvas";

export function PhotoProfile() {
  return (
    <div className="grayscale-50">
      <PixelatedCanvas
        src="https://avatars.githubusercontent.com/u/4543282?v=4"
        width={240}
        height={240}
        cellSize={4}
        dotScale={1}
        shape="square"
        backgroundColor="#0a0a0a"
        dropoutStrength={0.4}
        interactive
        distortionStrength={3}
        distortionRadius={80}
        distortionMode="swirl"
        followSpeed={0.2}
        jitterStrength={4}
        jitterSpeed={4}
        sampleAverage
        tintColor="#FFFFFF"
        tintStrength={0.2}
      />
    </div>
  );
}
