import { useState, type FormEvent } from 'react'
import { supabase } from './supabase'
import './App.css'

type Dinosaur = {
  id: number
  name: string
  scientific_name: string
  name_meaning: string
  period: string
  diet: string

  age_oldest_mya: number
  age_youngest_mya: number
  classification: string

  length_min_m: number
  length_max_m: number
  height_min_m: number
  height_max_m: number

  fossil_locations: string
  ancient_region: string

  notable_traits: string
  fun_fact: string

  image_url: string | null
  image_creator: string | null
  image_source: string | null
  image_license: string | null
}

function metersToFeet(meters: number) {
  return meters * 3.28084
}

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [dinosaurs, setDinosaurs] = useState<Dinosaur[]>([])

  async function searchArchive(term: string) {
  const trimmedSearch = term.trim()

  if (!trimmedSearch) {
    return
  }

  const { data, error } = await supabase
    .from('dinosaurs')
    .select('*')
    .or(
      `name.ilike.%${trimmedSearch}%,scientific_name.ilike.%${trimmedSearch}%,classification.ilike.%${trimmedSearch}%,diet.ilike.%${trimmedSearch}%,period.ilike.%${trimmedSearch}%`
    )

  if (error) {
    console.error(error)
    return
  }

  setDinosaurs(data ?? [])
}

async function handleSearch(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  await searchArchive(searchTerm)
}

  return (
    <main>
      <header className="site-header">
        <p className="collection-label">The Prehistoric Archive</p>

        <h1>FossilFinder</h1>

        <p className="site-tagline">
          Explore the lost world of prehistoric life.
        </p>

        <div className="header-ornament">
          <span></span>
          <span className="ornament-diamond">◆</span>
          <span></span>
        </div>
      </header>

      <section className="search-card">
        <form className="archive-search" onSubmit={handleSearch}>
          <input
            className="archive-input"
            type="text"
            placeholder="Search the archive..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <button className="archive-button" type="submit">
            Search
          </button>
        </form>
      </section>

      {dinosaurs.map((dinosaur) => (
        <section className="specimen-card" key={dinosaur.id}>
          <header className="specimen-header">
            <p className="archive-label">Specimen Archive</p>

            <h2>{dinosaur.name}</h2>

            <p className="name-meaning">
              “{dinosaur.name_meaning}”
            </p>

            <p className="era-line">
              {dinosaur.period}
              <span> • </span>
              {dinosaur.age_oldest_mya}–{dinosaur.age_youngest_mya} MYA
            </p>
          </header>

          <div className="specimen-divider" />

          <section className="specimen-section">
            <h3>Classification</h3>

            <div className="fact-grid">
              <article>
                <span className="fact-label">Scientific Name</span>
                <strong>{dinosaur.scientific_name}</strong>
              </article>

              <article>
                <span className="fact-label">Diet</span>
                <strong>{dinosaur.diet}</strong>
              </article>

              <article>
                <span className="fact-label">Group</span>
                <strong>{dinosaur.classification}</strong>
              </article>
            </div>
          </section>

          <section className="specimen-section">
            <h3>Estimated Size</h3>

            <div className="fact-grid">
              <article>
                <span className="fact-label">Length</span>

                <strong>
                  {dinosaur.length_min_m}–{dinosaur.length_max_m} m{' '}
                  (
                  {metersToFeet(dinosaur.length_min_m).toFixed(0)}
                  –
                  {metersToFeet(dinosaur.length_max_m).toFixed(0)}
                  ft
                  )
                </strong>
              </article>

              <article>
                <span className="fact-label">Height</span>

                <strong>
                  {dinosaur.height_min_m}–{dinosaur.height_max_m} m{' '}
                  (
                  {metersToFeet(dinosaur.height_min_m).toFixed(1)}
                  –
                  {metersToFeet(dinosaur.height_max_m).toFixed(1)}
                  ft
                  )
                </strong>
              </article>
            </div>
          </section>

          <section className="specimen-section">
            <h3>Range</h3>

            <p>
              <strong>Fossil Locations:</strong>{' '}
              {dinosaur.fossil_locations}
            </p>

            <p>
              <strong>Ancient Region:</strong>{' '}
              {dinosaur.ancient_region}
            </p>
          </section>

          <section className="specimen-section">
            <h3>Notable Traits</h3>

            <ul className="trait-list">
              {dinosaur.notable_traits
                .split(';')
                .map((trait) => (
                  <li key={trait.trim()}>
                    {trait.trim()}
                  </li>
                ))}
            </ul>
          </section>

          <aside className="archive-note">
            <p className="archive-label">From the Archives</p>
            <p>{dinosaur.fun_fact}</p>
          </aside>
        </section>
      ))}
    </main>
  )
}

export default App