import csv
import random
from faker import Faker
from datetime import datetime, timedelta

fake = Faker()

# Fraudulent and legitimate text snippets
fraud_texts = ["Earn 1000% returns quick", "Invest now no risk", "Guaranteed profits fast", "Double your money instantly", "Crypto riches overnight"]
legit_texts = ["Support our school library", "Build a community center", "Help fund medical supplies", "Playground for kids", "Clean water project"]
fraud_reasons = ["Quick payout", "Pay suppliers", "Urgent cash", "Transfer funds"]
legit_reasons = ["Purchase textbooks", "Buy equipment", "Cover shipping costs", "Pay for materials"]

data = []
for i in range(100):
    is_fraud = i % 2 == 0  # Alternate fraud/legit
    campaign_text = random.choice(fraud_texts if is_fraud else legit_texts) + " " + fake.sentence()
    raised_funds = random.randint(500, 10000)
    verification_status = False if is_fraud else random.choice([True, False])
    
    # Withdrawal history
    withdrawal_history = []
    if is_fraud:
        for _ in range(random.randint(1, 3)):
            withdrawal_history.append({"amount": random.randint(raised_funds // 4, raised_funds // 2), "timestamp": fake.date_time_this_year().isoformat()})
    else:
        if random.random() > 0.5:  # 50% chance of withdrawal for legit
            withdrawal_history.append({"amount": random.randint(100, raised_funds // 3), "timestamp": fake.date_time_this_year().isoformat()})
    
    # Proposal: Cast upper bound to int
    proposal_amount = random.randint(raised_funds // 4, int(raised_funds * (0.8 if is_fraud else 0.4)))
    proposal_reason = random.choice(fraud_reasons if is_fraud else legit_reasons)
    
    # Donor history
    donor_history = []
    if is_fraud:
        donor_history.append({"amount": random.randint(raised_funds // 2, raised_funds), "timestamp": fake.date_time_this_year().isoformat()})
    else:
        for _ in range(random.randint(1, 3)):
            donor_history.append({"amount": random.randint(50, raised_funds // 3), "timestamp": fake.date_time_this_year().isoformat()})
    
    # Appeal
    appeal_response = fake.sentence() if (not is_fraud or random.random() > 0.3) else ""

    data.append({
        "campaign_text": campaign_text,
        "raised_funds": raised_funds,
        "verification_status": int(verification_status),
        "withdrawal_history": str(withdrawal_history),
        "proposal_amount": proposal_amount,
        "proposal_reason": proposal_reason,
        "donor_history": str(donor_history),
        "appeal_response": appeal_response,
        "label": 1 if is_fraud else 0
    })

with open('crowdfunding_data.csv', 'w', newline='', encoding='utf-8') as f:
    fieldnames = ["campaign_text", "raised_funds", "verification_status", "withdrawal_history", "proposal_amount", "proposal_reason", "donor_history", "appeal_response", "label"]
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(data)

print("Generated crowdfunding_data.csv with 100 examples.")