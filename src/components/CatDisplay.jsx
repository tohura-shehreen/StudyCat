// ---------------------------------------------------------------------------
// Renders the real StudyCat sprite. Every cat needs six files at
// /public/cats/<id>/<state>-<accessory>.gif:
//   idle-none.gif       idle-pink-bow.gif
//   studying-none.gif   studying-pink-bow.gif
//   break-none.gif      break-pink-bow.gif
//
// To add a new cat: drop the same six files in a new /public/cats/<id>/
// folder and add one entry to CATS in src/data/constants.js — no code
// changes needed here.
// ---------------------------------------------------------------------------
import './CatDisplay.css'

export default function CatDisplay({ catId, state = 'idle', hasBow = false, size = 220 }) {
  const accessorySuffix = hasBow ? 'pink-bow' : 'none'
  const src = `/cats/${catId}/${state}-${accessorySuffix}.gif`

  return (
    <div className="cat-display" style={{ width: size, height: size }}>
      <img src={src} alt="" className="cat-sprite" draggable={false} />
    </div>
  )
}
