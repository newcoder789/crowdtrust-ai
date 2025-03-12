from pymongo import MongoClient
from datetime import datetime

URI = os.getenv("MONGODB_URI")

def seed_data():
    client = MongoClient(URI)
    try:
        client.admin.command('ping')  # Test connection
        db = client['crowdtrust_ai']
        campaigns = db['campaigns']

        campaigns.delete_many({})

        campaigns.insert_many([
            {
                'name': 'Rebuilding Rural Schools',
                'description': 'Help us renovate schools in rural areas.',
                'detail': 'Many rural schools lack proper infrastructure.',
                'owner': '0x7dB6DC9205d3bF205B7664Be75aE203af5d2Adc0',
                'contractAddress': '0x4086b8355a9a82f2970b39BfDaeCD17928ab064B',
                'uiImage': 'https://via.placeholder.com/300?text=School',
                'aiCheckImage': 'https://via.placeholder.com/300?text=Proof',
                'goal': 100,
                'fraudReported': False,  # Native Python bool
                'fraudNo': 0,
                'CreatedAt': datetime.utcnow(),
                'aiComment': 'Looks legit—nice pitch!',
                'trustScore': 70
            },
            {
                'name': 'Quick Cash Scheme',
                'description': 'Invest now for guaranteed returns!',
                'detail': 'Send money and get rich quick.',
                'owner': '0x5678efgh',
                'contractAddress': '0x4086b8355a9a82f2970b39BfDaeCD17928ab064B',
                'uiImage': 'https://via.placeholder.com/300?text=Scam',
                'aiCheckImage': 'https://via.placeholder.com/300?text=Proof',
                'goal': 50,
                'fraudReported': True,  # Native Python bool
                'fraudNo': 0,
                'CreatedAt': datetime.utcnow(),
                'aiComment': 'This smells like a scam, fam!',
                'trustScore': 30
            },
        ])
        print('Data seeded!')
    except Exception as e:
        print(f'Error seeding data: {e}')
    finally:
        client.close()

def upload_campaign(campaign_data):
    client = MongoClient(URI)
    try:
        client.admin.command('ping')
        db = client['crowdtrust_ai']
        campaigns = db['campaigns']
        result = campaigns.insert_one(campaign_data)
        print(result)
        return str(result.insertedId)
    except Exception as e:
        print(f'Error uploading campaign: {e}')
        return None
    finally:
        client.close()

if __name__ == '__main__':
    seed_data()
