import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { apiClient } from "../services/api";
import { subscribeToSignals } from "../services/socket";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentSignals, setRecentSignals] = useState<any[]>([]);

  const { data: signalStats, isLoading: statsLoading } = useQuery(
    "signalStats",
    () => apiClient.getSignalStats()
  );

  const { data: activeSignals, isLoading: signalsLoading } = useQuery(
    "activeSignals",
    () => apiClient.getActiveSignals()
  );

  const { data: forexPairs } = useQuery("forexPairs", () =>
    apiClient.getForexPairs()
  );

  useEffect(() => {
    if (signalStats) {
      setStats(signalStats.data);
    }
  }, [signalStats]);

  useEffect(() => {
    if (activeSignals) {
      setRecentSignals(activeSignals.data.slice(0, 5));
    }
  }, [activeSignals]);

  useEffect(() => {
    const handleNewSignal = (data: any) => {
      setRecentSignals((prev) => [data.signal, ...prev].slice(0, 5));
    };

    subscribeToSignals(handleNewSignal);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Statistics */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card">
            <div className="text-gray-600 text-sm font-medium">Active Signals</div>
            <div className="text-3xl font-bold text-primary mt-2">
              {stats.activeSignals}
            </div>
          </div>

          <div className="card">
            <div className="text-gray-600 text-sm font-medium">Total Closed</div>
            <div className="text-3xl font-bold text-secondary mt-2">
              {stats.totalClosed}
            </div>
          </div>

          <div className="card">
            <div className="text-gray-600 text-sm font-medium">Win Rate</div>
            <div className="text-3xl font-bold text-success mt-2">
              {stats.winRate}%
            </div>
          </div>

          <div className="card">
            <div className="text-gray-600 text-sm font-medium">Avg Profit/Loss</div>
            <div className={`text-3xl font-bold mt-2 ${Number(stats.averageProfitLoss) > 0 ? "text-success" : "text-danger"}`}>
              {stats.averageProfitLoss}%
            </div>
          </div>
        </div>
      )}

      {/* Recent Signals */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Signals</h2>

        {!signalsLoading && recentSignals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Pair</th>
                  <th>Type</th>
                  <th>Entry Price</th>
                  <th>Target</th>
                  <th>Stop Loss</th>
                  <th>Confidence</th>
                  <th>Volatility</th>
                </tr>
              </thead>
              <tbody>
                {recentSignals.map((signal) => (
                  <tr key={signal.id} className="hover:bg-gray-50">
                    <td className="font-medium">{signal.pair}</td>
                    <td>
                      <span
                        className={`badge ${
                          signal.type.includes("BUY")
                            ? "badge-success"
                            : "badge-danger"
                        }`}
                      >
                        {signal.type}
                      </span>
                    </td>
                    <td>${signal.entryPrice?.toFixed(5)}</td>
                    <td>${signal.targetPrice?.toFixed(5)}</td>
                    <td>${signal.stopLoss?.toFixed(5)}</td>
                    <td>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${signal.confidence}%`,
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm">
                          {signal.confidence?.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td>{signal.volatilityScore?.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No active signals at the moment.</p>
        )}
      </div>

      {/* Market Overview */}
      {forexPairs && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Market Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(forexPairs.data as any[]).slice(0, 6).map((pair) => (
              <div
                key={pair.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="font-bold text-gray-800">{pair.symbol}</div>
                <div className="text-2xl font-bold text-primary mt-2">
                  {Number(pair.currentPrice).toFixed(5)}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Volatility: {Number(pair.historicalVolatility30d).toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Bid: {Number(pair.bid).toFixed(5)} | Ask:{" "}
                  {Number(pair.ask).toFixed(5)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
