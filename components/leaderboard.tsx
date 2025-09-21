"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Home, Search } from "lucide-react"

interface LeaderboardEntry {
  id: string
  playerName: string
  score: number
  level: number
  scenario: string
  timeMode: boolean
  timeUsed?: number
  accuracy: number
  date: string
}

interface LeaderboardProps {
  onBack: () => void
  onStartGame: () => void
  newScore?: {
    score: number
    level: number
    scenario: string
    timeMode: boolean
    timeUsed?: number
    accuracy: number
  }
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: "1",
    playerName: "Alex Chen",
    score: 950,
    level: 3,
    scenario: "earthquake",
    timeMode: true,
    timeUsed: 45,
    accuracy: 95,
    date: "2024-09-20",
  },
  {
    id: "2",
    playerName: "Sarah Kim",
    score: 890,
    level: 3,
    scenario: "general",
    timeMode: false,
    accuracy: 89,
    date: "2024-09-19",
  },
  {
    id: "3",
    playerName: "Mike Johnson",
    score: 820,
    level: 2,
    scenario: "flood",
    timeMode: true,
    timeUsed: 38,
    accuracy: 92,
    date: "2024-09-18",
  },
  {
    id: "4",
    playerName: "Emma Davis",
    score: 780,
    level: 2,
    scenario: "fire",
    timeMode: false,
    accuracy: 87,
    date: "2024-09-17",
  },
  {
    id: "5",
    playerName: "James Wilson",
    score: 750,
    level: 2,
    scenario: "general",
    timeMode: true,
    timeUsed: 42,
    accuracy: 83,
    date: "2024-09-16",
  },
]

export default function Leaderboard({ onBack, onStartGame, newScore }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [playerName, setPlayerName] = useState("")
  const [showNameInput, setShowNameInput] = useState(false)
  const [activeTab, setActiveTab] = useState<"rankings" | "statistics">("rankings")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const savedLeaderboard = localStorage.getItem("emergency-kit-leaderboard")
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard))
    } else {
      setLeaderboard(MOCK_LEADERBOARD)
      localStorage.setItem("emergency-kit-leaderboard", JSON.stringify(MOCK_LEADERBOARD))
    }

    if (newScore && newScore.score > 0) {
      setShowNameInput(true)
    }
  }, [newScore])

  const saveScore = () => {
    if (!newScore || !playerName.trim()) return

    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      playerName: playerName.trim(),
      score: newScore.score,
      level: newScore.level,
      scenario: newScore.scenario,
      timeMode: newScore.timeMode,
      timeUsed: newScore.timeUsed,
      accuracy: newScore.accuracy,
      date: new Date().toISOString().split("T")[0],
    }

    const updatedLeaderboard = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 10) // Keep top 10

    setLeaderboard(updatedLeaderboard)
    localStorage.setItem("emergency-kit-leaderboard", JSON.stringify(updatedLeaderboard))
    setShowNameInput(false)
    setPlayerName("")
  }

  const filteredLeaderboard = leaderboard.filter((entry) =>
    entry.playerName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-coral hover:bg-gray-900"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
        <Button onClick={onStartGame} className="bg-coral hover:bg-coral/90 text-white px-6">
          Play Game
        </Button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Leaderboard</h1>
          <p className="text-gray-400 text-lg">See how you rank against other disaster preparedness champions</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-gray-900 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab("rankings")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "rankings" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Rankings
            </button>
            <button
              onClick={() => setActiveTab("statistics")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "statistics" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Statistics
            </button>
          </div>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:border-coral"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-coral" />
            <h2 className="text-xl font-semibold text-white">Top Survivors</h2>
          </div>
          <p className="text-gray-400 text-sm">{filteredLeaderboard.length} players shown</p>
        </div>

        {filteredLeaderboard.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="h-16 w-16 mx-auto mb-6 text-gray-600" />
            <p className="text-gray-400 text-lg mb-8">No scores yet. Be the first to play!</p>
            <Button onClick={onStartGame} className="bg-coral hover:bg-coral/90 text-white px-8 py-3">
              Start Playing
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLeaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className="bg-gray-900 rounded-lg p-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 min-w-[60px]">
                    {index === 0 && <Trophy className="h-5 w-5 text-coral" />}
                    <span className="font-bold text-white">#{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{entry.playerName}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                        Level {entry.level}
                      </Badge>
                      <span>{entry.scenario}</span>
                      <span>{entry.accuracy}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-coral">{entry.score}</div>
                  <div className="text-xs text-gray-400">{entry.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showNameInput && newScore && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-white mb-4">Great Score! Save to Leaderboard</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-coral"
                  maxLength={20}
                />
                <Button
                  onClick={saveScore}
                  disabled={!playerName.trim()}
                  className="bg-coral hover:bg-coral/90 text-white"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
