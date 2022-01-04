function processChildrenArray(children) {

  for (let i = 0; i < children.length; i ++) {

    let startIndex = -1
    let stopIndex = -1

    if (children[i].type === "admonitionHTML") {
      processChildrenArray(children[i].children[1].children)
    }

    if (children[i].type === "comment" && children[i].value && children[i].value.trim() === "fig") {
      i ++
      startIndex = i
      while (children[i].type !== "comment" && (!children[i].value || children[i].value.trim() !== "endfig")) {
        i ++
      }
      stopIndex = i - 1

      try {

        let imageIndex = startIndex
        let captionNode = null
        
        // replace everything in between

        if (children[startIndex].type === "list") {
          // with custom caption, so shift imageIndex by one
          imageIndex ++
          if (children[startIndex].children[0].children.length > 0)
            captionNode = children[startIndex].children[0].children[0].children
        }
        
        const endNode = children[stopIndex]

        let replacementNodes = []

        replacementNodes.push({
          type: 'jsx',
          value: `<div class="fig-container">`
        })

        // if (!noCaption && imageNode.alt) {
        //   if (!captionNode) {
        //     captionNode = [{
        //       type: 'text',
        //       value: imageNode.alt,
        //     }]
        //   }
        // }

        if (captionNode) {
          replacementNodes = replacementNodes.concat([
            {
              type: 'jsx',
              value: `<span class="fig-caption">`
            },
            ...captionNode,
            // ...listNode.children[0].children[0].children,
            {
              type: 'jsx',
              value: `</span>`
            },
          ])
        }          

        replacementNodes = replacementNodes.concat(children.slice(imageIndex, stopIndex))

        if (endNode.type === "list" && endNode.children) {
          replacementNodes.push({
            type: 'jsx',
            value: `<span class="fig-note-group">`
          })
          for (let j = 0; j < endNode.children.length; j ++) {
            replacementNodes = replacementNodes.concat([
              {
                type: 'jsx',
                value: `<span class="fig-note">`
              },
              ...endNode.children[j].children[0].children,
              {
                type: 'jsx',
                value: `</span>`
              },
            ])
          }
          replacementNodes.push({
            type: 'jsx',
            value: `</span>`
          })
        }
        else {
          replacementNodes.push(children[stopIndex])
        }

        replacementNodes.push({
          type: 'jsx',
          value: `</div>`
        })

        // remove stuff already parsed
        children.splice(startIndex, stopIndex + 1 - startIndex, ...replacementNodes)
      
      }
      catch(error) {
        console.warn(`Caption error at ${markdownNode.fileAbsolutePath}`)
        console.warn(error.message)
      }
      
      i = startIndex + 1

    }
  
  }

	return children

}


module.exports = ({ markdownAST, markdownNode, getNode }, { components }) => {

  // if (markdownNode.frontmatter.id !== "16x")
  //   return

  processChildrenArray(markdownAST.children)
  
}
