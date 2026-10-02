export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col">
        <h1 className="text-4xl font-bold mb-4">LOVE</h1>
        <h2 className="text-2xl mb-8">Library of Volunteer Experiences</h2>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Repository Successfully Initialized</strong>
        </div>
      </div>
    </main>
  );
}
