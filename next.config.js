// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
module.exports = withBundleAnalyzer({
  images: {
    domains: ['images.unsplash.com', 's3.us-west-2.amazonaws.com'],
    minimumCacheTTL: 60
  }
})
