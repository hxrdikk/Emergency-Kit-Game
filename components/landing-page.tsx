"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Play,
  Trophy,
  MapPin,
  Target,
  Clock,
  Flame,
  Mountain,
  Waves,
  Wind,
  Phone,
  AlertTriangle,
  Cloud,
  ShieldCheck,
} from "lucide-react"
import EmergencyKitGame from "./emergency-kit-game"
import Leaderboard from "./leaderboard"

export default function LandingPage() {
  const [showGame, setShowGame] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  if (showGame) {
    return <EmergencyKitGame onBack={() => setShowGame(false)} />
  }

  if (showLeaderboard) {
    return (
      <Leaderboard
        onBack={() => setShowLeaderboard(false)}
        onStartGame={() => {
          setShowLeaderboard(false)
          setShowGame(true)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Shield className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold text-foreground">Emergency Kit Game</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLeaderboard(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </Button>
              <Badge variant="secondary" className="text-sm">
                Educational Game
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Badge className="mb-8 bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">
            <Shield className="h-4 w-4 mr-2" />
            Safety at every step
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Pack Your Emergency Kit
            <br />
            <span className="text-primary">Learn Preparedness Through Gaming</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Practice packing an emergency kit with essential survival items. Learn what to include, what to avoid, and
            how to prepare for real-life disasters — all while playing a fun interactive game.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => setShowGame(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg rounded-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Playing Now
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setShowLeaderboard(true)}
              className="text-muted-foreground hover:text-foreground px-8 py-4 text-lg"
            >
              <Trophy className="h-5 w-5 mr-2" />
              View Leaderboard
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 border-t border-border/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Drag and drop the correct items into your kit, avoid distractors, and test how prepared you are for
              emergencies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Choose a Level</h3>
              <p className="text-muted-foreground">
                Start with Beginner, Intermediate, or Expert — higher levels add more items and distractions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Pack Essentials</h3>
              <p className="text-muted-foreground">
                Drag essentials like torches, radios, first aid, and food into your kit while avoiding non-essentials.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Compete & Learn</h3>
              <p className="text-muted-foreground">
                Score points, race against the clock on Expert mode, and climb the leaderboard while learning survival
                skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disaster Preparedness Guide */}
      <section className="py-24 border-t border-border/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Disaster Preparedness Guide</h2>
            <p className="text-lg text-muted-foreground">
              Essential knowledge for staying safe during natural disasters
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Fire Safety */}
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mr-4">
                  <Flame className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-red-500">Fire Safety</h3>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Causes</h4>
                  <p className="text-muted-foreground">
                    Electrical faults, cooking accidents, heating equipment, smoking materials
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Prevention</h4>
                  <p className="text-muted-foreground">
                    Install smoke detectors, maintain electrical systems, safe cooking practices
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">During Fire</h4>
                  <p className="text-muted-foreground">
                    Stay low, check doors for heat, use stairs not elevators, call emergency services
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">After Fire</h4>
                  <p className="text-muted-foreground">
                    Wait for all-clear, check for structural damage, avoid damaged areas
                  </p>
                </div>
              </div>
            </div>

            {/* Earthquake Safety */}
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center mr-4">
                  <Mountain className="h-6 w-6 text-teal-500" />
                </div>
                <h3 className="text-xl font-semibold text-teal-500">Earthquake Safety</h3>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Causes</h4>
                  <p className="text-muted-foreground">
                    Tectonic plate movement, fault line activity, volcanic activity
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Prevention</h4>
                  <p className="text-muted-foreground">
                    Secure heavy objects, create emergency kit, know safe spots in each room
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">During Earthquake</h4>
                  <p className="text-muted-foreground">
                    Drop, Cover, Hold On. Stay away from windows and heavy objects
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">After Earthquake</h4>
                  <p className="text-muted-foreground">
                    Check for injuries, inspect for damage, be prepared for aftershocks
                  </p>
                </div>
              </div>
            </div>

            {/* Flood Safety */}
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mr-4">
                  <Waves className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-green-500">Flood Safety</h3>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Causes</h4>
                  <p className="text-muted-foreground">
                    Heavy rainfall, dam failure, storm surge, rapid snowmelt
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Prevention</h4>
                  <p className="text-muted-foreground">
                    Know evacuation routes, keep emergency supplies, monitor weather alerts
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">During Flood</h4>
                  <p className="text-muted-foreground">
                    Move to higher ground, avoid walking/driving through flood water
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">After Flood</h4>
                  <p className="text-muted-foreground">
                    Avoid flood water, check for structural damage, clean and disinfect
                  </p>
                </div>
              </div>
            </div>

            {/* Cyclone Safety */}
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mr-4">
                  <Wind className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-orange-500">Cyclone Safety</h3>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Causes</h4>
                  <p className="text-muted-foreground">
                    Warm ocean waters, low pressure systems, atmospheric conditions
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Prevention</h4>
                  <p className="text-muted-foreground">
                    Monitor weather forecasts, secure outdoor items, prepare evacuation plan
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">During Cyclone</h4>
                  <p className="text-muted-foreground">
                    Stay indoors, away from windows, in strongest part of building
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">After Cyclone</h4>
                  <p className="text-muted-foreground">
                    Wait for all-clear, watch for flooding, avoid downed power lines
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Resources */}
      <section className="py-24 border-t border-border/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Emergency Resources</h2>
            <p className="text-lg text-muted-foreground">Important contacts and resources for disaster situations</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Emergency Services</h3>
              <div className="text-2xl font-bold text-red-500 mb-2">112</div>
              <p className="text-sm text-muted-foreground">Fire, Police, Medical</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Disaster Hotline</h3>
              <div className="text-lg font-bold text-green-500 mb-2">011-1070</div>
              <p className="text-sm text-muted-foreground">Disaster Relief</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Cloud className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Weather Service</h3>
              <div className="text-lg font-bold text-blue-500 mb-2">weather.gov</div>
              <p className="text-sm text-muted-foreground">Weather Alerts</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">FEMA</h3>
              <div className="text-lg font-bold text-gray-500 mb-2">fema.gov</div>
              <p className="text-sm text-muted-foreground">Preparedness Guide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Survivors */}
      <section className="pt-24 pb-12 border-t border-border/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Top Survivors</h2>
          <p className="text-lg text-muted-foreground mb-12">
            See how you rank against other disaster preparedness champions
          </p>

          <div className="bg-card border border-border rounded-lg p-12 mb-0">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Trophy className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold text-foreground">Leaderboard</span>
                <span className="text-sm text-muted-foreground">Top 10 highest scores</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLeaderboard(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                View All
              </Button>
            </div>

            <div className="py-12">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <p className="text-lg text-muted-foreground mb-8">No scores yet. Be the first to play!</p>
              <Button
                onClick={() => setShowGame(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Start Playing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-center items-center text-sm text-muted-foreground text-center">
            <p>Educational tool for disaster preparedness. Always follow official emergency guidelines.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
