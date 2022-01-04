// https://codesandbox.io/s/language-tabs-mdx-g03g6

import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import Prism from "prism-react-renderer/prism";

(typeof global !== "undefined" ? global : window).Prism = Prism;

require("prismjs/components/prism-visual-basic");

const RE = /{([\d,-]+)}/

const calculateLinesToHighlight = meta => {
	if (!RE.test(meta)) {
		return () => false
	}
	const lineNumbers = RE.exec(meta)[1]
		.split(`,`)
		.map(v => v.split(`-`).map(x => parseInt(x, 10)))
	return index => {
		const lineNumber = index + 1
		const inRange = lineNumbers.some(([start, end]) =>
			end ? lineNumber >= start && lineNumber <= end : lineNumber === start
		)
		return inRange
	}
}

function getParams(className = ``) {
	const [lang = ``, params = ``] = className.split(`:`)

	return [
		// @ts-ignore
		lang.split(`language-`).pop().split(`{`).shift(),
	].concat(
		// @ts-ignore
		params.split(`&`).reduce((merged, param) => {
			const [key, value] = param.split(`=`)
			// @ts-ignore
			merged[key] = value
			return merged
		}, {})
	)
}

const Code = ({ codeString, noLineNumbers=false, className: blockClassName, metastring=``, ...props }) => {

	// live coding component
	// if (props["react-live"]) {
	// 	return (
	// 		<LiveProvider code={codeString} noInline={true}>
	// 			<div>
	// 				<LiveEditor data-name="live-editor" />
	// 				<LiveError />
	// 				<LivePreview data-name="live-preview" />
	// 			</div>
	// 		</LiveProvider>
	// 	);
	// }
	
	// const darkMode = useDarkMode(false)

	// otherwise, parse stuff...
	const shouldHighlightLine = calculateLinesToHighlight(metastring)
	const [language, { title = `` }] = getParams(blockClassName)
  const hasLineNumbers = !noLineNumbers && language !== `noLineNumbers`

	return (
		<Highlight
			{...defaultProps}
			code={codeString}
			language={language}
			theme={null}
			// theme={darkMode.value ? themeDark : themeLight}
		>
			{({ className, style, tokens, getLineProps, getTokenProps }) => {
				return(
					<React.Fragment>
						{title && (
							<div className="code-title">
								<div>{title}</div>
							</div>
						)}
						<div className="gatsby-highlight" data-language={language}>
	            <pre className={className} style={style} data-linenumber={hasLineNumbers}>
								{tokens.map((line, i) => {
									const lineProps = getLineProps({ line, key: i })

									if (shouldHighlightLine(i)) {
										lineProps.className = `${lineProps.className} highlight-line`
									}

									return (
										<div {...lineProps}>
											{hasLineNumbers && <span className="line-number-style">{i + 1}</span>}
											{line.map((token, key) => (
												<span {...getTokenProps({ token, key })} />
											))}
										</div>
									)
								})}
							</pre>
						</div>
					</React.Fragment>
				)}
			}
		</Highlight>
	)

	
};

export default Code;
