
# Neon Syntax - Cloud-Native Strategy Game

This is a **deterministic, server-authoritative** strategy game engine built on a **Serverless-First** architecture.
It uses a "Lazy Simulation" model where game state is computed on-demand via API calls, making it perfectly suited for **Vercel** and **GCP Cloud Run**.

## Architecture

- **Engine**: Pure functional simulation logic (`src/engine`).
- **State**: Lazy evaluation (Time Delta + Actions = Next State).
- **API**: Next.js App Router endpoints acting as the authoritative server.
- **Frontend**: HTML5 Canvas visualization with polling-based sync.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000/play](http://localhost:3000/play) to start a new game session.

## Deployment on Vercel

1. **Push to GitHub**:
   Initialize a git repo and push this codebase.

2. **Import to Vercel**:
   - Go to Vercel Dashboard -> Add New Project.
   - Select your repository.
   - Framework Preset: **Next.js**.
   - Click **Deploy**.

3. **Persistence (Production)**:
   The current version uses an **In-Memory Store** for simplicity. For persistent multiplayer games in production, swap `src/app/api/game/store.ts` to use:
   - **Vercel KV (Redis)**
   - **Firestore**
   - **PostgreSQL**

## Project Structure

```
src/
├── engine/           # Core Simulation Logic (Platform Agnostic)
│   ├── types.ts      # Game Entities (Node, Edge, Player)
│   ├── simulation.ts # Deterministic State Machine
│   └── schema.ts     # Validation Logic
├── app/
    ├── api/game/     # Serverless Authoritative Endpoints
    └── play/         # Client-Side Game Visualizer
```
