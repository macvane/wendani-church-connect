import { useEffect } from "react";

export default function WistiaEmbed() {
  useEffect(() => {
    // Load player.js
    const script1 = document.createElement("script");
    script1.src = "https://fast.wistia.com/player.js";
    script1.async = true;
    document.body.appendChild(script1);

    // Load the specific video embed
    const script2 = document.createElement("script");
    script2.src = "https://fast.wistia.com/embed/nj42vhdz6y.js";
    script2.type = "module";
    script2.async = true;
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  return (
    <div className="relative w-full h-full lg:max-w-[50%]   mx-auto">
  {/* Placeholder */}
  <div
    className="absolute inset-0 bg-center bg-contain blur-sm"
    style={{
      backgroundImage:
        "url('https://fast.wistia.com/embed/medias/nj42vhdz6y/swatch')",
    }}
  />

  {/* Player (keeps 16:9 aspect ratio) */}
  <wistia-player
    media-id="nj42vhdz6y"
  ></wistia-player>
</div>

  );
}
