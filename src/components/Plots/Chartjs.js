// https://janosh.dev/blog/gatsby-interactive-plots

import React from 'react'
import Loadable from 'react-loadable'
import { merge } from 'lodash'
import chroma from 'chroma-js'

import styles from '../../styles/_variables.module.scss'

const LoadChartjs = Loadable.Map({
	loader: {
		Chartjs: () => import(`react-chartjs-2`),
		annotationPlugin: () => import('chartjs-plugin-annotation'),
	},
	render(loaded, {defaultStyles, ...rest }) {

		let Chart = loaded.Chartjs.Chart
		let defaults = loaded.Chartjs.defaults
		let ChartComponent = loaded.Chartjs.default

		merge(defaults, {
			color: defaultStyles.font.color,
			backgroundColor: defaultStyles.colors.map(color => chroma(color).alpha(defaultStyles.areaAlpha).hex()),
			borderColor: defaultStyles.colors,
			font: {
				family: defaultStyles.font.family,
				size: defaultStyles.font.size,
			},
			layout: {
				padding: 20,
			},
			scale: {
				grid: {
					color: defaultStyles.gridlineColor,
					borderColor: defaultStyles.zerolineColor,
				}
			},
			plugins: {
				title: {
					font: {
						size: defaultStyles.title?.font?.size || defaultStyles.font.size,
					}
				},
				legend: {
					position: 'bottom',
				},
			}
		})

		Chart.register(loaded.annotationPlugin.default)
		Chart.register({
			id: 'texts',
			beforeDraw: (chart, args, options) => {
				const ctx = chart.canvas.getContext('2d');
				ctx.save();
				ctx.globalCompositeOperation = 'destination-over'
				ctx.font = styles.baseSize + styles.baseFont
				ctx.fillStyle = styles.textColor
				if (options.texts) {
					const textObjects = JSON.parse(JSON.stringify(options.texts))
					Object.values(textObjects).forEach(t => {
						ctx.fillText(t.text, t.x, t.y)
					})
				}
				ctx.restore();
			}
		})
		return <ChartComponent {...rest} />
	},
	loading: ({ timedOut }) =>
		timedOut ? (
			<blockquote>Error: Loading Chart.js timed out.</blockquote>
		) : (
			<div>Loading...</div>
		),
	timeout: 30000,
})

export const LazyChartjs = ( {defaultStyles, style={}, ...rest} ) => {

	return (
		<div className="center chartjs-wrapper" style={{...style}}>
			<LoadChartjs
				defaultStyles={defaultStyles}
				{...rest}
			/>
		</div>
	)

}