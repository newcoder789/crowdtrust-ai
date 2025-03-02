import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://iamlearning:4myself784378@aryan0.xzmhc.mongodb.net/crowdtrust_ai';
const client = new MongoClient(uri);

async function seedData() {
  try {
    await client.connect();
    const db = client.db('crowdtrust_ai');
    const campaigns = db.collection('campaigns');

    await campaigns.deleteMany({});

    await campaigns.insertMany([
      {
        name: 'Rebuilding Rural Schools',
        description: 'Help us renovate schools in rural areas.',
        detail: 'Many rural schools lack proper infrastructure.',
        owner: '0x7dB6DC9205d3bF205B7664Be75aE203af5d2Adc0',
        contractAddress: '0x4086b8355a9a82f2970b39BfDaeCD17928ab064B',
        uiImage: 'https://via.placeholder.com/300?text=School',
        aiCheckImage: 'https://via.placeholder.com/300?text=Proof',
        goal: 100,
        fraudReported: false,
        fraudNo: 0,
        CreatedAt: new Date(),
        aiComment: 'Looks legit—nice pitch!',
        trustScore: 70
      },
      {
        name: 'Quick Cash Scheme',
        description: 'Invest now for guaranteed returns!',
        detail: 'Send money and get rich quick.',
        owner: '0x5678efgh',
        contractAddress: '0x4086b8355a9a82f2970b39BfDaeCD17928ab064B',
        uiImage: 'https://via.placeholder.com/300?text=Scam',
        aiCheckImage: 'https://via.placeholder.com/300?text=Proof',
        goal: 50,
        fraudReported: true,
        fraudNo: 0,
        CreatedAt: new Date(),
        aiComment: 'This smells like a scam, fam!',
        trustScore: 30
      },
    ]);

    console.log('Data seeded!');
  } finally {
    await client.close();
  }
}

seedData().catch(console.error);