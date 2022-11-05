/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
		domains: ["coinmarketcap.com", "s2.coinmarketcap.com", "ipfs.io", "gw.alipayobjects.com", "lh3.googleusercontent.com", "i.seadn.io"],
	}
};

module.exports = nextConfig
