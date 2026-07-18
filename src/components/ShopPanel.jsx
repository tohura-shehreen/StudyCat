import { useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import {
  FishIcon,
  CloseIcon,
  CatsTabIcon,
  DecorationsTabIcon,
  AccessoriesTabIcon,
  FishTabIcon,
} from './Icons.jsx'
import './ShopPanel.css'

const TABS = [
  { id: 'cats', label: 'Cats' },
  { id: 'decorations', label: 'Decor' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'fish', label: 'Fish' },
]

export default function ShopPanel({ onClose }) {
  const [tab, setTab] = useState('cats')
  const {
    fish,
    cats,
    accessories,
    decorations,
    ownedCatIds,
    equippedCatId,
    ownedAccessoryIds,
    equippedAccessoryId,
    ownedDecorationIds,
    buyItem,
    equipCat,
    toggleAccessory,
  } = useStore()

  return (
    <div className="shop-overlay" onClick={onClose}>
      <div className="shop-panel" onClick={(e) => e.stopPropagation()}>
        <div className="shop-panel-header">
          <span className="shop-panel-title">
            <FishIcon /> {fish}
          </span>
          <button type="button" className="shop-close-btn" onClick={onClose} aria-label="Close shop">
            <CloseIcon />
          </button>
        </div>

        <div className="shop-content">
          {tab === 'cats' && (
            <ItemGrid>
              {cats.map((cat) => {
                const owned = ownedCatIds.includes(cat.id)
                const equipped = equippedCatId === cat.id
                return (
                  <ShopItem
                    key={cat.id}
                    name={cat.name}
                    preview={
                      <img
                        src={`/cats/${cat.id}/idle-none.gif`}
                        alt={cat.name}
                        className="shop-item-thumb"
                      />
                    }
                    price={cat.price}
                    owned={owned}
                    equipped={equipped}
                    canAfford={fish >= cat.price}
                    onBuy={() => buyItem('cat', cat)}
                    onEquip={() => equipCat(cat.id)}
                  />
                )
              })}
            </ItemGrid>
          )}

          {tab === 'decorations' && (
            <ItemGrid>
              {decorations.map((deco) => {
                const owned = ownedDecorationIds.includes(deco.id)
                return (
                  <ShopItem
                    key={deco.id}
                    name={deco.name}
                    preview={
                      <img
                        src={`/decorations/${deco.id}.png`}
                        alt={deco.name}
                        className="shop-item-thumb"
                      />
                    }
                    price={deco.price}
                    owned={owned}
                    equipped={owned}
                    equippedLabel="In room"
                    canAfford={fish >= deco.price}
                    onBuy={() => buyItem('decoration', deco)}
                    hideEquipButton
                  />
                )
              })}
              <p className="shop-hint">
                Owned decorations appear in your room — drag them anywhere on the floor.
              </p>
            </ItemGrid>
          )}

          {tab === 'accessories' && (
            <ItemGrid>
              {accessories.map((acc) => {
                const owned = ownedAccessoryIds.includes(acc.id)
                const equipped = equippedAccessoryId === acc.id
                return (
                  <ShopItem
                    key={acc.id}
                    name={acc.name}
                    preview={
                      <img src={`/accessories/${acc.id}.png`} alt={acc.name} className="shop-item-thumb" />
                    }
                    price={acc.price}
                    owned={owned}
                    equipped={equipped}
                    canAfford={fish >= acc.price}
                    onBuy={() => buyItem('accessory', acc)}
                    onEquip={() => toggleAccessory(acc.id)}
                  />
                )
              })}
            </ItemGrid>
          )}

          {tab === 'fish' && (
            <div className="shop-coming-soon">
              <FishIcon />
              <p>More fish varieties are coming soon.</p>
            </div>
          )}
        </div>

        <div className="shop-tab-strip">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`shop-tab${tab === t.id ? ' shop-tab--active' : ''}`}
              onClick={() => setTab(t.id)}
              title={t.label}
            >
              <TabIcon id={t.id} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ItemGrid({ children }) {
  return <div className="shop-grid">{children}</div>
}

function ShopItem({
  name,
  preview,
  price,
  owned,
  equipped,
  equippedLabel = 'Equipped',
  canAfford,
  onBuy,
  onEquip,
  hideEquipButton,
}) {
  return (
    <div className="shop-item">
      <div className="shop-item-preview">{preview}</div>
      <div className="shop-item-name">{name}</div>
      {owned ? (
        hideEquipButton ? (
          <span className="shop-item-tag">{equippedLabel}</span>
        ) : (
          <button
            type="button"
            className={`shop-item-btn${equipped ? ' shop-item-btn--equipped' : ''}`}
            onClick={onEquip}
          >
            {equipped ? equippedLabel : 'Equip'}
          </button>
        )
      ) : (
        <button type="button" className="shop-item-btn" disabled={!canAfford} onClick={onBuy}>
          {price} <FishIcon />
        </button>
      )}
    </div>
  )
}

function TabIcon({ id }) {
  if (id === 'cats') return <CatsTabIcon />
  if (id === 'decorations') return <DecorationsTabIcon />
  if (id === 'accessories') return <AccessoriesTabIcon />
  return <FishTabIcon />
}
