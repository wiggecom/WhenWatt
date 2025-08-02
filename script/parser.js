/**
 * One-shot entry: feed the raw string you pulled from localStorage or fetch.
 * – Normalises region codes (SE1 → "SE1"), converts strings → floats,
 *   and writes two stores in IndexedDB:
 *      • dailyCurrency   (one row per date)
 *      • regionPrices    (one row per region+date, values = Float32Array)
 */
async function ingest(rawString) {
  const dto = JSON.parse(rawString, reviver);   // <-- see next snippet
  const db  = await openIdb();

  // 1) currencies -----------------------------------------------------------
  db.transaction('dailyCurrency', 'readwrite')
    .objectStore('dailyCurrency')
    .put({
      date : dto.dailyCurrency.date.slice(0,10),   // "2025-06-11"
      ...dto.dailyCurrency                         // sek, dkk, eur, …
    });

  // 2) region prices --------------------------------------------------------
  const tx = db.transaction('regionPrices', 'readwrite');
  const store = tx.objectStore('regionPrices');
  const date = dto.dailyPrice.date.slice(0,10);

  Object.entries(dto.dailyPrice).forEach(([key, arr]) => {
    if (key === 'id' || key === 'date') return;
    const regionCode = key.toUpperCase();             // sE1 → SE1
    store.put({
      regionCode,
      date,
      // Typed array keeps memory low & makes math fast
      values: new Float32Array(arr)                   // 24 or 96 floats
    });
  });

  await tx.complete;
  console.log('🌱 IndexedDB seeded');
}



// Converts all numeric-looking strings to Number while parsing – 
// saves an extra walk over ~5 000 items.
function reviver(_, value) {
  if (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value))
    return parseFloat(value);
  return value;
}

function openIdb() {
  return new Promise((res, rej) => {
    const req = indexedDB.open('RegionData', 2);

    req.onupgradeneeded = e => {
      const db = e.target.result;

      if (!db.objectStoreNames.contains('dailyCurrency'))
        db.createObjectStore('dailyCurrency', { keyPath: 'date' });

      if (!db.objectStoreNames.contains('regionPrices')) {
        const rp = db.createObjectStore('regionPrices',
                     { keyPath: ['regionCode','date'] });
        rp.createIndex('byDate',    'date');
        rp.createIndex('byRegion',  'regionCode');
      }
    };

    req.onsuccess = () => res(req.result);
    req.onerror   = () => rej(req.error);
  });
}

async function getRates(date) {
  const db = await openIdb();
  return db.transaction('dailyCurrency')
           .objectStore('dailyCurrency')
           .get(date);
}

async function getRegion(date, code) {
  const db = await openIdb();
  const row = await db.transaction('regionPrices')
                      .objectStore('regionPrices')
                      .get([code.toUpperCase(), date]);
  // Turn the ArrayBuffer back into numbers only when you need them
  return row ? Array.from(row.values) : null;
}

