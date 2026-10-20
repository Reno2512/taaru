import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Taaru · Atelier de couture",
    short_name: "Taaru",
    description: "Clients, mesures, commandes et acomptes de l'atelier, dans le téléphone.",
    lang: "fr",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f5f6fa",
    theme_color: "#2c3a8c",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
