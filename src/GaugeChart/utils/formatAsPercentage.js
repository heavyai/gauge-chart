// SPDX-FileCopyrightText: Copyright (c) 2026, NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

export const formatAsPercentage = (num, decimals = 0) =>
  `${(num * 100).toFixed(decimals)}%`
