// SPDX-FileCopyrightText: Copyright (c) 2026, NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react"
import cx from "classnames"

const Needle = ({
  origin,
  angle,
  color,
  stroke,
  radius = 50,
  needleWidth = 6,
  label,
  outside,
  labelOffset = 15,
  callback,
  classes = []
}) => {
  const needleAngle = angle - 90

  return (
    <g className="gauge-needle-group">
      <g transform={`rotate(${needleAngle}, ${origin.x} ${origin.y})`}>
        <path
          className={cx("gauge-needle", { outside }, classes)}
          d={`M${origin.x - needleWidth / 2} ${origin.y}
        A${needleWidth / 2} ${needleWidth / 2} 0 0 0 ${
            origin.x + needleWidth / 2
          } ${origin.y}
        L${origin.x} ${origin.y - radius}
        Z`}
          fill={color}
          stroke={stroke}
          strokeWidth="1"
          onClick={callback}
          style={{ cursor: callback ? "pointer" : undefined }}
        />
      </g>
      <text
        className="gauge-text gauge-needle-text"
        x={origin.x}
        y={origin.y + labelOffset}
        fill={color}
        fontSize={12}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  )
}

export default Needle
