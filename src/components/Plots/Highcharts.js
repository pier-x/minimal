// https://janosh.dev/blog/gatsby-interactive-plots

import React from 'react'
import Loadable from 'react-loadable'
import Highcharts from 'highcharts'
import { cloneDeep, merge } from 'lodash'

const LoadHighcharts = Loadable.Map({
	loader: {
		HighchartsReact: () => import(`highcharts-react-official`),
		Highcharts: () => import('highcharts'),
		highchartsData: () => import("highcharts/modules/data"),
		highchartsMap: () => import("highcharts/modules/map"),
		highchartsAccessibility: () => import("highcharts/modules/accessibility"),
		highchartsBoost: () => import("highcharts/modules/boost"),
	},
	render(loaded, props) {
		let Highcharts = loaded.Highcharts.default
		let HighchartsReact = loaded.HighchartsReact.default
		if (typeof Highcharts !== 'object')
			return null
		loaded.highchartsData.default(Highcharts)
		loaded.highchartsMap.default(Highcharts)
		loaded.highchartsAccessibility.default(Highcharts)
		loaded.highchartsBoost.default(Highcharts)
		return <HighchartsReact {...props} />
	},
	loading: ({ timedOut }) =>
		timedOut ? (
			<blockquote>Error: Loading Highcharts timed out.</blockquote>
		) : (
			<div>Loading...</div>
		),
		timeout: 30000,
})

export const LazyHighcharts = ({ defaultStyles, constructorType, options, refID }) => {

	// const buttonTheme = {
	// 	stroke: `rgba(0, 0, 0, 0)`,
	// 	r: 5,
	// 	fill: styles.gridline,
	// 	style: {
	// 		// color set in main.scss
	// 	},
	// 	states: {
	// 		hover: {
	// 			fill: colors.zeroline,
	// 		}
	// 	}
	// }

  const defAxisOptions = {
    gridLineColor: defaultStyles.gridlineColor,
    lineColor: defaultStyles.zerolineColor,
    tickColor: defaultStyles.zerolineColor,
    labels: {
      style: {
				fontFamily: defaultStyles.tick?.font?.family || defaultStyles.font.family,
				fontSize: `${defaultStyles.tick?.font?.size || defaultStyles.font.size}px`,
				color: defaultStyles.tick?.font?.color || defaultStyles.font.color,
			},
    },
    title: {
      style: {
				fontFamily: defaultStyles.axisTitle?.font?.family || defaultStyles.font.family,
				fontSize: `${defaultStyles.axisTitle?.font?.size || defaultStyles.font.size}px`,
				color: defaultStyles.axisTitle?.font?.color || defaultStyles.font.color,
			},
    },
  }

	const defOptions = {
		chart: {
			backgroundColor: defaultStyles.plotColor,
			type: 'spline',
			resetZoomButton: {
				// theme: buttonTheme
			},
		},
		mapNavigation: {
			buttonOptions: {
				// theme: buttonTheme,
			},
		},
		colors: defaultStyles.colors,
		xAxis: cloneDeep(defAxisOptions),
		yAxis: cloneDeep(defAxisOptions),
		title: {
			text: '',
			style: {
				fontFamily: defaultStyles.title?.font?.family || defaultStyles.font.family,
				fontSize: `${defaultStyles.title?.font?.size || defaultStyles.font.size}px`,
				color: defaultStyles.title?.font?.color || defaultStyles.font.color,
			}
		},
		legend: {
			itemStyle: {
				fontFamily: defaultStyles.legend?.font?.family || defaultStyles.font.family,
				fontSize: `${defaultStyles.legend?.font?.size || defaultStyles.font.size}px`,
				color: defaultStyles.legend?.font?.color || defaultStyles.font.color,
				// fontWeight: `normal`
			},
			// itemHoverStyle: {
			// 	color: styles.textColor
			// }
		},
		tooltip: {
			backgroundColor: defaultStyles.tooltip?.font?.backgroundColor,
			borderWidth: 0,
			shadow: false,
			borderRadius: 5,
			style: {
				// fontFamily: defaultStyles.tooltip?.font?.family || defaultStyles.font.family,
				fontSize: `${defaultStyles.tooltip?.font?.size || defaultStyles.font.size}px`,
				color: defaultStyles.tooltip?.font?.color || defaultStyles.font.color,
			},
			xDateFormat: '%Y-%m-%d',
		}
	};

	Highcharts.dateFormats = {
		q: function (timestamp) {
			const date = new Date(timestamp)
			return (Math.floor(date.getUTCMonth() / 3) + 1);
		}
	};

	// const defSimpleTimeSeries = {
	// 	chart: {
	// 		zoomType: 'x',
	// 	},
	// 	series: [
	// 		{
	// 			type: 'line',
	// 			data: data,
	// 			name: 'ปริมาณธนบัตรที่หมุนเวียนในระบบเศรษฐกิจ',
	// 			tooltip: {
	// 				pointFormat: '{point.y} ล้านบาท',
	// 				xDateFormat: '%Y.%m',
	// 			},
	// 		},
	// 	],
	// 	plotOptions: {
	// 		series: {
	// 			pointStart: Date.UTC(1997, 0, 1),
	// 			pointIntervalUnit: 'month',
	// 			pointInterval: 1,
	// 		}
	// 	},
	// 	xAxis: {
	// 		type: 'datetime',
	// 	},
	// 	yAxis: {
	// 		title: {
	// 			text: 'ล้านบาท',
	// 		},
	// 	},
	// 	title: {
	// 		text: 'ปริมาณธนบัตรที่หมุนเวียนในระบบเศรษฐกิจ'
	// 	},
	// 	legend: {
	// 		enabled: false,
	// 	},
	// }

	return(
		<div className="highcharts-wrapper" style={{display: "grid"}}>
			<LoadHighcharts
				highcharts={Highcharts}
				constructorType={constructorType}
				options={merge(defOptions, options)}
				// containerProps={{ style: { width: "100%" } }}
				ref={refID}
			/>
		</div>
	)

}