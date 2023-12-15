import { CharacterViewer } from '@/features/character-viewer'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative flex place-items-center">
        <h1>VRM Sandbox</h1>
      </div>

      <CharacterViewer />
    </main>
  )
}
