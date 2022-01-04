const visit = require("unist-util-visit")
const fs = require(`fs`)
const Cite = require('citation-js')

function convertLink(str) {
	return str.replace(/(<div id=.*)(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*))(.*<a )/gm,
	`$1 <a href="$2" target="_blank" rel="nofollow noopener noreferrer">
		<span class="inline-svg"><svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
			<path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z" />
		</svg></span>
	</a>$4`.replace(/\r?\n|\r/g,""))
}

function addGoogleScholar(e) {
	const authorString = e.author.map(a => `${a.family}`).join('+')
	return `<a href="https://scholar.google.com/scholar?as_q=&as_epq=${e.title.replace(/ /g, '+')}&as_sauthors=${authorString}&as_yhi=${e.issued['date-parts'][0][0]}"
		target="_blank" rel="nofollow noopener noreferrer"
		title="Look up on Google Scholar">
			<span class="inline-svg"><svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
				<path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
			</svg></span>
		</a></div>`
}

module.exports = ({ markdownAST, markdownNode, getNode }, { components }) => {

	// add "published" for discussion papers
	if (markdownNode.frontmatter && 'published' in markdownNode.frontmatter) {
		const bibtex = Cite(markdownNode.frontmatter.published)
		let s = bibtex.format('bibliography', {
			format: 'html',
			template: 'citation-apa',
			append: addGoogleScholar,
		})
		markdownAST.children.push({
			type: 'blockquote',
			children: [
				{
					type: 'paragraph',
					children: [{
						type: "strong",
						children: [{
							type: "text",
							value: "Published Version"
						}]
					}]
				},
				{
					type: 'paragraph',
					children: [{
						type: 'html',
						value: convertLink(s),
					}]
				},
			],
		})
	}

	// for articles with bibliography
	if (markdownNode.frontmatter && 'bibliography' in markdownNode.frontmatter) {

		const debug = markdownNode.frontmatter.debug
		
		const bibtexFile = getNode(markdownNode.parent).dir + '/' + markdownNode.frontmatter.bibliography;
		const bibtexStr = fs.readFileSync(bibtexFile, `utf-8`);
		const bibtex = Cite(bibtexStr)
		const availableEntries = bibtex.data.map(e => e.id)

		let allEntries = new Set()
		
		// first process stuff in the brackets
		// linkReference refers to stuff in the square brackets
		visit(markdownAST, "linkReference", (node, index, parent) => {

			// regex to match bibtex references like @foo, @foo-2001 (need | to take care of one-letter refs)
			const regexRef = /(@(?:[a-zA-Z0-9_][a-zA-Z0-9_:.#$%&\-+?<>~\/]*[a-zA-Z0-9_]+|[a-zA-Z0-9_]+))/g

			const array = node.children[0].value.split(regexRef)

			let replacementNodes = []
			replacementNodes.push({type: 'text', value: '('})
			for (const item of array) {
				if (regexRef.test(item)) {
					const ref = item.substring(1)
					// first check if it's in the bib file
					if (availableEntries.includes(ref)) {
						allEntries.add(ref)
						let r = bibtex.format('citation', {
							format: 'html',
							template: 'citation-apa',
							entry: ref,
						})
						r = r.substring(1, r.length - 1).replace("&#38;", "&")
						replacementNodes.push({
							type: 'link',
							url: `#ref-${ref}`,
							children: [
								{
									type: 'text',
									value: r
								}
							]
						})
					}
					else {
						// not in bib file, so display as-is and show warning
						console.warn(`${item} not found in .bib file in ${getNode(markdownNode.parent).absolutePath}`)
						replacementNodes.push({type: 'text', value: item})
					}

				}
				else {
					replacementNodes.push({type: 'text', value: item})
				}
			}
			replacementNodes.push({type: 'text', value: ')'})

			parent.children.splice(index, 1, ...replacementNodes);

		})

		const regex = /((?:^|[ \t\(\[\{\<])(?:@)(?:[a-zA-Z0-9_][a-zA-Z0-9_:.#$%&\-+?<>~\/]*[a-zA-Z0-9_]+|[a-zA-Z0-9_]+))/m;
		const test = (node, n) => node.type === "text" && regex.test(node.value);

		// now process stuff out of brackets (in-text citation)
		visit(markdownAST, test, (node, index, parent) => {

			if (parent.type === "linkReference") {
				// this shouldn't happen, as these should have been caught earlier.
				return
			}
			else {
				const parts = node.value.split(regex)
				let replacementNodes = []
				for (let i = 0; i < parts.length; i ++) {
					if (regex.test(parts[i])) {
						const pre = parts[i][0] === '@' ? '' : parts[i][0]
						replacementNodes.push({type: 'text', value: pre})
						const entry = parts[i].substring(pre.length + 1)
						if (!availableEntries.includes(entry)) {
							console.warn(`${entry} not found in .bib file in ${getNode(markdownNode.parent).absolutePath}`)
							replacementNodes.push({type: 'text', value: entry})
						}
						else {
							allEntries.add(entry)
							let r = bibtex.format('citation', {
								format: 'html',
								template: 'citation-apa',
								entry: entry
							})
							r = r.replace(/\((.*)(, (\d{4}))\)/, (match, q1, q2, q3) => {
								return q1.replace("&#38;", "and") + ' (' + q3 + ')'
							})
							replacementNodes.push({
								type: 'link',
								url: `#ref-${entry}`,
								children: [
									{
										type: 'text',
										value: r
									}
								]
							})
						}
					}
					else {
						replacementNodes.push({type: 'text', value: parts[i]})
					}
				}
				parent.children.splice(index, 1, ...replacementNodes);
			}

		})

		// add end ref section
		if (allEntries.size > 0) {

			let s = bibtex.format('bibliography', {
				format: 'html',
				template: 'citation-apa',
				prepend: e => {
					return `<div id="ref-${e.id}">`
				},
				append: addGoogleScholar,
				entry: Array.from(allEntries),
			})

			markdownAST.children.push({
				type: 'heading',
				depth: 1,
				children: [
					{
						type: 'text',
						value: 'เอกสารอ้างอิง',
					}
				],
				data: {
					id: 'เอกสารอ้างอิง',
					htmlAttributes: {
						id: 'เอกสารอ้างอิง',
					},
					hProperties: {
						id: 'เอกสารอ้างอิง',
					},
				},
			})
			markdownAST.children.push({
				type: 'html',
				value: convertLink(s),
			})

		}

	}

	return markdownAST

}