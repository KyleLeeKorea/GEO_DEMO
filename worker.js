const mongoose = require('mongoose');
const { parentPort, workerData } = require('worker_threads');

const { durationSeconds, batchSize } = workerData;

const uri = 'mongodb://localhost:27017/geo_benchmark';

const coordinateSchema = new mongoose.Schema({
  taxiId: String,
  status: { type: String, enum: ['available', 'occupied', 'offline'] },
  speed: Number,
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
  createdAt: { type: Date, default: Date.now }
});
coordinateSchema.index({ location: '2dsphere' });

const Coordinate = mongoose.model('Coordinate', coordinateSchema);

const SEOUL_CENTER = { lat: 37.5665, lng: 126.9780 };

function getRandomStatus() {
  const statuses = ['available', 'occupied', 'offline'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function getRandomTaxiId() {
  return 'TAXI-' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
}

function generateRandomSeoulCoordinate(radiusInMeters = 10000) {
  const radiusInDegrees = radiusInMeters / 111320;
  const u = Math.random();
  const v = Math.random();
  const w = radiusInDegrees * Math.sqrt(u);
  const t = 2 * Math.PI * v;

  const deltaLat = w * Math.cos(t);
  const deltaLng = w * Math.sin(t) / Math.cos(SEOUL_CENTER.lat * Math.PI / 180);

  const lat = SEOUL_CENTER.lat + deltaLat;
  const lng = SEOUL_CENTER.lng + deltaLng;

  return {
    type: 'Point',
    coordinates: [parseFloat(lng.toFixed(6)), parseFloat(lat.toFixed(6))]
  };
}

async function runWorker() {
  await mongoose.connect(uri);

  const endTime = Date.now() + durationSeconds * 1000;
  let inserted = 0;

  while (Date.now() < endTime) {
    const docs = [];
    for (let i = 0; i < batchSize; i++) {
      docs.push({
        taxiId: getRandomTaxiId(),
        status: getRandomStatus(),
        speed: Math.floor(Math.random() * 121),
        location: generateRandomSeoulCoordinate()
      });
    }

    await Coordinate.insertMany(docs);
    inserted += docs.length;

    parentPort.postMessage({ inserted: docs.length });
  }

  await mongoose.disconnect();
}

runWorker();
