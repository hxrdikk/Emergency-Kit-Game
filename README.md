<!-- ~welcome note -->
<p align="center">
    <img src="https://readme-typing-svg.herokuapp.com/?font=Righteous&size=35&center=true&vCenter=true&width=500&height=70&duration=4000&lines=Hello+there!;Welcome+to+my+Project!" />
</p>

<div style="margin-top:12px;"></div> 

<!-- ~about this project -->
<h3 align="left"> ✨ About this project:</h3>

<div style="margin-top:12px;"></div> 

- Emergency Kit Game is a Next.js + TypeScript web game that helps players learn which items matter during emergencies (first-aid, water, flashlight, mask, etc.) through a timed packing challenge.

- Players choose items from a list, build an emergency kit, and are scored on correctness, speed, and completeness. The game includes sound & animation for engagement, a scoring/leaderboard system, and modular components so it’s easy to extend.

 <!-- ~gameplay overview -->
<h3 align="left"> 🎯 Gameplay Overview: </h3>

~ In the Emergency Kit Game, players race against a timer to pack the correct survival items for a given disaster scenario. Each level presents a mix of essential and misleading items, challenging players to think quickly and choose wisely. Correct selections boost the score, while wrong choices reduce it. With faster timers and more complex scenarios as the game progresses, players sharpen their disaster-preparedness skills through quick, engaging decision-making.

<!-- ~technical overview -->
<h3 align="left"> 🧠 Technical Overview: </h3>

A. Tech Stack: The Emergency Kit Game is built with Next.js and TypeScript for speed and scalability, styled with TailwindCSS for a clean and responsive UI. React components and custom hooks power the interactive gameplay, while Vercel provides fast, seamless deployment and hosting.

- Next.js (App Router) + TypeScript
- React for UI components
- TailwindCSS for styling
- Canvas / DOM animations for interactive elements
- Vercel-friendly deployment configuration

B. Game Engine:The Emergency Kit Game runs on a lightweight, scenario-based logic engine that randomizes item pools, evaluates player choices, and calculates scores in real time.

- Timed scenario-based challenges with randomized item pools per level.
- Scoring logic that weights items by importance for each disaster type.
- Modular components for scenarios, items, timer, and leaderboard.

C. Core Features: At the heart of the Emergency Kit Game is a scenario-driven challenge system that randomizes item choices to keep every round fresh and unpredictable. Smart scoring logic rewards essential picks and penalizes mistakes, while quick feedback, smooth animations, and responsive interactions make the experience fast and engaging. With a built-in timer, dynamic difficulty, and a competitive leaderboard, the game encourages replayability and helps players sharpen real-world emergency preparedness skills.

<!-- ~installation & usage -->
<h3 align="left"> ⚙️ Installation & Usage:</h3>

1. Clone the Repository
```bash
git clone https://github.com/hxrdikk/Emergency-Kit-Game.git
cd Emergency-Kit-Game
```

2. Install Dependencies
```bash
pnpm install
```

3. Run Development Server
```bash
pnpm dev
```

4. Build for Production
```bash
pnpm build
pnpm start
```

<!-- ~deployment -->
<h3 align="left"> 🚀 Deployment:</h3>

~ Emergency Kit Game is currently deployed on Vercel → <a href="https://emergency-kit-game.vercel.app" target="_blank">emergency-kit-game.vercel.app</a>

- Deploy your own instance:

    - Push the repo to GitHub.
    - Import the repository into Vercel.
    - Configure any build settings (Next.js automatic settings usually suffice).
    - Add environment variables (if you add APIs later).
    - Click Deploy.

<!-- ~project structure -->
<h3 align="left"> 🏗 Project Structure:</h3>

```
Emergency-Kit-Game/
├── app/               # Next.js App Router pages
│   ├── page.tsx       # Home / landing
│   ├── game/          # Game screens and logic
│   └── leaderboard/   # Leaderboard pages
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks (timer, sound, scoring)
├── lib/               # Utility functions (scoring, scenarios)
├── public/            # Static assets (icons, sounds, images)
├── styles/            # Global and component styles
├── package.json
├── pnpm-lock.yaml
└── README.md
```

<!-- ~features -->
<h3 align="left"> 🏆 Features:</h3>

- Scenario-based emergency challenges  
- Randomized item pools each round  
- Smart scoring and penalty system  
- Teaches real-world preparedness  
- Leaderboard to track high scores  
- Smooth UI, animations, and sound effects  

<!-- ~author -->
<h3 align="left"> 👨‍💻 Author:</h3>

- Hardik Jain

<!-- ~license -->
<h3 align="left"> 📜 License:</h3>

- This project is open-source and available under the [MIT License](LICENSE).
