// SPDX-FileCopyrightText: Copyright (c) 2026, NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react"

import { Animator } from "react-interpolation-animation"

import Wedge from "./Wedge"
import WedgeLabel from "./WedgeLabel"

import { formatAsPercentage } from "./utils"

const Meter = ({
  startAngle = 0,
  endAngle = 180,
  wedges,
  innerRadius,
  outerRadius,
  origin,
  startLabel,
  endLabel,
  decimals,
  callback
}) => {
  let runningStartAngle = startAngle
  let runningSize = 0

  return (
    <g className="gauge-meter">
      {wedges.map((wedge, i) => {
        const wedgeStartAngle = runningStartAngle
        runningStartAngle += wedge.size * endAngle
        const runningStartSize = runningSize
        runningSize += wedge.size

        return (
          <Animator values={["startAngle", "endAngle"]} key={i}>
            <Wedge
              key={i}
              startAngle={wedgeStartAngle}
              endAngle={runningStartAngle}
              size={wedge.size}
              color={wedge.color}
              label={
                startAngle === wedgeStartAngle
                  ? wedge.label
                  : wedge.label ??
                    formatAsPercentage(runningStartSize, decimals)
              }
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              origin={origin}
              index={i}
              callback={wedge.callback || callback}
            />
          </Animator>
        )
      })}
      <WedgeLabel
        angle={startAngle}
        label={startLabel}
        origin={origin}
        radius={outerRadius}
        textAnchor={"start"}
        alignmentBaseline={"hanging"}
      />
      <WedgeLabel
        angle={endAngle}
        label={endLabel}
        origin={origin}
        radius={outerRadius}
        textAnchor={"end"}
        alignmentBaseline={"hanging"}
      />
    </g>
  )
}

export default Meter
