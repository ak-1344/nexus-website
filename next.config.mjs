/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [process.env.NEXT_PUBLIC_SUPABASE_PROJECT + '.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_PROJECT: process.env.NEXT_PUBLIC_SUPABASE_PROJECT,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three', 'framer-motion'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig