import { useState } from "react";
import "./App.css";

const notes = [
  { id: 1, name: "FSD", file: "/notes/fsd.pdf" },
  { id: 2, name: "React", file: "/notes/react.pdf" },
  { id: 3, name: "JavaScript", file: "/notes/javascript.pdf" }
];

function App() {
  const [search, setSearch] = useState("");

  const filteredNotes = notes.filter((note) =>
    note.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="container">
      <h1>Notes Portal App</h1>

      <div className="search-box">
        <span aria-hidden="true">🔍</span>
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <section className="notes">
        {filteredNotes.length ? (
          filteredNotes.map((note) => (
            <article className="note" key={note.id}>
              <h2>{note.name}</h2>
              <a href={note.file} download className="download">
                Download
              </a>
            </article>
          ))
        ) : (
          <p className="no-results">No notes found</p>
        )}
      </section>
    </main>
  );
}

export default App;
