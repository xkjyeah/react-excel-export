/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Disable server-side rendering for all pages
  webpack(config) {
    // Find the TypeScript rule and modify it to exclude raw imports

    // This is a heuristic to ensure that we don't
    // see the transpiled JSX. The JSX transpilation rules
    // are nested deeply, so it's easier to just apply this
    // exclusion to all rules.
    config.module.rules.forEach(rule => {
      if (!rule.resourceQuery) {
        rule.resourceQuery = { not: [/raw/] };
      }
    });

    // Add rule for ?raw resource query to use asset/source
    config.module.rules.push({
      resourceQuery: /raw/,
      type: 'asset/source',
    });
    return config;
  },
};
module.exports = nextConfig;
