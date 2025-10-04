import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
import joblib
import os

# Path of CSV
DATA_PATH = "ml/EmotionDetection.csv"

MODEL_PATH = "ml/sentiment_model.pkl"

# Load dataset
df = pd.read_csv(DATA_PATH)

# drop rows with missing values
df = df.dropna(subset=["text", "Emotion"])

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    df["text"], df["Emotion"], test_size=0.2, random_state=42, stratify=df["Emotion"]
)

# Create pipeline
pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(max_features=20000, ngram_range=(1,2))),
    ("clf", LogisticRegression(
        solver="lbfgs", 
        multi_class="multinomial", 
        max_iter=500,
        class_weight="balanced" 
    ))
])

# Train
print("Training Logistic Regression model...")
pipeline.fit(X_train, y_train)

# Evaluate
y_pred = pipeline.predict(X_test)
print("Evaluating model...")
print(classification_report(y_test, y_pred))

# Save
joblib.dump(pipeline, MODEL_PATH)
print(f"Model saved at {MODEL_PATH}")
