import React from 'react'
// import { LazyPlotly as LazyPlotlyComponent } from './Plotly.js'
// import { LazyHighcharts as LazyHighchartsComponent } from './Highcharts.js'
import { LazyChartjs as LazyChartjsComponent } from './Chartjs.js'
import chroma from 'chroma-js'

// test 2

import styles from '../../styles/_variables.module.scss'

export const defaultStyles = {
  colors: [
    styles.secondaryColor,
    styles.primaryColor,
    // '#1f77b4',  // muted blue
    // '#ff7f0e',  // safety orange
    '#2ca02c',  // cooked asparagus green
    '#d62728',  // brick red
    '#9467bd',  // muted purple
    '#8c564b',  // chestnut brown
    '#e377c2',  // raspberry yogurt pink
    '#7f7f7f',  // middle gray
    '#bcbd22',  // curry yellow-green
    '#17becf',  // blue-teal
  ],
  areaAlpha: 0.75,
  dimFactor: 0.4,
  font: {
    family: "Dindan",
    color: styles.textColor,
    size: 14,
  },
  title: {
    font: {
      size: 18,
    },
  },
  axisTitle: {
    font: {
      size: 16,
    },
  },
  tick: {
    font: {
      size: 14,
    },
  },
  tooltip: {
    font: {
      color: 'white',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  },
  paperColor: 'rgba(255, 255, 255, 0)',
  plotColor: 'rgba(255, 255, 255, 0)',
  gridlineColor: styles.gridlineColor,
  zerolineColor: styles.zerolineColor,
}

function convertSingleColor(c, multiplier=1) {
  return chroma(c).alpha(defaultStyles.areaAlpha * multiplier).hex()
}

export function getAreaColor(color, multiplier) {
  if (typeof color === "object")
    return color.map(x => convertSingleColor(x, multiplier))
  return convertSingleColor(color, multiplier)
}

// export function LazyPlotly(props) {
//   return(
//     <LazyPlotlyComponent
//       defaultStyles={defaultStyles}
//       {...props}
//     />
//   )
// }

export function LazyChartjs(props) {
  return(
    <LazyChartjsComponent
      defaultStyles={defaultStyles}
      {...props}
    />
  )
}

// export function LazyHighcharts(props) {
//   return(
//     <LazyHighchartsComponent
//       defaultStyles={defaultStyles}
//       {...props}
//     />
//   )
// }


// export * from './Plotly.js'
// export * from './Highcharts.js'
// export * from './Chartjs.js'