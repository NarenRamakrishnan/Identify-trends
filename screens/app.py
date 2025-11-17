from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import numpy as np
import matplotlib.pyplot as plt
import io
import base64
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import PolynomialFeatures
from sklearn.model_selection import train_test_split
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired

app = Flask(__name__)
CORS(app)

# This is the configuration for my SQL (password and database hidden for privacy reasons)
db_config = {
    "host": "localhost",
    "user": "root",  
    "password": "$$$", # Replaced actual with $$$
    "database": "$$$"
}

# Connects app to email
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "$$$"  
app.config["MAIL_PASSWORD"] = "$$$"  
app.config["MAIL_DEFAULT_SENDER"] = "$$$"

mail = Mail(app)
serializer = URLSafeTimedSerializer("$$$")  # Used for token generation

def get_db_connection():
    return mysql.connector.connect(**db_config)

best_model = None
best_poly_transformer = None
best_degree = None
user = None



@app.route('/forgot_password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get("email")

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if email exists in the database
    cursor.execute("SELECT user_password FROM users WHERE user_id = %s", (email,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user:
        return jsonify({"error": "Email not found"}), 404

    # Extract the password from the database
    user_password = user[0]  

    # Sends email with the retrieved password
    msg = Message("Your Account Password", recipients=[email])
    msg.body = f"Hello,\n\nYour password is: {user_password}\n\nPlease keep it safe."

    try:
        mail.send(msg)
        return jsonify({"message": "Your password has been sent to your email"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/db_manage_userinfo', methods=['POST'])
def db_manage_userinfo():
    data = request.get_json()  #This gets the email and password from the frontend
    email = data.get('email')
    password = data.get('password')
    global user #User is used throughout the program and is thus defined here
    user = email 

    conn = get_db_connection()
    cursor = conn.cursor()

 
    cursor.execute("SELECT * FROM users WHERE user_id = %s", (email,)) #This checks if the user already exists
    existing_user = cursor.fetchone()

    if existing_user:
        cursor.close()
        conn.close()
        return jsonify({'error': 'User already exists'}), 409 #This tells the frontend that the user already exists

    #This inserts the new user into the database if the user does not exist
    cursor.execute("INSERT INTO users (user_id, user_password) VALUES (%s, %s)", (email, password))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({'message': 'User added successfully'}), 200 #This tells frontend that user is added to database


@app.route('/login', methods=['POST']) #This sets the connection from backend to frontend
def login():
    data = request.get_json() #This fetches the input data from user
    username = data.get('username')
    password = data.get('password')
    global user #This defines user as global as I use the userid as an identifier throughout the backend
    user = username 

    conn = get_db_connection() #This connects the backend to the database
    cursor = conn.cursor() #This allows interactions with database

    cursor.execute("SELECT user_password FROM users WHERE user_id = %s", (username,)) 
    stored_password = cursor.fetchone() 
    #THis fetching the password where user id matches the user
    cursor.close()
    conn.close()
    #This closes the database connection and frees up the resources
    if stored_password: #Checks if user exists
        if stored_password[0] == password:
            return jsonify({'status': 'success', 'message': 'Login successful!'}), 200 
        #If password matches, the status is set to success and a login successful message is displayed
        else:
            return jsonify({'status': 'failed', 'message': 'Incorrect password.'}), 401 
        #If password doesn't match, the status is set to failed and an incorrect password message is displayed 
    return jsonify({'status': 'failed', 'message': 'Username not found.'}), 404 
    #If username is not found, this is displayed



@app.route('/add_project', methods=['POST'])
def add_project(): #Like the db_manage_userinfo() function, this adds a project to the database instead of a user
    global user
    data = request.get_json()
    project_name = data.get('project_name')

    if not project_name:
        return jsonify({"error": "Project name is required."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("INSERT INTO projects (user_id, project_name) VALUES (%s, %s)", (user, project_name))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": f"Project '{project_name}' added successfully!"}), 200

@app.route('/load_projects', methods=['POST'])
def load_projects():
    global user

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT project_name, project_data, target_values FROM projects WHERE user_id = %s", (user,))
    projects = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({"projects": projects}), 200


@app.route('/train_and_predict', methods=['POST'])
def train_and_predict():
    global best_model, best_poly_transformer, best_degree

    data = request.get_json()
    features = data.get("features", [])
    target = data.get("target", [])
    
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("UPDATE projects SET project_data = %s, target_values = %s WHERE user_id = %s",
                   (str(features), str(target), user))
    conn.commit()

    cursor.close()
    conn.close()
    #Data preprocessing is carried out by the following code
    x = np.array(features).reshape(-1, 1)
    y = np.array(target)
    #The Data is split into the train and test set
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42) 
    #Model training/comparing
    degrees = [1, 2, 3, 4, 5] 
    best_mse = float('inf') 

    for degree in degrees:
        poly = PolynomialFeatures(degree)
        x_poly_train = poly.fit_transform(x_train)
        x_poly_test = poly.transform(x_test)
        model = LinearRegression()
        model.fit(x_poly_train, y_train)
        y_pred = model.predict(x_poly_test)
        mse = mean_squared_error(y_test, y_pred)

        if mse < best_mse:
            best_mse = mse
            best_degree = degree
            best_model = model
            best_poly_transformer = poly

    function_str = f"y = {best_model.intercept_:.2f}"
    for i, coef in enumerate(best_model.coef_[1:], 1):
        function_str += f" + {coef:.2f}x^{i}"

    plt.figure(figsize=(20, 8))
    plt.scatter(x, y, color='blue', label='Data points')
    X_plot = np.linspace(min(x), max(x), 100).reshape(-1, 1)
    X_poly_plot = best_poly_transformer.transform(X_plot)
    y_plot = best_model.predict(X_poly_plot)
    plt.plot(X_plot, y_plot, color='red', label=f'Polynomial Regression (Degree {best_degree})')
    plt.xlabel('Feature')
    plt.ylabel('Target')
    plt.legend()
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    img_base64 = base64.b64encode(img.read()).decode('utf-8')
    return jsonify({"function": function_str, "graph": img_base64})

@app.route('/compare_data', methods=['POST'])
def compare_data():
    global best_model, best_poly_transformer

    data = request.get_json()
    features = data.get("features", [])
    target = data.get("target", [])

    if not features or not target or not best_model:
        return jsonify({"error": "Invalid data or model not trained"}), 400

    X = np.array(features).reshape(-1, 1)
    y = np.array(target)

    X_poly = best_poly_transformer.transform(X)
    predictions = best_model.predict(X_poly)
    mse = mean_squared_error(y, predictions)

    return jsonify({"predictions": predictions.tolist(), "mse": mse})
@app.route('/delete_project', methods=['POST'])
def delete_project():
    data = request.get_json()
    username = user
    project_name = data.get("project_name")

    if not username or not project_name:
        return jsonify({"error": "Username and project name are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if the project exists
    cursor.execute("SELECT * FROM projects WHERE user_id = %s AND project_name = %s", (username, project_name))
    project = cursor.fetchone()

    if not project:
        cursor.close()
        conn.close()
        return jsonify({"error": "Project not found"}), 404

    # Delete the project
    cursor.execute("DELETE FROM projects WHERE user_id = %s AND project_name = %s", (username, project_name))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Project deleted successfully!"}), 200


if __name__ == "__main__":
    app.run(debug=False)
