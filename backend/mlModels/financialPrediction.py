import xgboost as xgb
import pandas as pd
import json
import numpy as np

def predict_spending(historical_data):
    try:
        df = pd.DataFrame(historical_data)

        # Preprocess your data here 
        df['date'] = pd.to_datetime(df['date']).astype(int) / 10**9 

        # Define your feature and label 
        X = df[['date']].values  
        y = df['spending'].values  

        # Train the XGBoost model
        model = xgb.XGBRegressor(objective='reg:squarederror', n_estimators=1000)
        model.fit(X, y)

        # Use the trained model to make predictions
        prediction = model.predict(X) 

        return prediction.tolist() 

    except Exception as e:
        print("Error in model prediction:", e)
        return []

if __name__ == "__main__":
    
    import sys
    input_data = sys.argv[1]  
    historical_data = json.loads(input_data) 
    predictions = predict_spending(historical_data)  
    print(json.dumps(predictions)) 
