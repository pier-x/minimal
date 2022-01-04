module.exports = {
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "PIER Minimal",
  },
  plugins: [
    "gatsby-plugin-sass",
    "gatsby-plugin-mdx",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
  ],
};
