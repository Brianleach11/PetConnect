/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['cc2.cs.fiu.edu'],
    },
    env: {
        NEXTCLOUD_PETALBUM_URL: process.env.NEXTCLOUD_PETALBUM_URL,
    },
}

const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
    register: "true",
    skipWaiting: "true",
    disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA(nextConfig)