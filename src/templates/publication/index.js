import React from "react"
import { graphql } from "gatsby"
import Layout from "../../components/Layout"
import LayoutPub from "../../components/LayoutPub"

export default function PageTemplate({ data: { mdx } }) {

	return (
		<Layout
			mdx={mdx}
		>
			<LayoutPub
				frontmatter={mdx.frontmatter}
				body={mdx.body}
				authors={mdx.authors}
			/>
		</Layout>
	)

}

export const pageQuery = graphql`
	query PublicationQuery($id: String) {
		mdx(id: { eq: $id }) {
			body
			frontmatter {
				title
				subtitle
				authors
				date
				updated
				cover {
					publicURL
					childImageSharp {
						gatsbyImageData(layout: FULL_WIDTH)
					}
				}
				hideCover
				bibliography
				topics
				tags
				layout
			}
		}
	}
`