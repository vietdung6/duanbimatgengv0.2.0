"use client";

interface VideoEmbedProps {
  url: string;
  showControls?: boolean;
}

export default function VideoEmbed({ url, showControls = false }: VideoEmbedProps) {
  const getEmbedUrl = (inputUrl: string) => {
    try {
      if (inputUrl.includes("youtube.com") || inputUrl.includes("youtu.be")) {
        let videoId = "";
        if (inputUrl.includes("youtu.be")) {
          videoId = inputUrl.split("/").pop() || "";
        } else {
          const urlParams = new URLSearchParams(new URL(inputUrl).search);
          videoId = urlParams.get("v") || "";
        }
        
        const controlsParam = showControls ? "1" : "0";
        const showInfoParam = showControls ? "1" : "0";
        // iv_load_policy=3 disables video annotations
        
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&controls=${controlsParam}&showinfo=${showInfoParam}&iv_load_policy=3`;
      }
      
      if (inputUrl.includes("twitch.tv")) {
        const channel = inputUrl.split("/").pop();
        // Use window.location.hostname only if available (client-side)
        const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
        const controlsParam = showControls ? "true" : "false";
        return `https://player.twitch.tv/?channel=${channel}&parent=${hostname}&controls=${controlsParam}`;
      }

      return inputUrl;
    } catch {
      return inputUrl;
    }
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <iframe
      src={embedUrl}
      className="w-full h-full"
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  );
}
