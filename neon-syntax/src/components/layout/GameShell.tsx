export default function GameShell() {
    return (
        <div className="flex h-screen w-full flex-col">
            <div className="flex flex-1">
                <aside className="w-64 border-r">Sidebar Area</aside>
                <main className="flex-1 overflow-hidden relative">Grid Area</main>
            </div>
            <footer className="h-32 border-t text-sm">Bottom Console</footer>
        </div>
    );
}
