// SPDX-FileCopyrightText: Copyright (c) 2026, NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react"

import { Animator } from "react-interpolation-animation"

import Meter from "./Meter"
import Needle from "./Needle"
import Target from "./Target"

import { formatAsPercentage } from "./utils"

const CHART_WIDTH = 250
const CHART_HEIGHT = 135

const GaugeChart = ({
  origin = { x: CHART_WIDTH / 2, y: CHART_HEIGHT - 20 },
  startAngle = 0,
  endAngle = 180,
  wedges = [],
  value,
  valueLabel,
  targetValue,
  targetLabel,
  min,
  max: givenMax,
  innerRadius = CHART_WIDTH / 4,
  outerRadius = (CHART_WIDTH / 2) * 0.83,
  startLabel,
  endLabel,
  decimals = 0,
  minNeedleAngle,
  maxNeedleAngle,
  needleColor,
  needleStroke,
  outsideNeedleColor,
  outsideNeedleStroke,
  duration,
  wedgeCallback,
  needleLabelOffset,
  needleCallback,
  needleClasses
}) => {
  const max = givenMax <= min ? min + 1 : givenMax
  let needleAngle = ((value - min) / (max - min)) * (endAngle - startAngle)

  const outsideNeedle =
    (needleAngle < startAngle && minNeedleAngle !== undefined) ||
    (needleAngle > endAngle && maxNeedleAngle !== undefined)

  if (needleAngle < startAngle && minNeedleAngle !== undefined) {
    needleAngle = minNeedleAngle
    needleColor = outsideNeedleColor
    needleStroke = outsideNeedleStroke
  }

  if (needleAngle > endAngle && maxNeedleAngle !== undefined) {
    needleAngle = maxNeedleAngle
    needleColor = outsideNeedleColor
    needleStroke = outsideNeedleStroke
  }

  const targetAngle =
    ((targetValue - min) / (max - min)) * (endAngle - startAngle)

  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
      className="gauge-chart"
    >
      <Meter
        wedges={wedges}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        origin={origin}
        startLabel={startLabel}
        endLabel={endLabel}
        decimals={decimals}
        startAngle={startAngle}
        endAngle={endAngle}
        callback={wedgeCallback}
      />
      <Animator values={["angle"]} duration={duration}>
        <Needle
          angle={needleAngle}
          radius={outerRadius}
          origin={origin}
          label={
            valueLabel ??
            formatAsPercentage((value - min) / (max - min), decimals)
          }
          color={needleColor}
          stroke={needleStroke}
          outside={outsideNeedle}
          labelOffset={needleLabelOffset}
          callback={needleCallback}
          classes={needleClasses}
        />
      </Animator>
      {typeof targetValue === "number" &&
        targetAngle >= startAngle &&
        targetAngle <= endAngle && (
          <Animator values={["angle"]} duration={duration}>
            <Target
              angle={targetAngle}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              origin={origin}
              label={
                targetLabel ??
                formatAsPercentage((targetValue - min) / (max - min), decimals)
              }
            />
          </Animator>
        )}
    </svg>
  )
}

export default GaugeChart
