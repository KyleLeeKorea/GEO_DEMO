const { Worker } = require('worker_threads');

const durationSeconds = parseInt(process.argv[2], 10);
const batchSize = parseInt(process.argv[3], 10) || 100;
const numWorkers = parseInt(process.argv[4], 10) || 2;

if (isNaN(durationSeconds) || durationSeconds <= 0) {
  console.error('Please provide duration in seconds. Example: node benchmarkSeoulMulti.js 10 100 4');
  process.exit(1);
}

let totalInserted = 0;
const startTime = Date.now();
const endTime = startTime + durationSeconds * 1000;
let runningWorkers = 0;

function getTimeStamp() {
  const now = new Date();
  return now.toTimeString().split(' ')[0];
}

console.log(`Starting benchmark for ${durationSeconds} seconds with ${numWorkers} workers...`);

const interval = setInterval(() => {
  const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  if (elapsedSeconds === 0) return;
  const avgTPS = (totalInserted / elapsedSeconds).toFixed(2);
  console.log(`[${getTimeStamp()}] Inserted: ${totalInserted} docs | Avg TPS: ${avgTPS}`);
}, 1000);

for (let i = 0; i < numWorkers; i++) {
  const worker = new Worker('./worker.js', {
    workerData: { durationSeconds, batchSize }
  });

  runningWorkers++;

  worker.on('message', (msg) => {
    if (msg.inserted) {
      totalInserted += msg.inserted;
    }
  });

  worker.on('exit', () => {
    runningWorkers--;
    if (runningWorkers === 0) {
      clearInterval(interval);
      const elapsed = (Date.now() - startTime) / 1000;
      const finalTPS = (totalInserted / elapsed).toFixed(2);
      console.log('\nInsert complete.');
      console.log(`Total inserted: ${totalInserted}`);
      console.log(`Time taken: ${elapsed.toFixed(2)} seconds`);
      console.log(`Final Throughput: ${finalTPS} docs/sec`);
    }
  });
}
