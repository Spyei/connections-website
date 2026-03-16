/** @type {import("next").NextConfig} */

const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.discordapp.com",
				port: "",
				pathname: "/avatars/**",
			},
			{
				protocol: "https",
				hostname: "flagpedia.net",
				port: "",
				pathname: "/data/flags/w702/**",
			},
		],
	},

};

export default nextConfig;
