// SPDX-FileCopyrightText: Copyright (c) 2026, NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { nodeResolve } from "@rollup/plugin-node-resolve"
import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import external from "rollup-plugin-peer-deps-external"

import pkg from "./package.json"

const config = {
  input: "src/exports.js",
  output: {
    file: pkg.main,
    format: "cjs",
    sourcemap: true,
  },
  // plugins: [nodeResolve()],
  plugins: [
    nodeResolve({
      extensions: [".js"],
    }),
    external(),

    // resolve(),
    babel({
      babelHelpers: "runtime",
      exclude: "node_modules/**",
      presets: ["@babel/preset-react"],
    }),
    commonjs(),
  ],
}

export default config
