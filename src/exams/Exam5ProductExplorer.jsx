import { memo, useCallback, useEffect, useMemo, useState } from 'react';

const CATEGORIES = ['Electronics', 'Books', 'Clothing', 'Home', 'Sports', 'Toys'];
const ADJECTIVES = ['Compact', 'Deluxe', 'Eco', 'Smart', 'Classic', 'Pro', 'Ultra', 'Mini'];
const NOUNS = {
  Electronics: ['Speaker', 'Charger', 'Headset', 'Monitor'],
  Books: ['Handbook', 'Novel', 'Atlas', 'Journal'],
  Clothing: ['Jacket', 'Shirt', 'Cap', 'Socks'],
  Home: ['Lamp', 'Chair', 'Kettle', 'Shelf'],
  Sports: ['Racket', 'Ball', 'Bottle', 'Mat'],
  Toys: ['Puzzle', 'Robot', 'Blocks', 'Kite'],
};

// Small seeded PRNG so the generated data is identical on every run.
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateProducts(count) {
  const random = mulberry32(2026);
  return Array.from({ length: count }, (_, index) => {
    const category = CATEGORIES[Math.floor(random() * CATEGORIES.length)];
    const adjective = ADJECTIVES[Math.floor(random() * ADJECTIVES.length)];
    const noun = NOUNS[category][Math.floor(random() * NOUNS[category].length)];
    return {
      id: index + 1,
      name: `${adjective} ${noun} #${index + 1}`,
      category,
      price: Math.round((5 + random() * 495) * 100) / 100,
    };
  });
}

// Generated once, outside the component: 600 records (requirement: at least 500).
const PRODUCTS = generateProducts(600);

/**
 * Memoized child. It re-renders only when `products`, `selectedId` or
 * `onSelect` change identity. The commit log below is written in an effect so
 * React StrictMode's double render cannot inflate the evidence.
 */
const ProductList = memo(function ProductList({ products, selectedId, onSelect }) {
  useEffect(() => {
    console.log(`[ProductList] committed a render (${products.length} products)`);
  });

  return (
    <div className="scroll">
      <ul className="list">
        {products.map((product) => (
          <li
            key={product.id}
            className={product.id === selectedId ? 'product-row selected' : 'product-row'}
            onClick={() => onSelect(product.id)}
          >
            <span className="grow">{product.name}</span>
            <span className="muted">{product.category}</span>
            <strong>${product.price.toFixed(2)}</strong>
          </li>
        ))}
        {products.length === 0 && <li className="muted">No products match.</li>}
      </ul>
    </div>
  );
});

export default function Exam5ProductExplorer() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('none'); // 'none' | 'asc' | 'desc'
  const [selectedId, setSelectedId] = useState(null);
  const [counter, setCounter] = useState(0); // unrelated state used to test needless work

  // Memoized calculation. Dependency array lists every value it reads, so it
  // reruns when search, category or sort order change — and NOT for `counter`.
  // (DEBUG FIX: `query` was missing from the array, which showed stale results.)
  const visibleProducts = useMemo(() => {
    const text = query.trim().toLowerCase();
    const filtered = PRODUCTS.filter(
      (product) =>
        (category === 'All' || product.category === category) &&
        (text === '' || product.name.toLowerCase().includes(text))
    );
    if (sortOrder === 'asc') return [...filtered].sort((a, b) => a.price - b.price);
    if (sortOrder === 'desc') return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [query, category, sortOrder]);

  // Memoized selection callback. It reads `selectedId` (clicking the selected
  // row again clears it), so `selectedId` is a required dependency.
  // (DEBUG FIX: without it the callback kept using the old selection.)
  // It stays stable while the unrelated counter changes.
  const handleSelect = useCallback(
    (id) => {
      setSelectedId(selectedId === id ? null : id);
    },
    [selectedId]
  );

  // Side effects belong in useEffect, not useMemo. (DEBUG FIX: the analytics
  // call used to live inside the useMemo callback.)
  useEffect(() => {
    console.log('[analytics] explorer_filter_changed', {
      query,
      category,
      sortOrder,
      results: visibleProducts.length,
    });
  }, [query, category, sortOrder, visibleProducts]);

  // Evidence that the expensive result is only recomputed for its true inputs.
  useEffect(() => {
    console.log(`[useMemo] visibleProducts recomputed -> ${visibleProducts.length} items`);
  }, [visibleProducts]);

  const selectedProduct = PRODUCTS.find((product) => product.id === selectedId) ?? null;

  return (
    <section aria-labelledby="exam5-title">
      <h2 id="exam5-title">Product Explorer Performance Repair</h2>
      <p className="muted">Open the browser console to see render and recompute evidence.</p>

      <div className="row">
        <label htmlFor="product-search">Search</label>
        <input
          id="product-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="e.g. lamp"
        />

        <label htmlFor="product-category">Category</label>
        <select id="product-category" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="All">All</option>
          {CATEGORIES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <label htmlFor="product-sort">Price</label>
        <select id="product-sort" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
          <option value="none">Default order</option>
          <option value="asc">Low to high</option>
          <option value="desc">High to low</option>
        </select>
      </div>

      <div className="row">
        <button className="btn secondary" type="button" onClick={() => setCounter((c) => c + 1)}>
          Unrelated counter: {counter}
        </button>
        <span className="muted">
          {visibleProducts.length} of {PRODUCTS.length} products
          {selectedProduct ? ` · selected: ${selectedProduct.name}` : ''}
        </span>
      </div>

      <ProductList products={visibleProducts} selectedId={selectedId} onSelect={handleSelect} />

      <details>
        <summary>Debugging cases and when memoization is unnecessary</summary>
        <ol>
          <li>
            <strong>Stale useMemo.</strong> A missing <code>query</code> dependency means the list keeps
            the result computed for an old query. Add it to the array.
          </li>
          <li>
            <strong>Outdated useCallback.</strong> The callback reads <code>selectedId</code>; without it
            in the array the function keeps the first render's value. Add the dependency.
          </li>
          <li>
            <strong>Analytics in useMemo.</strong> useMemo must be a pure calculation (React may call it
            twice or discard the result). Logging or network calls are side effects and go in{' '}
            <code>useEffect</code>.
          </li>
        </ol>
        <p>
          <strong>Unnecessary memoization:</strong> filtering a list of 10 items, or computing{' '}
          <code>price * quantity</code>, takes microseconds. The bookkeeping of useMemo (comparing
          dependencies, storing the cached value) costs about as much as the calculation, so memoizing
          adds complexity with no measurable benefit.
        </p>
      </details>
    </section>
  );
}
