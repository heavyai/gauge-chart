// SPDX-FileCopyrightText: Copyright (c) 2026, NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react"
import "./App.css"
import GaugeChart from "./GaugeChart"

const defaultWedges = [
  { size: 0.25, color: "red" },
  { size: 0.5, color: "yellow" },
  { size: 0.15, color: "green" },
  { size: 0.1, color: "cyan" }
]

function App() {
  const [value, setValue] = useState(40)
  const [tempValue, setTempValue] = useState(40)

  const [target, setTarget] = useState(40)
  const [tempTarget, setTempTarget] = useState(40)

  const [wedges, setWedges] = useState(defaultWedges)
  const [tempWedges, setTempWedges] = useState(
    JSON.stringify(defaultWedges, undefined, 2)
  )
  return (
    <div className="App">
      <div className="gauge-container">
        <GaugeChart
          startLabel={"0%"}
          endLabel={"100%"}
          width={500}
          height={270}
          min={0}
          max={100}
          value={value}
          targetValue={target}
          wedges={wedges}
          wedgeCallback={(i) => console.log("CLICKED ON : ", i)} // eslint-disable-line
          needleCallback={(i) => console.log("NEEDLED : ", i)} // eslint-disable-line
          minNeedleAngle={0}
          maxNeedleAngle={180}
        />
      </div>
      <div>
        <input
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
        />
        <button onClick={() => setValue(tempValue)}>Update value</button>
      </div>
      <div>
        <input
          value={tempTarget}
          onChange={(e) => setTempTarget(e.target.value)}
        />
        <button onClick={() => setTarget(tempTarget)}>Update target</button>
      </div>
      <div>
        <textarea
          value={tempWedges}
          rows={25}
          cols={25}
          onChange={(e) => setTempWedges(e.target.value)}
        />
        <br />
        <button onClick={() => setWedges(JSON.parse(tempWedges))}>
          Update wedges
        </button>
      </div>
    </div>
  )
}

export default App
