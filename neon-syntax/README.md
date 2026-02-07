
# Neon Syntax - Tactical Coding Strategy Game

**Neural Interface Initiated... Welcome to the Grid.**

Neon Syntax is a futuristic, cyberpunk-themed real-time strategy game where **code is your weapon**. In a world governed by algorithms, you must program your units to outmaneuver, outsmart, and delete your enemies. It bridges the gap between tactical gaming and educational coding, offering a compelling narrative and a deep, strategic experience.

![Project Banner](public/banner.png) *Note: Add a banner image if available*

## 🌌 The Vision

The core idea behind Neon Syntax is to make programming tangible and exciting. Instead of writing code to print "Hello World", you write code to:
- **Flank** enemy positions.
- **Optimize** energy consumption.
- **Coordinate** multi-unit strikes.
- **Hack** into sector mainframes.

It caters to both experienced developers who want to optimize their combat algorithms and beginners who want to learn logic in a high-stakes, visual environment.

## 🎮 Gameplay Mechanics

### 1. Programmable Units
You don't directly control units with a mouse. You send them **Scripts**.
- **Scout Bot**: Fast, low health. Good for recon.
- **Assault Bot**: Heavy damage, slow. Needs logic to get into range.
- **Support Bot**: Heals and repairs. Needs logic to prioritize damaged allies.

### 2. The Syntax
The game uses a sandboxed, JavaScript-like syntax. You have access to a custom API:
```javascript
// Example Unit Script
if (sensor.scan('enemy').length > 0) {
    const target = sensor.getNearest('enemy');
    if (weapon.canFire(target)) {
        weapon.fire(target);
    } else {
        motor.moveTo(target.position);
    }
} else {
    motor.patrol(path);
}
```

### 3. Campaign & Sectors
Progress through different "Sectors" (levels), each introducing new coding concepts:
- **Sector 7 (Tutorial)**: Basic movement and loops.
- **The Core**: Conditionals and boolean logic.
- **Dark Web**: Functions, arrays, and optimization obstacles.

## 🏗 System Architecture

Neon Syntax is built on a **Server-Authoritative, Deterministic** model.

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Framer Motion.
- **Code Editor**: Monaco Editor (VS Code engine).
- **State Management**: Zustand.
- **Simulation Engine**: Custom deterministic engine (see `src/engine`).
- **Deployment**: Optimized for Vercel (Edge/Serverless).

### The "Lazy Simulation" Model
To stay cost-effective and scalable, the game server doesn't run a continuous loop. Instead, it calculates the state **on-demand**.
1. **Client** sends an Action (e.g., "Upload Script").
2. **Server** calculates the simulation result for `Delta Time`.
3. **Server** returns the new Game State.
4. **Client** visualizes the state interpolation.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/neon-syntax.git
   cd neon-syntax
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Initialize the Link:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── algowars/        # Main game entry
│   ├── api/             # Backend API routes
│   └── page.tsx         # Landing page
├── components/          # React components
│   ├── landing/         # Landing page specific blocks
│   ├── mvpblocks/       # Reusable UI blocks (FAQ, About, Features)
│   └── ui/              # Shadcn/Radix UI primitives
├── engine/              # Core game simulation logic (Environment agnostic)
├── lib/                 # Utilities and helpers
└── styles/              # Global styles
```

## 🤝 Contributing

Protocol 7 dictates that all improvements to the system must be peer-reviewed.
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*System Status: ONLINE*
