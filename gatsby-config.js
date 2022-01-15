module.exports = {
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "PIER Minimal",
  },
  plugins: [
    {
		  resolve: `gatsby-plugin-sass`,
		  options: {
				cssLoaderOptions: {
					esModule: false,
					modules: {
						namedExport: false,
					},
				},
			},
		},
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "articles",
        path: "./content/",
      },
    },
		`gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: ['.mdx', '.md'],
        gatsbyRemarkPlugins: [
					{
						resolve: require.resolve("./plugins/gatsby-remark-caption")
					},
					{
						resolve: `gatsby-remark-autolink-headers`,
						options: {
							// className: `anchor`,
							// enableCustomId: true,
							// icon: `<svg aria-hidden="true" height="20" version="1.1" viewBox="0 0 16 16" width="20"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`,
						},
					},
					{
						resolve: `gatsby-remark-images`,
						options: {
							maxWidth: 960,
							quality: 80,
							// linkImagesToOriginal: false,
							backgroundColor: `none`,
							disableBgImageOnAlpha: true,
						},
					},
					// {
					// 	resolve: `gatsby-remark-katex`,
					// 	options: {
					// 		// Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
					// 		strict: `ignore`
					// 	}
					// },
					`gatsby-remark-copy-linked-files`,
					{
						resolve: require.resolve("./plugins/gatsby-remark-citation")
					},
				],
        remarkPlugins: [
					[require("remark-admonitions"), {
						customTypes: {
							excerpt: {
								emoji: 'O',
								svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" /></svg>'
							}
						}
					}],
					require("remark-external-links"),
					require('remark-math'),
					require('remark-html-katex'),
				],
      }
    },
		`gatsby-transformer-sharp`,
		`gatsby-plugin-sharp`,
  ],
};
