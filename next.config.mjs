import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'raw.githubusercontent.com',
        protocol: 'https',
      },
    ],
    unoptimized: true,
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  outputFileTracingRoot: __dirname,
}
export default nextConfig
