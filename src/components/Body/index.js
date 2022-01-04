import React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { GatsbyImage } from "gatsby-plugin-image"
import { Link } from "gatsby"

import classNames from "classnames/bind"
import styles from "./styles.module.scss"


export default function Body({ title, cover, hideCover, body, children, topics, tags }) {
	
	const cx = classNames.bind(styles);

	return(
		<div className={cx("body")}>
			{cover && 
				<div className={cx("cover")}>
					{!hideCover && <GatsbyImage image={cover.childImageSharp.gatsbyImageData} alt={title || "ภาพประกอบ"} loading="eager" />}
				</div>
			}
			{body &&
				<div id="mdx-body"><MDXRenderer>{body}</MDXRenderer></div>
			}
			{children}
			<div className={cx("endmatter")}>
				<div className={cx("section")}>
					<em>
						ข้อคิดเห็นที่ปรากฏในบทความนี้เป็นความเห็นของผู้เขียน ซึ่งไม่จำเป็นต้องสอดคล้องกับความเห็นของสถาบันวิจัยเศรษฐกิจป๋วย <span className="nobreak">อึ๊งภากรณ์</span>
					</em>
				</div>
				{topics && topics.length > 0 && // TODO: hanging indent
					<div className={cx("section")}>
						<span className={cx("right-margin", "header")}>Topics: </span>
						{topics.map((topic, i) =>
							<Link to={`https://www.pier.or.th/search/?topics=${topic}`} key={`topic${i}`}>
								<span className="blob" data-typesense-field="topics">{topic.toLowerCase()}</span>
							</Link>
						)}
					</div>
				}
				{tags && tags.length > 0 &&
					<div className={cx("section")}>
						<span className={cx("right-margin", "header")}>Tags: </span>
						{tags.map((tag, i) =>
							<Link to={`https://www.pier.or.th/search/?tags=${tag}`} key={`tag${i}`}>
								<span className="blob" data-typesense-field="tags">{tag.toLowerCase()}</span>
							</Link>
						)}
					</div>
				}
			</div>
		</div>
	)

}