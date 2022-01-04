import React from "react"
import classNames from "classnames/bind"
import styles from "./styles.module.scss"

const cx = classNames.bind(styles);

function bar() {
  const headings = Array.from(document.querySelectorAll("#mdx-body h2,#mdx-body h3"))
  // console.log(headings)
  return(
    <React.Fragment>
    {
      headings.map((heading, i) => (
        <React.Fragment key={"heading-" + i}>
          <div className={cx(`toc${heading.tagName[1]}`)}>
            <a href={"#" + heading.id} aria-label="url" dangerouslySetInnerHTML={{__html: heading.innerHTML}} />
          </div>
        </React.Fragment>
      ))
    }
    </React.Fragment>
  )
}

function getCoords(elem) { // crossbrowser version
	const box = elem.getBoundingClientRect();
	const body = document.body;
	const docEl = document.documentElement;
	const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
	const clientTop = docEl.clientTop || body.clientTop || 0;
	const top = box.top +  scrollTop - clientTop;
	return Math.round(top);
}

export default function TableOfContent({ title }) {

  const [show, setShow] = React.useState(false);
  const refTOC = React.useRef(null)

  let headings = []
  let cutoffs = []
  let updateIntervalID

  const cutoffLength = 4

  function updateStuff() {
    headings = Array.from(document.querySelectorAll(".content,#mdx-body h2,#mdx-body h3"))
    cutoffs = headings.map(y => getCoords(y))
  }

  React.useEffect(() => {

    window.addEventListener('resize', function() {
      setTimeout(updateStuff, 500)
    })

    setTimeout(() => {
      updateStuff()
      if (headings.length < cutoffLength) {
        return
      }
      setShow(true)
      updateIntervalID = setInterval(updateStuff, 5000)
    }, 500)

    setInterval(() => {
      updateStuff()
      if (headings.length < cutoffLength) {
        return
      }
      setShow(true)
    }, 5000)

		setTimeout(() => {
      if (headings.length >= cutoffLength) {
        const toc = refTOC.current
        window.addEventListener('scroll', function() {
          const margin = 30
          let i = -1
          for (i = 0; i < cutoffs.length; i ++) {
            // if (window.pageYOffset + (window.innerHeight / 5) < cutoffs[i]) {
            if (window.pageYOffset < cutoffs[i] - margin) {
              i = Math.max(i - 1, 0)
              break
            }
          }
          for (let j = 0; j < toc.children.length; j ++) {
            toc.children[j].classList.remove(cx('yay'))
          }
          toc.children[Math.min(i, toc.children.length - 1)].classList.add(cx('yay'))
          const yayPos = toc.children[Math.min(i, toc.children.length - 1)].getBoundingClientRect()
          const tocPos = toc.getBoundingClientRect()
          if (yayPos.y < tocPos.y + margin) {
            toc.scrollBy(0, yayPos.y - tocPos.y - margin)
          }
          else if (yayPos.bottom + margin > tocPos.bottom) {
            toc.scrollBy(0, yayPos.bottom + margin - tocPos.bottom)
          }
        });
      }
    }, 1000)

    return () => {
      updateIntervalID && clearInterval(updateIntervalID)
    }
	}, [])

  if (show) {
    return(
      <div className={cx("toc")} id="toc" ref={refTOC}>
        <div className={cx("toc0", "yay")}>
          <a href="#top" aria-label="url">{title}</a>
        </div>
        {bar()}
      </div>
    )
  }
  else return null

}