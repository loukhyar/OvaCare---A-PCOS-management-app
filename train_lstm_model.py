# train_lstm.py
import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.losses import MeanSquaredError
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import joblib
import os
from tensorflow.keras.callbacks import EarlyStopping

# === Load and Preprocess Dataset ===
df = pd.read_csv("periodcycle.csv")

# Use the provided cycle length column
cycle_lengths = df['LengthofCycle'].dropna().values

# Ensure enough data
if len(cycle_lengths) < 10:
    raise ValueError("Not enough data. At least 10 cycle lengths recommended.")

# === Prepare Data ===
window_size = 3
X, y = [], []
for i in range(len(cycle_lengths) - window_size):
    X.append(cycle_lengths[i : i + window_size])
    y.append(cycle_lengths[i + window_size])

X = np.array(X)
y = np.array(y).reshape(-1, 1)

# === Scale Data ===
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X.reshape(-1, 1)).reshape(X.shape)
y_scaled = scaler.transform(y)

# Save scaler for inference
os.makedirs("model", exist_ok=True)
joblib.dump(scaler, "model/scaler.save")

# Reshape for LSTM: [samples, timesteps, features]
X_scaled = X_scaled.reshape((X_scaled.shape[0], window_size, 1))

# Split train/val
X_train, X_val, y_train, y_val = train_test_split(
    X_scaled, y_scaled, test_size=0.2, random_state=42
)

# === Build and Train LSTM Model ===
model = Sequential([
    LSTM(64, return_sequences=True, activation='tanh', input_shape=(window_size, 1)),
    LSTM(32, activation='tanh'),
    Dense(1)
])

model.compile(
    optimizer=Adam(learning_rate=5e-4),
    loss=MeanSquaredError(),
    metrics=['mae']
)

early_stop = EarlyStopping(
    monitor='val_loss', patience=10, restore_best_weights=True
)

history = model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=100,
    callbacks=[early_stop],
    verbose=1
)

# Save model
model.save("model/lstm_period_predictor.h5")
print("✅ Model trained and saved successfully.")
