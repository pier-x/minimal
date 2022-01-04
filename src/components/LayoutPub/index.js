import React from "react"
import DateShareTitle from "../DateShareTitle"
import Body from "../Body"
import TableOfContent from "../TableOfContent"

import classNames from "classnames/bind"
import styles from "./styles.module.scss"

export default function LayoutPub({
	frontmatter,
	collection,
	date=frontmatter.date,
	title=frontmatter.title,
	subtitle=frontmatter.subtitle,
	cover=frontmatter.cover,
	topics=frontmatter.topics,
	tags=frontmatter.tags,
	layout=frontmatter.layout,
	hideCover=frontmatter.hideCover,
	body, children,
}) {

	const cx = classNames.bind(styles);

	const onecol = layout === "onecol"
	

	return (
		<React.Fragment>
			<DateShareTitle
				frontmatter={frontmatter}
				date={date}
				title={title}
				subtitle={subtitle}
			/>
			<div className={cx("grid", {onecol: onecol})}>
				<Body
					title={title}
					cover={cover}
					hideCover={hideCover}
					body={body}
					children={children}
					topics={topics}
					tags={tags}
				/>
				<div className={cx("sidebar")}>
					{!onecol && <TableOfContent title={title} />}
				</div>
			</div>
		</React.Fragment>
	)

}