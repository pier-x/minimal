const Cite = require('citation-js')
const { createFilePath } = require("gatsby-source-filesystem")
const path = require('path')

exports.onCreateNode = ({ node, actions, getNode }) => {

  const { createNodeField, deleteNode } = actions

	if (node.internal.type === "Mdx") {
    createNodeField({
			node,
			name: "collection",
			value: getNode(node.parent).sourceInstanceName,
		})
		createNodeField({
			node,
			name: "slug",
			value: createFilePath({ node, getNode })
		})

  }

}


exports.createPages = async ({ graphql, actions, reporter }) => {

	const { createPage, createRedirect } = actions

	const defaultQuery = `
		query {
			allMdx(
				filter: {
					fields: {collection: {eq: "articles"}}
				}
			) {
				edges {
					node {
						id
						fields {
							slug
						}
						frontmatter {
							template
						}
					}
				}
			}
		}
	`

	const results = await graphql(defaultQuery)

	// publications

	results.data.allMdx.edges.forEach(({ node }) => {
		return createPage({
			path: node.fields.slug,
			component: path.resolve(`./src/templates/publication/index.js`),
			context: {
				id: node.id,
			},
		})
	})


}


exports.createSchemaCustomization = ({ actions: { createTypes, printTypeDefinitions } }) => {
  // printTypeDefinitions({path: './typeDefs.txt'})
  createTypes(`#graphql

		type MdxFrontmatter @derivedTypes @dontInfer {
			title: String!
			id: String
			excerptOverride: String
			oldId: Int
			oldSlug: String
			urlname: String
			subtitle: String
			authors: [String]
			discussants: [String]
			date: Date @dateformat
			updated: Date @dateformat
			yearX: Int
			topics: [String]
			tags: [String]
			lang: [String]
			series: String
			debug: Boolean

			featured: Boolean
			featuredTop: Boolean

			cover: File @fileByRelativePath
			hideCover: Boolean
			thumbnail: File @fileByRelativePath

			endLinks: [MdxFrontmatterEndLinks]		# {label, file} shown at bottom of body (before disclaimer)
			draft: Boolean
			skipIndex: Boolean

			header: String						# for pages only, shown in banner

			"""
			Publication-specific fields
			"""
			layout: String						# set to onecol to disable side panel
			fullText: String
			jel: [String]
			length: Int								# length of the full-text PDF file in pages (excluding cover page)
			bibliography: String
			published: String


			"""
			Event-specific fields
			"""
			name: String							# folder name for conferences and workshops
			endDate: Date @dateformat
			location: String
			locationUrl: String				# link when clicked on location of the event
			liveUrl: String						# URL of live feed of the event, shown on the very top
			data: [String]						# YAML data for conference template
			notime: Boolean
			startTime: Int
			endTime: Int
			video: String							# video recording of the entire event, shown on the bottom
			program: String						# link to the program of the event, shown on top
			template: String					# template that would be used for that event
			showAuthors: Boolean			# used in case there are authors who write summary but we don't want to show their names in the main listing
			endNote: String						# [conference template only] show note at the end of the schedule, e.g. to indicate joint organizers, etc.
			showDisclaimer: Boolean		# for workshops and forums: show usual disclaimer underneath

			"""
			Member-specific fields
			"""
			memberid: String
			image: File @fileByRelativePath
			fields: [String]					# fields of expertise/research interest
			org: String								# the person's organization
			exclude: Boolean					# whether or not to exclude this person from PRN listing
			currentFellow: Boolean		# whether the person is currently visiting PIER
			firstVisit: Int						# year that this person first visited PIER (for sorting purpose)
			jobTitle: String					# required only for PIER staff
			jobTitleValue: Float			# x.y format, where x = {9: researcher, 8: analyst, 7: support} and y = {4: จนท., 5: จนช., 6: ผบ., 7: ผบส., 8: ผอ., 9: ผอส., 99: advisor}
			email: String
			website: String
			facebook: String
			linkedin: String
			github: String
			twitter: String
			prnOfficer: Boolean				# not used since we don't have PRN now
		}
		
		type MdxFrontmatterEndLinks {
			icon: String
			label: String
			link: String
		}

  `)
}