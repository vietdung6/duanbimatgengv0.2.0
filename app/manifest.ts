import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gen.G Fandom",
    short_name: "Gen.G Fandom",
    description:
      "The ultimate fan destination for Gen.G Esports League of Legends team. Stats, news, and community.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#000000",
    theme_color: "#FFD700",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

