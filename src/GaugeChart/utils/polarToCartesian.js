// SPDX-FileCopyrightText: Copyright (c) 2026, NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { deg2rad } from "./deg2rad"
export const polarToCartesian = ({
  angle,
  startPos = 0,
  radius = 50,
  cx = 50,
  cy = 50
}) => {
  const rad = deg2rad(angle) - startPos

  return {
    x: cx - radius * Math.cos(rad),
    y: cy - radius * Math.sin(rad)
  }
}
