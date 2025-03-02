import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://iamlearning:4myself784378@aryan0.xzmhc.mongodb.net/crowdtrust_ai';
const client = new MongoClient(uri);

async function uploadCampaign(campaign) {
  try {
    await client.connect();
    const db = client.db('crowdtrust_ai');
    const campaigns = db.collection('campaigns');

    const result = await campaigns.insertOne(campaign);
    console.log('Campaign inserted with ID:', result.insertedId);
    return result.insertedId;
  } finally {
    await client.close();
  }
}

// const campaign = {
//   name: 'Rebuilding Rural Schools',
//   description: 'Help us renovate schools in rural areas.',
//   detail: 'Many rural schools lack proper infrastructure.',
//   owner: '0x7dB6DC9205d3bF205B7664Be75aE203af5d2Adc0',
//   contractAddress: '0x4086b8355a9a82f2970b39BfDaeCD17928ab064B',
//   uiImage: 'http://localhost:5000/school_image',
//   aiCheckImage: 'http://localhost:5000/proof_image',
//   goal: 100,
//   fraudReported: false,
//   fraudNo: 0,
//   CreatedAt: new Date(),
//   aiComment: 'Looks legit—nice pitch!',
//   trustScore: 70
// };

uploadCampaign(campaign).catch(console.error);
