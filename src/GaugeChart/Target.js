// SPDX-FileCopyrightText: Copyright (c) 2026, NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react"
import WedgeLabel from "./WedgeLabel"

import { polarToCartesian } from "./utils"

const Target = ({
  origin = {},
  angle = 0,
  innerRadius = 25,
  outerRadius = 50,
  stroke,
  width = 1,
  label
}) => {
  const { x, y } = origin
  const startPoint = polarToCartesian({
    angle,
    radius: innerRadius,
    cx: x,
    cy: y
  })

  const endPoint = polarToCartesian({
    angle,
    radius: outerRadius,
    cx: x,
    cy: y
  })

  return (
    <g className="gauge-target-group">
      <line
        className="gauge-target-line"
        x1={startPoint.x}
        y1={startPoint.y}
        x2={endPoint.x}
        y2={endPoint.y}
        stroke={stroke}
        width={width}
      />
      <WedgeLabel
        angle={angle}
        label={label}
        origin={origin}
        radius={outerRadius}
        textAnchor={angle > 90 ? "start" : "end"}
        color={stroke}
        className={"gauge-target-label-text"}
      />
    </g>
  )
}

export default Target
