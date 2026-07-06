// SPDX-FileCopyrightText: Copyright (c) 2026, NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react"
import cx from "classnames"
import { polarToCartesian } from "./utils"

const WedgeLabel = ({
  origin,
  angle,
  label,
  color,
  radius,
  offset = 2,
  textAnchor = "start",
  alignmentBaseline = "auto",
  className
}) => {
  const labelCoords = polarToCartesian({
    angle,
    radius: radius + offset,
    cx: origin.x,
    cy: origin.y
  })

  return (
    <g className="gauge-wedge-label-group">
      <text
        className={cx("gauge-text", "gauge-wedge-label-text", {
          [className]: Boolean(className)
        })}
        x={labelCoords.x}
        y={labelCoords.y}
        fill={color}
        textAnchor={textAnchor}
        alignmentBaseline={alignmentBaseline}
      >
        {label}
      </text>
    </g>
  )
}

export default WedgeLabel
