import GameManager from "./components/GameManager";

function App() {
  return (
    <main className={"flex flex-col items-center justify-between mx-auto"}>
      <h1 className="text-4xl font-bold p-8 text-slate-50">Fugue State</h1>

      <GameManager />
    </main>
  );
}

export default App;
