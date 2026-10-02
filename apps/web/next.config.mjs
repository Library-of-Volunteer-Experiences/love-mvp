/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@love/ui', '@love/shared', '@love/config', '@love/backend', '@love/auth', '@love/validation', '@love/api-contracts'],
};

export default nextConfig;
