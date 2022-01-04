// https://janosh.dev/blog/gatsby-interactive-plots

import React from 'react'
import Loadable from 'react-loadable'
import { cloneDeep, merge } from 'lodash'

const LoadPlotly = Loadable({
	loader: () => import(`react-plotly.js`),
	loading: ({ timedOut }) =>
		timedOut ? (
			<blockquote>Error: Loading Plotly timed out.</blockquote>
		) : (
			<div>Loading...</div>
		),
	timeout: 30000,
})

export const LazyPlotly = ( {defaultStyles, layout, style, config, ...rest} ) => {
	
	const axisDefaults = {
		gridcolor: defaultStyles.gridlineColor,
		zerolinecolor: defaultStyles.zerolineColor,
		title: {
			font: {
				family: defaultStyles.axisTitle?.font?.family || defaultStyles.font.family,
				size: defaultStyles.axisTitle?.font?.size || defaultStyles.font.size,
				color: defaultStyles.axisTitle?.font?.color || defaultStyles.font.color,
			},
		},
		tickfont: {
			family: defaultStyles.tick?.font?.family || defaultStyles.font.family,
			size: defaultStyles.tick?.font?.size || defaultStyles.font.size,
			color: defaultStyles.tick?.font?.color || defaultStyles.font.color,
		},
    automargin: true,
	}

	const defLayout = {
		colorway: defaultStyles.colors,
    margin: {
      l: 50,
      r: 50,
      t: 20,
      b: 50,
    },
		paper_bgcolor: defaultStyles.paperColor,
		plot_bgcolor: defaultStyles.plotColor,
		// autosize: true,
		title: {
			font: {
				family: defaultStyles.title?.font?.family || defaultStyles.font.family,
				size: defaultStyles.title?.font?.size || defaultStyles.font.size,
				color: defaultStyles.title?.font?.color || defaultStyles.font.color,
			},
			xref: 'paper',
			x: 0.5,
			xanchor: 'center',
		},
		font: {
			family: defaultStyles.font?.family,
			color: defaultStyles.font?.color,
		},
		xaxis: cloneDeep(axisDefaults),
		yaxis: cloneDeep(axisDefaults),
		xaxis2: cloneDeep(axisDefaults),
		xaxis3: cloneDeep(axisDefaults),
		xaxis4: cloneDeep(axisDefaults),
		yaxis2: cloneDeep(axisDefaults),
		yaxis3: cloneDeep(axisDefaults),
		yaxis4: cloneDeep(axisDefaults),
		hoverlabel: {
			font: {
				family: defaultStyles.tooltip?.font?.family || defaultStyles.font.family,
				size: defaultStyles.tooltip?.font?.size || defaultStyles.font.size,
				color: defaultStyles.tooltip?.font?.color || defaultStyles.font.color,
			},
			bordercolor: 'transparent',
		},
	}

	const defStyle = {
		width: `100%`,
	}
	const defConfig =  {
		displayModeBar: false,
		showTips: false,
		responsive: true,
	}

	// let finalLayout = merge(layout, defLayout)

	return (
		<LoadPlotly
			layout={merge(defLayout, layout)} ///processColors(cloneDeep(layout), colors))}
			style={{...merge(defStyle, style)}}
			config={{...merge(defConfig, config)}}
			{...rest}
			useResizeHandler
		/>
	)

}