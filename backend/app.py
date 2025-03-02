from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.compose import ColumnTransformer
import os
import csv
import ast
import pandas as pd
import json
from datetime import datetime

app = Flask(__name__)
# Wildcard CORS - allow all origins
CORS(app, resources={r"/*": {"origins": "*"}})

# MongoDB setup
client = MongoClient('mongodb+srv://iamlearning:4myself784378@aryan0.xzmhc.mongodb.net/crowdtrust_ai')
db = client['crowdtrust_ai']
campaigns_collection = db['campaigns']
fraud_reports_collection = db['fraud_reports']

# Load training data from CSV
train_data = []
try:
    with open('crowdfunding_data.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            row['withdrawal_history'] = ast.literal_eval(row['withdrawal_history'])
            row['donor_history'] = ast.literal_eval(row['donor_history'])
            row['raised_funds'] = int(row['raised_funds'])
            row['proposal_amount'] = int(row['proposal_amount'])
            row['verification_status'] = int(row['verification_status'])
            row['label'] = int(row['label'])
            train_data.append(row)
except FileNotFoundError:
    print("Error: crowdfunding_data.csv not found. Please generate it first.")
    exit(1)

# Feature engineering
def extract_features(data):
    text = f"{data.get('campaign_text', '')} {data.get('proposal_reason', '')} {data.get('appeal_response', '')}"
    raised_funds = data.get('raised_funds', 0) or 1
    donor_history = data.get('donor_history', [])
    withdrawal_history = data.get('withdrawal_history', [])
    return {
        "text": text,
        "proposal_ratio": data.get('proposal_amount', 0) / raised_funds,
        "max_donation_ratio": max([d['amount'] for d in donor_history] + [0]) / raised_funds,
        "withdrawal_count": len(withdrawal_history),
        "withdrawal_ratio": sum([w['amount'] for w in withdrawal_history]) / raised_funds if withdrawal_history else 0,
        "verification_status": 1 if data.get('verification_status', False) else 0,
        "appeal_present": 1 if data.get('appeal_response', '') else 0
    }

# Prepare training data as a pandas DataFrame
X_train = [extract_features(d) for d in train_data]
y_train = [d['label'] for d in train_data]
X_train_df = pd.DataFrame(X_train)

# Model pipeline
preprocessor = ColumnTransformer([
    ('text', TfidfVectorizer(), 'text'),
    ('num', StandardScaler(), ['proposal_ratio', 'max_donation_ratio', 'withdrawal_count', 'withdrawal_ratio', 'verification_status', 'appeal_present'])
])
model = make_pipeline(preprocessor, LogisticRegression(max_iter=1000))
model.fit(X_train_df, y_train)

def analyze_fraud(campaign_data, proposal_data, donor_data, appeal_data):
    data = {
        "campaign_text": f"{campaign_data.get('description', '')} {campaign_data.get('detail', '')}",
        "proposal_amount": proposal_data.get('amount_requested', 0),
        "proposal_reason": proposal_data.get('reason', ''),
        "donor_history": donor_data.get('donor_history', []),
        "appeal_response": appeal_data.get('creator_response', ''),
        "raised_funds": campaign_data.get('raised_funds', 0),
        "withdrawal_history": campaign_data.get('withdrawal_history', []),
        "verification_status": campaign_data.get('verification_status', False)
    }
    features = extract_features(data)
    X_test_df = pd.DataFrame([features])
    fraud_score = model.predict_proba(X_test_df)[0][1] * 100
    risk_factors = []
    if not data['verification_status']: risk_factors.append("Unverified campaign creator")
    if features['max_donation_ratio'] > 0.4: risk_factors.append("Sudden donation spike")
    if features['proposal_ratio'] > 0.5: risk_factors.append("Excessive withdrawal request")
    if len(data.get('proposal_reason', '')) < 20: risk_factors.append("Vague withdrawal reason")
    appeal_outcome = "Rejected" if fraud_score > 70 else "Accepted"
    suggested_action = "Freeze funds and investigate" if fraud_score > 70 else "Monitor campaign"
    return {
        "fraud_score": fraud_score,
        "risk_report": " ".join(risk_factors) or "No significant risks detected.",
        "appeal_outcome": appeal_outcome,
        "anomaly_flags": risk_factors,
        "suggested_action": suggested_action
    }

@app.route('/create_campaign', methods=['POST'])
def create_campaign():
    if not request.form or 'uiImage' not in request.files or 'aiCheckImage' not in request.files:
        return jsonify({'error': 'Missing data or images'}), 400

    campaign_data = {
        'name': request.form['name'],
        'description': request.form['description'],
        'detail': request.form['detail'],
        'owner': request.form['owner'],
        'contractAddress': request.form['contractAddress'],
        'goal': int(request.form['goal']),
        'raised_funds': int(request.form.get('raisedFunds', 0)),
        'verification_status': request.form.get('verificationStatus', 'false').lower() == 'true',
        'withdrawal_history': eval(request.form.get('withdrawalHistory', '[]')),
        'CreatedAt': datetime.utcnow().isoformat(),
        'fraud_report_ids': []
    }

    ui_image = request.files['uiImage']
    ai_check_image = request.files['aiCheckImage']
    ui_path = os.path.join('uploads', f'{datetime.now().timestamp()}-{ui_image.filename}')
    ai_path = os.path.join('uploads', f'{datetime.now().timestamp()}-{ai_check_image.filename}')
    ui_image.save(ui_path)
    ai_check_image.save(ai_path)

    campaign_data['uiImage'] = f'http://localhost:5000/{ui_path}'
    campaign_data['aiCheckImage'] = f'http://localhost:5000/{ai_path}'

    campaign_id = campaigns_collection.insert_one(campaign_data).inserted_id
    campaign_data['_id'] = str(campaign_id)

    return jsonify(campaign_data), 201

# @app.route('/analyze', methods=['POST'])
# def analyze():
#     print("FUCKING FORM DATA:", dict(request.form))
#     print("FUCKING FILES:", dict(request.files))
#     if not request.form:
#         print("SHIT: No form data at all!")
#     if 'uiImage' not in request.files:
#         print("SHIT: uiImage is missing!")
#     if 'aiCheckImage' not in request.files:
#         print("SHIT: aiCheckImage is missing!")
#     if 'campaign_id' not in request.form:
#         print("SHIT: campaign_id is missing, you dumbass!")

#     if not request.form or 'uiImage' not in request.files or 'aiCheckImage' not in request.files or 'campaign_id' not in request.form:
#         return jsonify({'error': 'Missing data, images, or campaign_id'}), 400

#     campaign_id = request.form['campaign_id']
#     try:
#         campaign = campaigns_collection.find_one({'_id': ObjectId(campaign_id)})
#         if not campaign:
#             print("SHIT: Campaign not found for ID:", campaign_id)
#             return jsonify({'error': 'Campaign not found'}), 404
#     except Exception as e:
#         print("SHIT: Invalid campaign_id format:", str(e))
#         return jsonify({'error': f'Invalid campaign_id format: {str(e)}'}), 400

#     try:
#         print("Parsing proposal:", request.form.get('proposal', '{}'))
#         proposal_data = json.loads(request.form.get('proposal', '{}'))
#         print("Parsing donor:", request.form.get('donor', '{}'))
#         donor_data = json.loads(request.form.get('donor', '{}'))
#         print("Parsing appeal:", request.form.get('appeal', '{}'))
#         appeal_data = json.loads(request.form.get('appeal', '{}'))
#     except json.JSONDecodeError as e:
#         print("SHIT: Invalid JSON in form data:", str(e))
#         return jsonify({'error': f'Invalid JSON in form data: {str(e)}'}), 400

#     ui_image = request.files['uiImage']
#     ai_check_image = request.files['aiCheckImage']
#     ui_path = os.path.join('uploads', f'{datetime.now().timestamp()}-{ui_image.filename}')
#     ai_path = os.path.join('uploads', f'{datetime.now().timestamp()}-{ai_check_image.filename}')
#     ui_image.save(ui_path)
#     ai_check_image.save(ai_path)

#     campaign_data = {
#         'name': campaign['name'],
#         'description': campaign.get('description', ''),
#         'detail': campaign.get('detail', ''),
#         'owner': campaign['owner'],
#         'contractAddress': campaign['contractAddress'],
#         'goal': campaign['goal'],
#         'raised_funds': campaign.get('raised_funds', 0),
#         'verification_status': campaign.get('verification_status', False),
#         'withdrawal_history': campaign.get('withdrawal_history', [])
#     }

#     fraud_report = analyze_fraud(campaign_data, proposal_data, donor_data, appeal_data)
#     fraud_report['campaign_id'] = campaign_data['name']
#     fraud_report['timestamp'] = datetime.now().isoformat()

#     report_id = fraud_reports_collection.insert_one(fraud_report).inserted_id

#     campaigns_collection.update_one(
#         {'_id': ObjectId(campaign_id)},
#         {'$push': {'fraud_report_ids': str(report_id)}}
#     )

#     response = {
#         'name': campaign_data['name'],
#         'description': campaign_data['description'],
#         'detail': campaign_data['detail'],
#         'owner': campaign_data['owner'],
#         'contractAddress': campaign_data['contractAddress'],
#         'goal': campaign_data['goal'],
#         'raised_funds': campaign_data['raised_funds'],
#         'verification_status': campaign_data['verification_status'],
#         'withdrawal_history': campaign_data['withdrawal_history'],
#         'uiImage': f'http://localhost:5000/{ui_path}',
#         'aiCheckImage': f'http://localhost:5000/{ai_path}',
#         'CreatedAt': campaign.get('CreatedAt', datetime.utcnow().isoformat()),
#         'fraud_report_ids': [str(rid) for rid in campaign.get('fraud_report_ids', [])] + [str(report_id)],
#         '_id': campaign_id,
#         'fraud_score': fraud_report['fraud_score'],
#         'risk_report': fraud_report['risk_report'],
#         'appeal_outcome': fraud_report['appeal_outcome'],
#         'anomaly_flags': fraud_report['anomaly_flags'],
#         'suggested_action': fraud_report['suggested_action'],
#         'campaign_id': fraud_report['campaign_id'],
#         'timestamp': fraud_report['timestamp']
#     }

#     print("FUCKING RESPONSE:", response)
#     return jsonify(response), 200
def analyze_fraud(campaign_data, proposal_data, donor_data, appeal_data):
    data = {
        "campaign_text": f"{campaign_data.get('description', '')} {campaign_data.get('detail', '')}",
        "proposal_amount": proposal_data.get('amount_requested', 0),
        "proposal_reason": proposal_data.get('reason', ''),
        "donor_history": donor_data.get('donor_history', []),
        "appeal_response": appeal_data.get('creator_response', ''),
        "raised_funds": campaign_data.get('raised_funds', 0),
        "withdrawal_history": campaign_data.get('withdrawal_history', []),
        "verification_status": campaign_data.get('verification_status', False)
    }
    features = extract_features(data)
    X_test_df = pd.DataFrame([features])
    fraud_score = model.predict_proba(X_test_df)[0][1] * 100
    
    # Tweak fraud logic
    risk_factors = []
    if not data['verification_status']:  # Unverified creator
        risk_factors.append("Unverified campaign creator")
        fraud_score += 10  # Boost score for unverified
    if features['proposal_ratio'] > 0.5:  # Excessive withdrawal (50% of raised funds)
        risk_factors.append("Excessive withdrawal request")
        fraud_score += 15
    if len(data.get('proposal_reason', '')) < 20:  # Vague reason
        risk_factors.append("Vague withdrawal reason")
        fraud_score += 10
    if features['max_donation_ratio'] > 0.4:  # Sudden donation spike
        risk_factors.append("Sudden donation spike")
        fraud_score += 10
    
    # Cap fraud score at 100
    fraud_score = min(fraud_score, 100)
    
    appeal_outcome = "Rejected" if fraud_score > 50 else "Accepted"  # Lower threshold
    suggested_action = "Freeze funds and investigate" if fraud_score > 50 else "Monitor campaign"
    return {
        "fraud_score": fraud_score,
        "risk_report": " ".join(risk_factors) or "No significant risks detected.",
        "appeal_outcome": appeal_outcome,
        "anomaly_flags": risk_factors,
        "suggested_action": suggested_action
    }
@app.route('/campaigns', methods=['GET'])
def get_campaigns():
    all_campaigns = list(campaigns_collection.find({}))
    for c in all_campaigns:
        c['_id'] = str(c['_id'])
        c['fraud_report_ids'] = [str(rid) for rid in c.get('fraud_report_ids', [])]
        if 'CreatedAt' in c and isinstance(c['CreatedAt'], datetime):
            c['CreatedAt'] = c['CreatedAt'].isoformat()
    return jsonify(all_campaigns), 200

@app.route('/fraud_history/<campaign_id>', methods=['GET'])
def get_fraud_history(campaign_id):
    reports = list(fraud_reports_collection.find({"campaign_id": campaign_id}))
    for r in reports:
        r['_id'] = str(r['_id'])
        if 'timestamp' in r and isinstance(r['timestamp'], datetime):
            r['timestamp'] = r['timestamp'].isoformat()
    return jsonify(reports), 200

@app.route('/uploads/<path:filename>', methods=['GET'])
def serve_image(filename):
    return app.send_static_file(os.path.join('uploads', filename))

app.static_folder = 'uploads'

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    app.run(port=5000, debug=False)