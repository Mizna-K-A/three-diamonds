import connectDB from './lib/mongodb.js';
import Property from './lib/models/Property.js';

async function run() {
  await connectDB();
  const properties = await Property.find({ proposalPdf: { $ne: '' } });
  console.log('Properties with PDFs:', properties.length);
  for (const p of properties) {
    console.log(p.title, p.proposalPdf);
  }
}
run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
