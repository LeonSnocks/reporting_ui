const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fix for Cursor worktree path resolution issues
  experimental: {
    outputFileTracingRoot: path.join(__dirname),
  },
  webpack: (config, { isServer }) => {
    // Force webpack to resolve from the actual workspace directory
    const workspaceRoot = path.resolve(__dirname);
    config.resolve.modules = [
      path.join(workspaceRoot, 'node_modules'),
      'node_modules',
    ];
    // Ensure we're using the workspace node_modules, not worktree
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
}

module.exports = nextConfig

