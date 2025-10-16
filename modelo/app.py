from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import pickle

# Initialize the Flask application
app = Flask(__name__)

# --- Load the pre-trained model and scaler ---
try:
    # Load the trained model
    modelo_gpinn = tf.keras.models.load_model('modelo_pinn_entrenado.h5')

    # Load the scaler object
    with open('scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)

except Exception as e:
    modelo_gpinn = None
    scaler = None

# --- Define constants ---
T_MIN = 15.0
T_MAX = 350.0

# --- Define the prediction endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    if not modelo_gpinn or not scaler:
        return jsonify({"error": "Model or scaler not loaded properly."}), 500

    # Get data from the POST request's JSON body
    data = request.get_json()

    # Validate input data
    if not data or 'longitud' not in data or 'latitud' not in data:
        return jsonify({"error": "Invalid input. Please provide 'longitud' and 'latitud'."}), 400

    try:
        # Extract coordinates
        longitud = data['longitud']
        latitud = data['latitud']

        # Create a numpy array from the input
        punto_nuevo = np.array([[longitud, latitud]])

        # Normalize the new point using the loaded scaler
        punto_nuevo_norm = scaler.transform(punto_nuevo)

        # Make a prediction with the model
        prediccion_normalizada = modelo_gpinn.predict(punto_nuevo_norm)

        # De-normalize the prediction to get the final temperature
        temperatura_final = T_MIN + (T_MAX - T_MIN) * prediccion_normalizada[0][0]

        # Create the response JSON
        response = {
            "input_coordinates": {
                "longitud": longitud,
                "latitud": latitud
            },
            "predicted_temperature_celsius": f"{temperatura_final:.2f}"
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": f"An error occurred during prediction: {e}"}), 500

# --- Define a root endpoint for basic info ---
@app.route('/', methods=['GET'])
def index():
    return "<h1>Welcome to the Geothermal Prediction API!</h1><p>Use the /predict endpoint with a POST request to get a temperature prediction.</p>"

# --- Run the Flask app ---
if __name__ == '__main__':
    # Use port 5000 by default
    app.run(debug=True, port=5000)