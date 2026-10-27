/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Fotos de recibo tiradas pelo celular podem ter vários MB
    serverActions: { bodySizeLimit: "15mb" },
  },
};

export default nextConfig;
