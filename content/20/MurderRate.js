import React from 'react'
import { LazyChartjs, defaultStyles } from '../../src/components/Plots'

export default function MurderRate() {

  return(
    <LazyChartjs
      type="line"
      style={{minHeight: "400px"}}
      data={{
        labels: [...Array(18).keys()].map(x => (x + 2000).toString()),
        datasets: [
          {
            data: [4.820000, 4.665700, 5.312503, 5.016756, 5.534846, 4.823599, 4.965448, 4.235205, 4.622827, 4.406904, 3.885449, 4.191943, 4.028716, 4.487747, 4.017712, 4.636289, 4.753885, 4.658000],
            label: "กลุ่มทดลอง (รัฐที่ทำให้กัญชาถูกกฎหมาย)",
            tension: 0.4,
            borderWidth: 3,
            borderColor: defaultStyles.colors[0],
            backgroundColor: defaultStyles.colors[0],
          },
          {
            data: [4.675000, 4.756709, 5.116628, 5.054749, 5.380851, 4.886338, 4.764352, 4.325752, 4.476759, 4.429035, 3.939538, 3.890219, 4.549734, 4.330000, 4.025272, 4.536355, 5.201604, 5.655000],
            label: "กลุ่มควบคุม (รัฐที่ไม่มีการเปลี่ยนนโยบาย)",
            tension: 0.4,
            borderWidth: 3,
            borderColor: defaultStyles.colors[1],
            backgroundColor: defaultStyles.colors[1],
          },
        ]
      }}
      options={{
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        radius: 0,
        scales: {
          y: {
            title: {
              display: true,
              text: "อัตราฆาตกรรม (%)"
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              pointStyle: 'line',
              usePointStyle: true,
            }
          },
          annotation: {
            annotations: {
              a: {
                type: 'line',
                xMin: "2014",
                xMax: "2014",
                drawTime: "afterDatasetsDraw",
                borderDash: [2, 2],
              },
            },
          },
        }
      }}
    />
  )


}