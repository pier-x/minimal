import React from 'react'
import { LazyChartjs, defaultStyles } from '../../src/components/Plots'

export default function Diff() {

  const [showA, setShowA] = React.useState(false)
  const [showB, setShowB] = React.useState(false)
  const [showC, setShowC] = React.useState(false)

  function handleEnter(str) {
    if (str === "a") {
      setShowA(true)
    }
    else if (str === "b") {
      setShowB(true)
    }
    else if (str === "c") {
      setShowC(true)
    }
  }

  function handleLeave(str) {
    if (str === "a") {
      setShowA(false)
    }
    else if (str === "b") {
      setShowB(false)
    }
    else if (str === "c") {
      setShowC(false)
    }
  }

  return(
    <div>
      <LazyChartjs
        type="line"
        style={{minHeight: "300px"}}
        height={100}
        id="xxx"
        data={{
          labels: ["ก.พ. 1992", "พ.ย. 1992"],
          datasets: [
            {
              data: [23.33, 21.17],
              label: "Pennsylvania (กลุ่มควบคุม)",
              borderColor: defaultStyles.colors[1],
              backgroundColor: defaultStyles.colors[1],
              borderWidth: 4,
            },
            {
              data: [20.44, 21.03],
              label: "New Jersey (กลุ่มทดลอง)",
              borderColor: defaultStyles.colors[0],
              backgroundColor: defaultStyles.colors[0],
              borderWidth: 4,
            },
            {
              data: [20.44, 18.28],
              label: "New Jersey หากไม่ขึ้นค่าแรงขั้นต่ำ",
              borderColor: 'rgba(0, 0, 0, 0.3)',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderWidth: 1.5,
              borderDash: [5, 5],
            },
          ]
        }}
        options={{
          maintainAspectRatio: false,
          interaction: {
            // intersect: false,
            mode: 'point',
          },
          scales: {
            x: {
              offset: true,
            },
            y: {
              title: {
                display: true,
                text: "ระดับการจ้างงาน (FTE)"
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                pointStyle: 'line',
                usePointStyle: true,
              },
            },
            annotation: {
              annotations: {
                diff: {
                  type: 'line',
                  xMin: 'พ.ย. 1992',
                  xMax: 'พ.ย. 1992',
                  yMin: 18.28,
                  yMax: 21.03,
                  label: {
                    content: "ผลของการปรับค่าแรงขั้นต่ำ",
                    enabled: true,
                    font: {
                      style: "normal",
                    },
                    backgroundColor: showC ? defaultStyles.colors[4] : 'rgba(0, 0, 0, 0.8)',
                  },
                  borderColor: showC ? defaultStyles.colors[4] : 'rgba(0, 0, 0, 0.8)',
                },
                lineA: {
                  type: 'line',
                  xMin: 'ก.พ. 1992',
                  xMax: 'ก.พ. 1992',
                  yMin: 20.44,
                  yMax: 23.33,
                  label: {
                    content: "−2.89",
                    enabled: true,
                    font: {
                      style: "normal",
                    },
                    backgroundColor: defaultStyles.colors[2],
                  },
                  display: showA,
                  borderColor: defaultStyles.colors[2],
                },
                lineB: {
                  type: 'line',
                  xMin: 'พ.ย. 1992',
                  xMax: 'พ.ย. 1992',
                  yMin: 21.03,
                  yMax: 21.17,
                  label: {
                    content: "−0.14",
                    enabled: true,
                    font: {
                      style: "normal",
                    },
                    backgroundColor: defaultStyles.colors[3],
                    xAdjust: 30,
                  },
                  display: showB,
                  borderColor: defaultStyles.colors[3],
                }
              },
            },
          }
        }}
      />
      <div className="table-wrapper">
        <table data-typesense-field="body">
          <thead>
            <tr>
              <th />
              <th>PA</th>
              <th>NJ</th>
              <th>Diff</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ก.พ. 1992</td>
              <td>23.33</td>
              <td>20.44</td>
              <td
                style={{
                  fontWeight: 'bold',
                  backgroundColor: showA ? defaultStyles.colors[2] : "rgba(0, 0, 0, 0)",
                  color: showA ? "white" : "unset",
                }}
                onMouseEnter={() => handleEnter("a")}
                onMouseLeave={() => handleLeave("a")}
              >
                −2.89
              </td>
            </tr>
            <tr>
              <td>พ.ย. 1992</td>
              <td>21.17</td>
              <td>21.03</td>
              <td
                style={{
                  fontWeight: 'bold',
                  backgroundColor: showB ? defaultStyles.colors[3] : "rgba(0, 0, 0, 0)",
                  color: showB ? "white" : "unset",
                }}
                onMouseEnter={() => handleEnter("b")}
                onMouseLeave={() => handleLeave("b")}
              >
                −0.14
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr style={{fontWeight: 'bold'}}>
              <td>Diff</td>
              <td>−2.16</td>
              <td>0.59</td>
              <td
                style={{
                  fontWeight: 'bold',
                  backgroundColor: showC ? defaultStyles.colors[4] : "rgba(0, 0, 0, 0)",
                  color: showC ? "white" : "unset",
                }}
                onMouseEnter={() => handleEnter("c")}
                onMouseLeave={() => handleLeave("c")}
              >
                2.75
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )


}