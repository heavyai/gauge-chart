// SPDX-FileCopyrightText: Copyright (c) 2026, NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react"

import WedgeLabel from "./WedgeLabel"

import { polarToCartesian } from "./utils"

const Wedge = ({
  startAngle,
  endAngle,
  color,
  innerRadius,
  outerRadius,
  origin,
  label,
  index,
  callback
}) => {
  const innerStart = polarToCartesian({
    angle: startAngle,
    radius: innerRadius,
    cx: origin.x,
    cy: origin.y
  })

  const innerEnd = polarToCartesian({
    angle: startAngle,
    radius: outerRadius,
    cx: origin.x,
    cy: origin.y
  })

  const outerStart = polarToCartesian({
    angle: endAngle,
    radius: innerRadius,
    cx: origin.x,
    cy: origin.y
  })

  const outerEnd = polarToCartesian({
    angle: endAngle,
    radius: outerRadius,
    cx: origin.x,
    cy: origin.y
  })

  const handler = callback ? () => callback(index) : undefined

  return (
    <g className="wedge">
      <path
        d={`
        M${innerStart.x},${innerStart.y}
        L${innerEnd.x},${innerEnd.y}
        A${outerRadius} ${outerRadius} 0 0 1 ${outerEnd.x} ${outerEnd.y}
        L${outerStart.x},${outerStart.y}
        A${innerRadius} ${innerRadius} 0 0 0 ${innerStart.x} ${innerStart.y}
        Z
      `}
        fill={color}
        onClick={handler}
        style={{ cursor: handler ? "pointer" : undefined }}
      />

      <WedgeLabel
        angle={startAngle}
        label={label}
        origin={origin}
        radius={outerRadius}
        textAnchor={startAngle > 90 ? "start" : "end"}
      />
    </g>
  )
}

export default Wedge
