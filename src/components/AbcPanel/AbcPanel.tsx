import { css } from '@emotion/css';
import React, { useMemo, useState } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions } from '../../types';
import UplotReact from 'uplot-react';
import {
  VizLayout,
} from '@grafana/ui';
import uPlot from 'uplot';
import Select, { ActionMeta, InputActionMeta, OnChangeValue } from 'react-select'
import { unstable_batchedUpdates } from 'react-dom';

/**
 * Properties
 */
interface Props extends PanelProps<PanelOptions> { }

// function tooltipPlugin(opts) {
//   let over, bound, bLeft, bTop;

//   function syncBounds() {
//     let bbox = over.getBoundingClientRect();
//     bLeft = bbox.left;
//     bTop = bbox.top;
//   }

//   const overlay = document.createElement("div");
//   overlay.id = "overlay";
//   overlay.style.display = "none";
//   overlay.style.position = "absolute";
//   document.body.appendChild(overlay);

//   return {
//     hooks: {
//       init: u => {
//         over = u.over;

//         bound = over;
//       //	bound = document.body;

//         over.onmouseenter = () => {
//           overlay.style.display = "block";
//         };

//         over.onmouseleave = () => {
//           overlay.style.display = "none";
//         };
//       },
//       setSize: u => {
//         syncBounds();
//       },
//       setCursor: u => {
//         const { left, top, idx } = u.cursor;
//         const x = u.data[0][idx];
//         const y = u.data[1][idx];
//         const anchor = { left: left + bLeft, top: top + bTop };
//         overlay.textContent = `${x},${y} at ${Math.round(left)},${Math.round(top)}`;
//         placement(overlay, anchor, "right", "start", { bound });
//       }
//     }
//   };
// }

/**
 * Panel
 */
export const AbcPanel: React.FC<Props> = ({ options, data, width, height }) => {
  data.series[0].fields[0].values = [...new Array(data.series[0].length)].map((_, i) => i)
  // console.log(data.series)
  // const getData = () => data.series; // Need to update with proper data from database

  // const renderLegend = () => {
  //   const items: VizLegendItem[] = [];
  //   items.push({
  //     label: 'selva',
  //     color: 'red',
  //     yAxis: 100

  //   })

  //   const legendStyle = {
  //     flexStart: css`
  //       div {
  //         justify-content: flex-start !important;
  //       }
  //     `,
  //   };

  //   return (
  //     <VizLayout.Legend placement='bottom' width={width}>
  //       <VizLegend
  //         className={legendStyle.flexStart}
  //         placement='bottom'
  //         items={items}
  //         displayMode={LegendDisplayMode.Table}
  //       />
  //     </VizLayout.Legend>
  //   );
  // };
















  let series = [
    {
      label: data.series[0].fields[0].name,
      // value: (u: any, v: any) => v == null ? "-" : v+"s",
    },
    {
      label: data.series[0].fields[1].name + (Math.random() + 1).toString(36).substring(7),
      values: (u, sidx, idx) => {
        if (idx == null)
          return {
            x: '--',
            Min: Number(Math.min(...data.series[sidx - 1].fields[1].values)).toExponential(4),
            Max: Number(Math.min(...data.series[sidx - 1].fields[1].values)).toExponential(4),
            Mean: Number(Math.min(...data.series[sidx - 1].fields[1].values)).toExponential(4),
            Sdev: Number(Math.min(...data.series[sidx - 1].fields[1].values)).toExponential(4),
            Value: '--'
          };
        return {
          x: data.series[0].fields[0].values[idx],
          Min: Number(Math.min(...data.series[sidx - 1].fields[1].values)).toExponential(4),
          Max: Number(Math.min(...data.series[sidx - 1].fields[1].values)).toExponential(4),
          Mean: Number(Math.min(...data.series[sidx - 1].fields[1].values)).toExponential(4),
          Sdev: Number(Math.min(...data.series[sidx - 1].fields[1].values)).toExponential(4),
          Value: Number(data.series[sidx - 1].fields[1].values[idx]).toExponential(4)
        };
      },
      stroke: "red",
    },
    {
      label: data.series[1].fields[1].name + (Math.random() + 1).toString(36).substring(7),
      values: (u, sidx, idx) => {
        if (idx == null)
          return {
            x: '--',
            Min: Number(Math.min(...data.series[sidx - 1].fields[1].values)).toExponential(4),
            Max: Number(Math.min(...data.series[sidx - 1].fields[1].values)).toExponential(4),
            Mean: Number(Math.min(...data.series[sidx - 1].fields[1].values)).toExponential(4),
            Sdev: Number(Math.min(...data.series[sidx - 1].fields[1].values)).toExponential(4),
            Value: '--'
          };
        return {
          x: data.series[0].fields[0].values[idx],
          Min: Number(Math.min(...data.series[sidx - 1].fields[1].values)).toExponential(4),
          Max: Number(Math.min(...data.series[sidx - 1].fields[1].values)).toExponential(4),
          Mean: Number(Math.min(...data.series[sidx - 1].fields[1].values)).toExponential(4),
          Sdev: Number(Math.min(...data.series[sidx - 1].fields[1].values)).toExponential(4),
          Value: Number(data.series[sidx - 1].fields[1].values[idx]).toExponential(4)
        };
      },
      stroke: "blue",
      // show: false
    },
  ]

  const initialBrushOpts = {
    width: width,
    height: height * 0.5,
    // plugins: [
    //   tooltipPlugin(),
    // ],
    legend: {
      show: true
    },
    cursor: {
      y: false,
      points: {
        show: false,
      },
      drag: {
        setScale: false,
        x: true,
        y: false,
      },
      sync: {
        key: 'moo',
        setSeries: true,
      },
    },
    scales: {
      x: {
        time: false,
      },
    },
    series: series,
    hooks: {
      init: [
        (u: any) => {
          u.over.ondblclick = e => {
            console.log("Fetching data for full range");

            u.setData(data);
          }
        }
      ],
      setSelect: [
        (u: any) => {
          if (u.select.width > 0) {
            let min = u.posToVal(u.select.left, 'x');
            let max = u.posToVal(u.select.left + u.select.width, 'x');

            // zoom to selection
            u.setScale('x', { min, max });

            // reset selection
            u.setSelect({ width: 0, height: 0 }, false);
          }
        }
      ],
      // addSeries: [
      //   (u, sidx) => {
      //     console.log("addSeries" + (u.status == 0 ? " (init)" : ""), sidx);
      //   }
      // ],
      // delSeries: [
      //   (u, sidx) => {
      //     console.log("delSeries", sidx);
      //   }
      // ],
    }
  }

  const [brushOpts, setBrushOpts] = useState<any>(initialBrushOpts);

  const initialData1 = useMemo<uPlot.AlignedData>(
    () => [
      data.series[0].fields[0].values,
      data.series[0].fields[1].values,
      data.series[1].fields[1].values
    ],
    []
  );
  const [data1, setData1] = useState<uPlot.AlignedData>(initialData1);
  const [selectedOption, _] = useState(null);
  const dropdownoption = [
    { value: 'add1', label: 'Add 1' },
    { value: 'add2', label: 'Add 2' },
  ];
  
  const onChange = (
    newValue: OnChangeValue<any, true>,
    actionMeta: ActionMeta<any>
  ) => {
    if (newValue.value == 'add1') {
      console.log('selva')
      const newData1: uPlot.AlignedData = [
        data.series[0].fields[0].values,
        data.series[0].fields[1].values,
        data.series[1].fields[1].values,
        data.series[1].fields[1].values.map((v,i)=>v*1.2),
      ];
      const newBrushOpts = {
        ...brushOpts,
        series: [
          ... series,
          {
            label: data.series[0].fields[1].name + (Math.random() + 1).toString(36).substring(7),
            values: (u, sidx, idx) => {
              if (idx == null)
                return {
                  x: '--',
                  Min: Number(Math.min(...data.series[sidx - 2].fields[1].values)).toExponential(4),
                  Max: Number(Math.min(...data.series[sidx - 2].fields[1].values)).toExponential(4),
                  Mean: Number(Math.min(...data.series[sidx - 2].fields[1].values)).toExponential(4),
                  Sdev: Number(Math.min(...data.series[sidx - 2].fields[1].values)).toExponential(4),
                  Value: '--'
                };
              return {
                x: data.series[0].fields[0].values[idx],
                Min: Number(Math.min(...data.series[sidx - 2].fields[1].values)).toExponential(4),
                Max: Number(Math.min(...data.series[sidx - 2].fields[1].values)).toExponential(4),
                Mean: Number(Math.min(...data.series[sidx - 2].fields[1].values)).toExponential(4),
                Sdev: Number(Math.min(...data.series[sidx - 2].fields[1].values)).toExponential(4),
                Value: Number(data.series[sidx - 2].fields[1].values[idx]).toExponential(4)
              };
            },
            stroke: "orange",
          },

        ]
      };
      unstable_batchedUpdates(() => {
        setData1(newData1);
        setBrushOpts(newBrushOpts);
      });
    }
    // setData1(
    //   [
    //   ...data1, 
    //   data.series[1].fields[1].values
    //   ]
    // );
  };

  let u = new uPlot(brushOpts, data1);
  return (
    <>
      <Select
        defaultValue={selectedOption}
        onChange={onChange}
        options={dropdownoption}
      />
      <VizLayout width={width} height={height}>
        {(vizWidth: number, vizHeight: number) => (
          <UplotReact options={brushOpts} data={data1} />
        )}
      </VizLayout>
    </>

  )
};
