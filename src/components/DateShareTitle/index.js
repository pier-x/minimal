import React from "react"

import classNames from "classnames/bind"
import styles from "./styles.module.scss"

function formatDate(date, lang="th") {
  return new Date(date).toLocaleDateString(lang, {day: 'numeric', month: 'long', year: 'numeric'})
}

function formatFrontmatterDate(f, lang="th") {
  
  let data = new Date(f.date)
  let endDate = new Date(f.endDate)
  let updated = new Date(f.updated)

  let str = formatDate(data, lang)
  if (updated && data.valueOf() < updated.valueOf()) {
    str += ` (ปรับปรุงล่าสุด ${formatDate(updated)})`
  }
  else if (endDate && data.valueOf() < endDate.valueOf()) {
    if (data.getMonth() === endDate.getMonth() && data.getFullYear() === endDate.getFullYear()) {
      str = `${new Date(data).toLocaleDateString(lang, {day: 'numeric'})}–${formatDate(endDate, lang)}`
    }
    else if (data.getFullYear() === endDate.getFullYear()) {
      str = `${new Date(data).toLocaleDateString(lang, {day: 'numeric', month: 'long'})} – ${formatDate(endDate, lang)}`
    }
    else {
      str = `${formatDate(data, lang)} – ${formatDate(endDate, lang)}`
    }
  }
  return str
}

export default function DateShareTitle({ frontmatter, date, title, subtitle }) {

	const cx = classNames.bind(styles);

	date = date || frontmatter.date
	title = title || frontmatter.title
	subtitle = subtitle || frontmatter.subtitle || frontmatter.location

	return(
		<div className={cx("datesharetitle")}>
			<div className={cx("top")}>
				<div className="date" data-typesense-field="date_formatted">
					{frontmatter && (date === frontmatter.date) ? formatFrontmatterDate(frontmatter) : date}
				</div>
				{frontmatter && frontmatter.date && <span hidden data-typesense-field="year">{frontmatter.date.substring(0, 4)}</span>}
				{frontmatter && frontmatter.date && <span hidden data-typesense-field="date">{Date.parse(frontmatter.date)}</span>}
				{frontmatter && frontmatter.updated && <span hidden data-typesense-field="updated">{Date.parse(frontmatter.updated)}</span>}
			</div>
			<h1 className={cx("title")} data-typesense-field="title">{title}</h1>
			{subtitle &&
				<div className={cx("title", "subtitle")}>
					{subtitle}
				</div>
			}
		</div>
	)

}