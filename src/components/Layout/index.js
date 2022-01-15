import React from "react"
import { use100vh } from "react-div-100vh"
import { MDXProvider } from "@mdx-js/react"
import Link from "gatsby"
import Code from "../Code"
import { preToCodeBlock } from "mdx-utils"

import styles from '../../styles/_variables.module.scss'

import "./styles.scss"

const mdxComponents = {
  pre: preProps => {
		const props = preToCodeBlock(preProps)
		let mode = ""
		if (typeof document !== 'undefined')
			mode = document.body.className
		if (props) {
			return <Code {...props} mode={mode} />
		} else {
			return <pre {...preProps} mode={mode} />
		}
	},
  blockquote: props => {
    return(
      <div {...props} className="admonition">
        <div className="admonition-content noheader">
          {props.children}
        </div>
      </div>
    )
  },
  a: ({href, children, ...rest}) => {
    if (href[0] !== '/' || /(\.(.)?.{3})$/.test(href))
      return <a href={href} {...rest}>{children}</a>
    return <Link to={href} {...rest}>{children}</Link>
  },
  h1: props => <div><div className="anchor-t" id={props.id} /><h2 {...props}>{props.children}</h2></div>,
  h2: props => <div><div className="anchor-t" id={props.id} /><h3 {...props}>{props.children}</h3></div>,
  h3: props => <div><div className="anchor-t" id={props.id} /><h4 {...props}>{props.children}</h4></div>,
  h4: props => <div><div className="anchor-t" id={props.id} /><h5 {...props}>{props.children}</h5></div>,
  h5: props => <div><div className="anchor-t" id={props.id} /><h6 {...props}>{props.children}</h6></div>,
  h6: props => <div><div className="anchor-t" id={props.id} /><h6 {...props}>{props.children}</h6></div>,
}

export default function Layout({
	children,
}) {

	let components = {
		...mdxComponents,
		Link,
	}

	const height = use100vh()
  const fullHeight = height || '100vh'

  React.useEffect(() => {
  	if (typeof window !== 'undefined') {
			
			document.body.style.position = '';
			document.body.style.top = '';
			document.documentElement.classList.remove("sidenav-on")

			require('smooth-scroll')('a[href*="#"]', {
				speed: 500,
				speedAsDuration: false,
				durationMax: 1000,
			});

			window.onbeforeprint = function () {
				const imageList = document.getElementsByTagName("img")
				for (const image of imageList) {
					image.removeAttribute("loading")
				}
			}


		}
  }, [])

	return (
		<React.Fragment>
			<div id="main" style={{minHeight: fullHeight}}>
				<div id="menu-leek">
					<div id="body">
						<MDXProvider components={components}>
							<div className="layout-content" id="layout-content">
								<div className="flex-padding">
									<div className="content">
										{children}
									</div>
								</div>
							</div>
						</MDXProvider>
					</div>
				</div>
			</div>
		</React.Fragment>
  );
}
