const mongoose = require('mongoose');

const durationSeconds = parseInt(process.argv[2], 10);
const batchSize = parseInt(process.argv[3], 10) || 100;

if (isNaN(durationSeconds) || durationSeconds <= 0) {
  console.error('Please provide a valid duration in seconds. Example: node benchmarkSeoul.js 10 100');
  process.exit(1);
}
if (isNaN(batchSize) || batchSize <= 0) {
  console.error('Please provide a valid batch size. Example: node benchmarkSeoul.js 10 100');
  process.exit(1);
}

const uri = 'mongodb://localhost:27017/geo_seoul';

const coordinateSchema = new mongoose.Schema({
  taxiId: String,
  status: { type: String, enum: ['available', 'occupied', 'offline'] },
  speed: Number, // km/h
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

function getTimeStamp() {
  const now = new Date();
  return now.toTimeString().split(' ')[0]; // HH:MM:SS
}

async function runInsertTest() {
  await mongoose.connect(uri);
  console.log(`Connected to MongoDB`);
  
  const existingCount = await Coordinate.countDocuments();
  console.log(`Existing documents: ${existingCount}`);
  console.log(`Inserting taxi location data for ${durationSeconds} seconds with batch size ${batchSize}...\n`);

  let insertedCount = 0;
  const startTime = Date.now();
  const endTime = startTime + durationSeconds * 1000;

  const interval = setInterval(() => {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    if (elapsedSeconds === 0) return;
    const avgTPS = (insertedCount / elapsedSeconds).toFixed(2);
    console.log(`[${getTimeStamp()}] Inserted: ${insertedCount} docs | Avg TPS: ${avgTPS}`);
  }, 1000);

  while (Date.now() < endTime) {
    const docs = [];
    for (let i = 0; i < batchSize; i++) {
      docs.push({
        taxiId: getRandomTaxiId(),
        status: getRandomStatus(),
        speed: Math.floor(Math.random() * 121), // 0~120km/h
        location: generateRandomSeoulCoordinate()
      });
    }

    await Coordinate.insertMany(docs);
    insertedCount += docs.length;
  }

  clearInterval(interval);

  const endTimeActual = Date.now();
  const elapsedSeconds = (endTimeActual - startTime) / 1000;
  const finalCount = await Coordinate.countDocuments();
  const tps = (insertedCount / elapsedSeconds).toFixed(2);

  console.log(`\nInsert complete.`);
  console.log(`Documents inserted: ${insertedCount}`);
  console.log(`Time taken: ${elapsedSeconds.toFixed(2)} seconds`);
  console.log(`Final Throughput: ${tps} docs/sec`);
  console.log(`Total documents in collection: ${finalCount}`);

  await mongoose.disconnect();
}

runInsertTest().catch(err => {
  console.error('Error during insert:', err);
  process.exit(1);
});
