import React from "react"
import { StaticImage } from "gatsby-plugin-image"

import classNames from "classnames/bind"
import styles from "./styles.module.scss"

function dontBreak(str) {
  return str.split(' ').map((x, i) => <React.Fragment key={i}><span className="nobreak">{x}</span> </React.Fragment>)
}

export default function Author({ flexible, typesenseField, name, indexThis=true }) {
	
	const cx = classNames.bind(styles);

	return(
		<div className={cx("card", {"flexible": flexible})}>
			<StaticImage
				src="../../images/user.png"
				alt={name}
				layout="constrained"
				width={200}
				height={200}
			/>
			<div className={cx("details")}>
				<div className={cx("name")} {...(indexThis && {'data-typesense-field': typesenseField})}>{dontBreak(name)}</div>
			</div>
		</div>
	)

}