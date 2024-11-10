from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
import os
from flask_cors import CORS
import pymysql
from sqlalchemy import create_engine

app = Flask(__name__)

# Configure without specific database
default_engine = create_engine('mysql+pymysql://root:password@localhost/', echo=True)

# Create database if it doesn't exist
with default_engine.connect() as conn:
    conn.execute("COMMIT")  # Required because MySQL uses transactions
    conn.execute("CREATE DATABASE IF NOT EXISTS CLUB")

# Now configure with the specific database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:password@localhost/CLUB'
app.config['SECRET_KEY'] = os.urandom(24)
db = SQLAlchemy(app)


class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)  # Store plain text password

# Function to create tables
def create_tables():
    with app.app_context():
        db.create_all()


# Route to register a new user
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

# Assume app and db are already set up, and User model is defined
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json(force=True)  # `force=True` will parse the data even if no content-type is set
        if not data:
            return jsonify({'error': 'Invalid JSON format'}), 400

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400

        # Check if username is already taken
        if Student.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 400

        # Create new user and add to the database
        new_student = Student(username=username, password=password)
        db.session.add(new_student)
        db.session.commit()

        return jsonify({'message': 'Student registered successfully'}), 201

    except Exception as e:
        print("Error:", e)  # For debugging purposes
        return jsonify({'error': 'Invalid JSON data or server error'}), 400


# Route for user login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    student = Student.query.filter_by(username=username, password=password).first()

    if student:
        session['user_id'] = student.id
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401
    
if __name__ == '__main__':
    create_tables()  # Initialize the database tables before starting the app
    app.run(debug=True)


