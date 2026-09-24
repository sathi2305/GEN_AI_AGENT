import React, { useState } from 'react';
import {
  Code2,
  FlaskConical,
  Play,
  CheckCircle2,
  Copy,
  Check,
  Bot,
  RotateCw,
  Terminal,
  ShieldCheck,
  FileCode,
} from 'lucide-react';

interface CodingTestingViewProps {
  initialTab?: 'coding' | 'testing';
  onDispatchToAgent: (prompt: string) => void;
  isDark: boolean;
}

export const CodingTestingView: React.FC<CodingTestingViewProps> = ({
  initialTab = 'coding',
  onDispatchToAgent,
  isDark,
}) => {
  const [activeTab, setActiveTab] = useState<'coding' | 'testing'>(initialTab);
  const [selectedFile, setSelectedFile] = useState<string>('optimizer.py');
  const [isCopied, setIsCopied] = useState(false);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testOutputStatus, setTestOutputStatus] = useState<string>('All 24 test suites passing');

  const filesCode: Record<string, { lang: string; code: string; astValid: boolean }> = {
    'optimizer.py': {
      lang: 'python',
      astValid: true,
      code: `"""
EcoRoute AI Logistics Engine
Elevation and Eurovignette Toll-Aware Dijkstra Pathing
"""
from typing import List, Tuple, Dict
import heapq
import math

class ElevationAwareRouter:
    def __init__(self, battery_capacity_kwh: float = 600.0, vehicle_mass_kg: float = 38000.0):
        self.battery_capacity_kwh = battery_capacity_kwh
        self.vehicle_mass_kg = vehicle_mass_kg
        self.gravity = 9.81  # m/s^2

    def calculate_edge_energy(self, distance_km: float, elev_delta_m: float, avg_speed_kmh: float = 75.0) -> float:
        """
        Calculates net energy draw in kWh accounting for rolling resistance,
        aerodynamic drag, and gravitational potential energy.
        """
        # Gravitational energy: Delta E_grav = m * g * delta_h (Joules to kWh)
        e_grav_kwh = (self.vehicle_mass_kg * self.gravity * elev_delta_m) / 3_600_000.0
        
        # Base rolling & aerodynamic consumption (~1.3 kWh / km on flat surface for 38t EV)
        base_kwh = distance_km * 1.32
        
        if elev_delta_m < 0:
            # Regenerative braking capture efficiency at 72%
            regen_captured = abs(e_grav_kwh) * 0.72
            net_energy = max(0.2 * distance_km, base_kwh - regen_captured)
        else:
            net_energy = base_kwh + e_grav_kwh
            
        return net_energy

    def find_optimal_eco_route(self, graph: Dict[str, List[Tuple[str, float, float]]], start: str, end: str):
        # Priority Queue: (cost_euro, current_node, path, accumulated_kwh)
        pq = [(0.0, start, [start], 0.0)]
        visited = {}

        while pq:
            cost, u, path, total_kwh = heapq.heappop(pq)
            if u == end:
                return {"path": path, "total_cost_eur": cost, "energy_kwh": total_kwh}

            if u in visited and visited[u] <= cost:
                continue
            visited[u] = cost

            for v, dist, elev_change in graph.get(u, []):
                energy = self.calculate_edge_energy(dist, elev_change)
                # Eurovignette toll zero-emission subsidy reduces standard €0.24/km by 50%
                toll_cost = dist * 0.12
                edge_cost = toll_cost + (energy * 0.28)  # Electricity cost €0.28/kWh
                
                heapq.heappush(pq, (cost + edge_cost, v, path + [v], total_kwh + energy))

        return None
`,
    },
    'main.py': {
      lang: 'python',
      astValid: true,
      code: `"""
FastAPI Microservice Entrypoint for EcoRoute AI
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from optimizer import ElevationAwareRouter

app = FastAPI(title="EcoRoute AI Optimizer API", version="2.4.0")
router = ElevationAwareRouter()

class RouteRequest(BaseModel):
    origin: str
    destination: str
    truck_mass_kg: float = 38000.0

@app.post("/api/v1/routes/optimize")
async def optimize_route(req: RouteRequest):
    sample_graph = {
        "A": [("B", 45.0, 120.0), ("C", 60.0, -80.0)],
        "B": [("D", 50.0, -40.0)],
        "C": [("D", 40.0, 20.0)],
    }
    result = router.find_optimal_eco_route(sample_graph, req.origin, req.destination)
    if not result:
        raise HTTPException(status_code=404, detail="No route found")
    return {"status": "success", "route": result}
`,
    },
    'test_router.py': {
      lang: 'python',
      astValid: true,
      code: `"""
Automated Pytest Suite for ElevationAwareRouter
"""
import pytest
from optimizer import ElevationAwareRouter

def test_elevation_energy_uphill():
    router = ElevationAwareRouter()
    kwh = router.calculate_edge_energy(distance_km=10.0, elev_delta_m=300.0)
    assert kwh > 13.2  # Must account for gravity penalty

def test_regenerative_braking_downhill():
    router = ElevationAwareRouter()
    kwh = router.calculate_edge_energy(distance_km=10.0, elev_delta_m=-300.0)
    assert kwh < 13.2  # Must capture regen power

def test_dijkstra_route_selection():
    router = ElevationAwareRouter()
    graph = {"Start": [("Mid", 10.0, 50.0)], "Mid": [("End", 10.0, -50.0)]}
    res = router.find_optimal_eco_route(graph, "Start", "End")
    assert res is not None
    assert res["path"] == ["Start", "Mid", "End"]
`,
    },
  };

  const testSuites = [
    { name: 'test_elevation_gradient_penalty', duration: '34ms', status: 'passed' },
    { name: 'test_dijkstra_battery_cost_function', duration: '18ms', status: 'passed' },
    { name: 'test_eurovignette_toll_subsidy_applicator', duration: '22ms', status: 'passed' },
    { name: 'test_thermal_degradation_regeneration_limits', duration: '41ms', status: 'passed' },
    { name: 'test_fastapi_route_optimization_endpoint', duration: '55ms', status: 'passed' },
    { name: 'test_pydantic_schema_validation_null_guard', duration: '12ms', status: 'passed' },
    { name: 'test_graph_cycle_prevention_large_matrix', duration: '78ms', status: 'passed' },
    { name: 'test_battery_low_reserve_rerouting_heuristic', duration: '29ms', status: 'passed' },
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(filesCode[selectedFile].code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRunTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      setIsRunningTests(false);
      setTestOutputStatus('24 / 24 Tests Passed (0 Failed, 0 Flaky)');
    }, 1200);
  };

  return (
    <div id="coding-testing-view" className="space-y-6 max-w-7xl mx-auto">
      {/* Top Selector Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('coding')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'coding'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Code2 className="w-4 h-4 text-indigo-500" />
            <span>Coding Sandbox & AST Inspector</span>
          </button>

          <button
            onClick={() => setActiveTab('testing')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'testing'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-emerald-500" />
            <span>Testing Engine (24 Suites)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AST Verified Safe</span>
          </span>
          <button
            onClick={() => onDispatchToAgent(`Refactor and optimize the code in ${selectedFile} with unit tests.`)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask Agent to Optimize</span>
          </button>
        </div>
      </div>

      {activeTab === 'coding' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* File Picker (1 col) */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Workspace Files
            </div>
            <div className="space-y-1.5">
              {Object.keys(filesCode).map((fname) => (
                <button
                  key={fname}
                  onClick={() => setSelectedFile(fname)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                    selectedFile === fname
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5 font-semibold text-indigo-600 dark:text-indigo-400'
                      : isDark
                      ? 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-900 text-zinc-300'
                      : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-500" />
                    <span>{fname}</span>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-mono">AST: OK</span>
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer (3 cols) */}
          <div className="lg:col-span-3 space-y-2">
            <div className="flex items-center justify-between pb-1">
              <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {selectedFile} ({filesCode[selectedFile].lang})
              </span>
              <button
                onClick={handleCopyCode}
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <div className={`p-4 rounded-2xl border font-mono text-xs leading-relaxed overflow-x-auto max-h-[550px] transition-colors ${
              isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
            }`}>
              <pre className="whitespace-pre">{filesCode[selectedFile].code}</pre>
            </div>
          </div>
        </div>
      ) : (
        /* Testing Engine View */
        <div className="space-y-4">
          <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
          }`}>
            <div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-emerald-500" />
                <span>Automated Pytest & AST Validation Engine</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Simulated container runner executing algorithmic constraints, edge energy formulas, and API endpoints.
              </p>
            </div>

            <button
              onClick={handleRunTests}
              disabled={isRunningTests}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors shrink-0 disabled:opacity-50"
            >
              {isRunningTests ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>{isRunningTests ? 'Running Suites...' : 'Run All Test Suites'}</span>
            </button>
          </div>

          <div className={`p-4 rounded-xl border transition-colors ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit mb-3 text-xs font-semibold">
              <span className="text-zinc-500 dark:text-zinc-400">Test Case</span>
              <span className="text-zinc-500 dark:text-zinc-400">Execution Status</span>
            </div>

            <div className="space-y-2">
              {testSuites.map((ts, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/80 text-xs font-mono"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-zinc-800 dark:text-zinc-200">{ts.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400 text-[11px]">{ts.duration}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase">
                      {ts.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
