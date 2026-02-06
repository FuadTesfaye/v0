# 🎮 Neon Syntax

**Neon Syntax** is a production-grade, browser-based programmable strategy game. Players write scripts in real-time to control units, manage resources, and outmaneuver opponents in a reactive, high-performance environment.

---

## 🚀 Tech Stack

The project is built with a modern, high-performance stack designed for low-latency game logic and premium UI interactions:

*   **Runtime & Package Manager**: [Bun](https://bun.sh/) — for lightning-fast installs and optimized script execution.
*   **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) — leveraging the latest React features and server-side optimizations.
*   **Language**: [TypeScript](https://www.typescriptlang.org/) — providing end-to-end type safety for game engine logic and UI components.
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) — modern, utility-first styling with high performance.
*   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) — lightweight and performant state for both game engine and UI.
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) — for smooth transitions, micro-interactions, and game effects.
*   **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/) (via `@monaco-editor/react`) — giving players a professional-grade IDE experience in-game.

---

## 📂 Folder Structure

The project follows a modular architecture that separates game engine logic from UI presentation:

```text
neon-syntax/
├── src/
│   ├── app/            # Next.js App Router (Routes & Layouts)
│   ├── components/     # Reusable UI component library
│   ├── config/         # Game constants and environment configuration
│   ├── engine/         # 🧠 Core Game Logic
│   │   ├── core/       # Game loop, state machine, and world logic
│   │   ├── systems/    # Modular systems (Combat, Movement, Resources)
│   │   └── validation/ # Intent & input validation
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and library wrappers
│   ├── store/          # Zustand store definitions (Global State)
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── types/          # Centralized TypeScript definitions
│   └── workers/        # 🛡️ Web Workers (Sandboxed User Script Execution)
├── public/             # Static assets (Images, Models, Audio)
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

---

## 🛠️ Key Libraries

| Library | Purpose |
| :--- | :--- |
| `zustand` | High-frequency game state synchronization. |
| `framer-motion` | Dynamic UI feedback and game animations. |
| `@monaco-editor/react` | The interface for player "Syntax" (coding). |
| `clsx` & `tailwind-merge` | Efficient Tailwind class management. |

---

## 🏃 Getting Started

1.  **Install Dependencies**:
    ```bash
    bun install
    ```

2.  **Start Development Server**:
    ```bash
    bun dev
    ```

3.  **Build for Production**:
    ```bash
    bun run build
    ```

---

## 🧩 Architectural Principles

*   **Headless Engine**: The game engine (`src/engine`) is decoupled from React, allowing for deterministic simulations.
*   **Sandboxed Execution**: Player code runs in isolated Web Workers (`src/workers`) to ensure security and prevent main-thread blocking.
*   **Reactive UI**: The UI reacts to state changes via Zustand stores, ensuring the interface stays in sync with the engine at all times.
