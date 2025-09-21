"use client"
import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RotateCcw, Backpack, ArrowLeft, Clock, Lightbulb, Target } from "lucide-react"
import { DraggableItem, DropZone } from "./drag-drop-handler"
import { ShakeAnimation, BagOpenAnimation, FloatingScore } from "./particle-effects"
import { useSoundEffects } from "./sound-effects"
import Leaderboard from "./leaderboard"

interface GameItem {
  id: string
  label: string
  type: "essential" | "distractor"
  score: number
  tooltip: string
  isPlaced: boolean
  emoji?: string
}

interface GameProps {
  onBack?: () => void
}

const GAME_ITEMS: Omit<GameItem, "isPlaced">[] = [
  // Essentials (12 items) → each worth +10 points
  {
    id: "torch",
    label: "Battery Operated Torch",
    type: "essential",
    score: 10,
    tooltip: "Helps you see during power outages or at night.",
    emoji: "🔦",
  },
  {
    id: "batteries",
    label: "Extra Batteries",
    type: "essential",
    score: 10,
    tooltip: "Keep devices like torch and radio working longer.",
    emoji: "🔋",
  },
  {
    id: "radio",
    label: "Battery Operated Radio",
    type: "essential",
    score: 10,
    tooltip: "Stay updated with official disaster announcements.",
    emoji: "📻",
  },
  {
    id: "firstaid",
    label: "First Aid Kit & Medicines",
    type: "essential",
    score: 10,
    tooltip: "For treating small injuries and essential health needs.",
    emoji: "🏥",
  },
  {
    id: "papers",
    label: "Important Papers",
    type: "essential",
    score: 10,
    tooltip: "Carry IDs like Ration Card, Voter ID, Aadhar for identification.",
    emoji: "📄",
  },
  {
    id: "foodwater",
    label: "Emergency Food & Water",
    type: "essential",
    score: 10,
    tooltip: "Dry food and sealed water bottles are critical for survival.",
    emoji: "🥫",
  },
  {
    id: "candles",
    label: "Candles & Matches (Waterproof)",
    type: "essential",
    score: 10,
    tooltip: "Backup light source if torch/batteries fail.",
    emoji: "🕯️",
  },
  {
    id: "knife",
    label: "Knife",
    type: "essential",
    score: 10,
    tooltip: "Useful for cutting ropes, preparing food, or emergencies.",
    emoji: "🔪",
  },
  {
    id: "chlorine",
    label: "Chlorine Tablets / Water Purifier",
    type: "essential",
    score: 10,
    tooltip: "Purify water to prevent diseases.",
    emoji: "💊",
  },
  {
    id: "cash",
    label: "Cash",
    type: "essential",
    score: 10,
    tooltip: "Needed when digital payments and ATMs are unavailable.",
    emoji: "💵",
  },
  {
    id: "rope",
    label: "Thick Ropes & Cords",
    type: "essential",
    score: 10,
    tooltip: "For climbing, tying, or rescuing during floods and quakes.",
    emoji: "🪢",
  },
  {
    id: "shoes",
    label: "Shoes",
    type: "essential",
    score: 10,
    tooltip: "Protect your feet when moving through debris or water.",
    emoji: "👟",
  },

  // Distractors (8 items) → each worth −5 points
  {
    id: "teddy",
    label: "Teddy Bear",
    type: "distractor",
    score: -5,
    tooltip: "Comforting, but not essential for survival.",
    emoji: "🧸",
  },
  {
    id: "fruit",
    label: "Bananas",
    type: "distractor",
    score: -5,
    tooltip: "Perishable items spoil quickly in disasters.",
    emoji: "🍌",
  },
  {
    id: "football",
    label: "Football",
    type: "distractor",
    score: -5,
    tooltip: "Fun, but doesn't help in an emergency.",
    emoji: "⚽",
  },
  {
    id: "sunglasses",
    label: "Sunglasses",
    type: "distractor",
    score: -5,
    tooltip: "Not useful for disaster survival.",
    emoji: "🕶️",
  },
  {
    id: "videogame",
    label: "Video Game Controller",
    type: "distractor",
    score: -5,
    tooltip: "No electricity, no games — not essential.",
    emoji: "🎮",
  },
  {
    id: "hairdryer",
    label: "Hair Dryer",
    type: "distractor",
    score: -5,
    tooltip: "Needs power supply, not useful in emergencies.",
    emoji: "💨",
  },
  {
    id: "jewelry",
    label: "Jewelry",
    type: "distractor",
    score: -5,
    tooltip: "Valuable but doesn't help with safety or survival.",
    emoji: "💎",
  },
  {
    id: "soda",
    label: "Soda Can",
    type: "distractor",
    score: -5,
    tooltip: "Sugary drinks dehydrate you — not survival-friendly.",
    emoji: "🥤",
  },
]

const GAME_LEVELS = {
  1: { name: "Beginner", itemCount: 16, timeLimit: null }, // Show fewer items for beginners
  2: { name: "Intermediate", itemCount: 18, timeLimit: null },
  3: { name: "Expert", itemCount: 20, timeLimit: 60 }, // All 20 items
}

const DISASTER_SCENARIOS = {
  general: { name: "General Emergency", description: "Basic emergency preparedness kit" },
  earthquake: { name: "Earthquake Kit", description: "Prepare for seismic activity" },
  flood: { name: "Flood Kit", description: "Prepare for water emergencies" },
  fire: { name: "Fire Emergency", description: "Prepare for fire evacuations" },
}

export default function EmergencyKitGame({ onBack }: GameProps) {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentScenario, setCurrentScenario] = useState<keyof typeof DISASTER_SCENARIOS>("general")
  const [timerMode, setTimerMode] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showHint, setShowHint] = useState<string | null>(null)

  const [gameItems, setGameItems] = useState<GameItem[]>(() => {
    const level = GAME_LEVELS[currentLevel as keyof typeof GAME_LEVELS]
    const allItems = GAME_ITEMS.map((item) => ({ ...item, isPlaced: false }))
    // For lower levels, show fewer items but always include all essentials
    const essentials = allItems.filter((item) => item.type === "essential")
    const distractors = allItems.filter((item) => item.type === "distractor")

    if (level.itemCount >= 20) {
      return [...essentials, ...distractors].sort(() => Math.random() - 0.5)
    } else {
      const selectedDistractors = distractors.slice(0, level.itemCount - essentials.length)
      return [...essentials, ...selectedDistractors].sort(() => Math.random() - 0.5)
    }
  })

  const [score, setScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string>("")
  const [showFeedback, setShowFeedback] = useState(false)
  const bagRef = useRef<HTMLDivElement>(null)

  // keep animations and sounds, but remove floating scores & particle state
  const [shakeEffect, setShakeEffect] = useState(false)
  const [bagOpen, setBagOpen] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const { playSuccessSound, playErrorSound, playHintSound, playLevelCompleteSound } = useSoundEffects(soundEnabled)

  useEffect(() => {
    if (timerMode && timeLeft !== null && timeLeft > 0 && gameStarted && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timerMode && timeLeft === 0) {
      setGameComplete(true)
    }
  }, [timeLeft, timerMode, gameStarted, gameComplete])

  // finishGame function & keyboard shortcut
  const finishGame = () => {
    setGameComplete(true)
    playLevelCompleteSound()
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "f" || e.key === "F") && gameStarted && !gameComplete) {
        finishGame()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [gameStarted, gameComplete])

  const handleDrop = (itemId: string) => {
    const item = gameItems.find((item) => item.id === itemId)
    if (!item || item.isPlaced) return

    setGameItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, isPlaced: true } : i)))

    // Use the exact score from the item
    const scoreChange = item.score
    setScore((prev) => Math.max(0, prev + scoreChange))

    if (item.type === "essential") {
      // bag open visual
      setBagOpen(true)
      setTimeout(() => setBagOpen(false), 600)

      // play success sound only (no particles)
      playSuccessSound()
    } else {
      // shake animation for wrong drop
      setShakeEffect(true)
      setTimeout(() => setShakeEffect(false), 500)

      // play error sound only (no particles)
      playErrorSound()
    }

    // show tooltip feedback
    setFeedback(item.tooltip)
    setShowFeedback(true)
    setTimeout(() => setShowFeedback(false), 3000)

    // check remaining items to finish automatically when all tried
    const remainingItems = gameItems.filter((i) => !i.isPlaced && i.id !== itemId)
    if (remainingItems.length === 0) {
      setTimeout(() => {
        setGameComplete(true)
        playLevelCompleteSound()
      }, 500)
    }
  }

  const useHint = () => {
    if (hintsUsed >= 1) return

    const availableEssentials = gameItems.filter((item) => item.type === "essential" && !item.isPlaced)
    if (availableEssentials.length === 0) return

    const randomItem = availableEssentials[Math.floor(Math.random() * availableEssentials.length)]
    setShowHint(randomItem.id)
    setHintsUsed((prev) => prev + 1)
    playHintSound()

    setTimeout(() => setShowHint(null), 3000)
  }

  const startGame = (level: number, scenario: keyof typeof DISASTER_SCENARIOS, timer = false) => {
    setCurrentLevel(level)
    setCurrentScenario(scenario)
    setTimerMode(timer)
    setTimeLeft(timer ? GAME_LEVELS[level as keyof typeof GAME_LEVELS].timeLimit : null)
    setHintsUsed(0)
    setShowHint(null)

    const levelConfig = GAME_LEVELS[level as keyof typeof GAME_LEVELS]
    const allItems = GAME_ITEMS.map((item) => ({ ...item, isPlaced: false }))
    const essentials = allItems.filter((item) => item.type === "essential")
    const distractors = allItems.filter((item) => item.type === "distractor")

    let selectedItems: GameItem[]
    if (levelConfig.itemCount >= 20) {
      selectedItems = [...essentials, ...distractors]
    } else {
      const selectedDistractors = distractors.slice(0, levelConfig.itemCount - essentials.length)
      selectedItems = [...essentials, ...selectedDistractors]
    }

    setGameItems(selectedItems.sort(() => Math.random() - 0.5))
    setScore(0)
    setGameComplete(false)
    setGameStarted(true)
    setFeedback("")
    setShowFeedback(false)
  }

  const resetToMenu = () => {
    setGameStarted(false)
    setGameComplete(false)
    setScore(0)
    setTimeLeft(null)
    setHintsUsed(0)
    setShowHint(null)
  }

  const maxScore = gameItems.filter((item) => item.type === "essential").length * 10
  const scorePercentage = maxScore > 0 ? (score / maxScore) * 100 : 0

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-12">
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-2">Pack Your Emergency Kit</h1>
              <p className="text-muted-foreground">Choose your challenge level</p>
            </div>
            <Button
              onClick={() => setSoundEnabled(!soundEnabled)}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              {soundEnabled ? "🔊" : "🔇"}
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {Object.entries(GAME_LEVELS).map(([level, config]) => (
              <Card
                key={level}
                className="border border-border/50 hover:border-primary/50 transition-colors p-6 text-center"
              >
                <Target className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Level {level}</h3>
                <p className="text-muted-foreground mb-4">{config.name}</p>
                <Badge variant="outline" className="mb-6">
                  {config.itemCount} items
                </Badge>
                <div className="space-y-3">
                  <Button
  onClick={() => startGame(Number.parseInt(level), "general", !!config.timeLimit)}
  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
>
  Start Level {level}
</Button>
                  {config.timeLimit && (
                    <Button
                      onClick={() => startGame(Number.parseInt(level), "general", true)}
                      variant="outline"
                      className="w-full border-border/50 hover:border-primary/50"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Timer Mode ({config.timeLimit}s)
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (gameComplete) {
    const correctItems = gameItems.filter((item) => item.type === "essential" && item.isPlaced)
    const missedItems = gameItems.filter((item) => item.type === "essential" && !item.isPlaced)
    const accuracy = Math.round(
      (correctItems.length / gameItems.filter((item) => item.type === "essential").length) * 100,
    )

    const newScore = {
      score,
      level: currentLevel,
      scenario: currentScenario,
      timeMode: timerMode,
      timeUsed:
        timerMode && timeLeft !== null
          ? GAME_LEVELS[currentLevel as keyof typeof GAME_LEVELS].timeLimit! - timeLeft
          : undefined,
      accuracy,
    }

    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <Card className="max-w-2xl w-full p-8 text-center border border-border/50">
            <div className="mb-8">
              <Backpack className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h1 className="text-3xl font-bold text-foreground mb-2">Level {currentLevel} Complete!</h1>
              <div className="text-5xl font-bold text-primary mb-4">{score} points</div>
              <div className="text-lg text-muted-foreground">You scored {scorePercentage.toFixed(0)}%!</div>
            </div>

            {scorePercentage >= 80 ? (
              <div className="bg-primary/10 p-6 rounded-lg mb-8 border border-primary/20">
                <CheckCircle className="w-10 h-10 mx-auto mb-3 text-primary" />
                <h2 className="text-lg font-semibold text-primary mb-2">Well Done!</h2>
                <p className="text-foreground">Well done! You are now better prepared for disasters.</p>
              </div>
            ) : (
              <div className="bg-destructive/10 p-6 rounded-lg mb-8 border border-destructive/20">
                <XCircle className="w-10 h-10 mx-auto mb-3 text-destructive" />
                <h2 className="text-lg font-semibold text-destructive mb-2">Try Again!</h2>
                <p className="text-foreground">Try again and learn what to pack in your emergency kit.</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => startGame(currentLevel, currentScenario, timerMode)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
              <Button
                onClick={resetToMenu}
                variant="outline"
                className="border-border/50 hover:border-primary/50 bg-transparent"
              >
                Choose New Level
              </Button>
              {onBack && (
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="border-border/50 hover:border-primary/50 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Home
                </Button>
              )}
            </div>
          </Card>
        </div>

        {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} newScore={newScore} />}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Level {currentLevel} - {DISASTER_SCENARIOS[currentScenario].name}
            </h1>
            <p className="text-muted-foreground">Drag essential emergency supplies into the bag</p>
          </div>
          <Button
            onClick={() => setSoundEnabled(!soundEnabled)}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            {soundEnabled ? "🔊" : "🔇"}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-6 mb-8">
          <Badge variant="outline" className="px-4 py-2">
            Score: {score}
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            Items Left: {gameItems.filter((item) => !item.isPlaced).length}
          </Badge>
          {timerMode && timeLeft !== null && (
            <Badge
              variant="outline"
              className={`px-4 py-2 ${timeLeft <= 10 ? "border-destructive text-destructive" : ""}`}
            >
              <Clock className="h-4 w-4 mr-2" />
              {timeLeft}s
            </Badge>
          )}
          <Button
            onClick={useHint}
            disabled={hintsUsed >= 1}
            variant="outline"
            size="sm"
            className="border-border/50 hover:border-primary/50"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Hint ({1 - hintsUsed} left)
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6 text-center text-foreground">Available Items</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {gameItems
                .filter((item) => !item.isPlaced)
                .map((item) => (
                  <DraggableItem
                    key={item.id}
                    itemId={item.id}
                    onDragStart={(id) => setDraggedItem(id)}
                    onDragEnd={() => setDraggedItem(null)}
                    isHinted={showHint === item.id}
                    className={`border border-border/50 hover:border-primary/50 rounded-lg p-4 hover:shadow-md transition-all ${
                      showHint === item.id ? "border-primary bg-primary/10" : ""
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{item.emoji}</div>
                      <div className="text-sm font-medium text-foreground">{item.label}</div>
                    </div>
                  </DraggableItem>
                ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-6 text-center text-foreground">Emergency Kit</h2>
            <div className="sticky top-4">
              <ShakeAnimation trigger={shakeEffect}>
                <BagOpenAnimation isOpen={bagOpen}>
                  <DropZone
                    onDrop={handleDrop}
                    className="bg-primary/10 border-2 border-dashed border-primary rounded-lg p-8 min-h-[400px] flex flex-col items-center justify-center hover:bg-primary/15 transition-colors"
                  >
                    <Backpack className="w-20 h-20 text-primary mb-4" />
                    <p className="text-center text-primary font-medium mb-6">Drop emergency items here</p>

                    <div className="grid grid-cols-3 gap-2 w-full">
                      {gameItems
                        .filter((item) => item.isPlaced)
                        .map((item) => (
                          <div
                            key={item.id}
                            className={`text-center p-2 rounded-lg ${
                              item.type === "essential"
                                ? "bg-primary/20 border border-primary/30"
                                : "bg-destructive/20 border border-destructive/30"
                            }`}
                          >
                            <div className="text-xl">{item.emoji}</div>
                            {item.type === "essential" ? (
                              <CheckCircle className="w-3 h-3 mx-auto text-primary" />
                            ) : (
                              <XCircle className="w-3 h-3 mx-auto text-destructive" />
                            )}
                          </div>
                        ))}
                    </div>
                  </DropZone>
                </BagOpenAnimation>
              </ShakeAnimation>
            </div>
          </div>
        </div>

        {/* Bottom Finish button (centered) */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={finishGame}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-6 py-3 text-lg rounded-lg shadow-md"
          >
            Finish Game
          </Button>
        </div>

        {/* Effects and feedback (floating score + particles removed) */}
        {showFeedback && (
          <div className="fixed top-4 right-4 z-50">
            <Card className="p-4 bg-card border border-primary shadow-lg max-w-sm">
              <p className="font-medium text-foreground">{feedback}</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
