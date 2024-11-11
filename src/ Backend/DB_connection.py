from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
import os
from flask_cors import CORS
from sqlalchemy import create_engine, text

app = Flask(__name__)
# app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # or 'Strict'
# app.config['SESSION_COOKIE_SECURE'] = True  # Set to True if using HTTPS
CORS(app, resources={r"/*": {"origins": "http://localhost:4200", "supports_credentials": True}})


# Configure the default database engine without a specific database
default_engine = create_engine('mysql+pymysql://root:admin@localhost/', echo=True)

# Create the database if it doesn't exist
with default_engine.connect() as conn:
    conn.execute(text("CREATE DATABASE IF NOT EXISTS CLUB"))  # Correctly use `text` for SQL statements

# Configure the application with the specific database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:admin@localhost/CLUB'
app.config['SECRET_KEY'] = os.urandom(24)
db = SQLAlchemy(app)

# Define the Student model (renamed from user to student)
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)  # Password should ideally be hashed
    first_name = db.Column(db.String(80), nullable=False)  # Add first name
    last_name = db.Column(db.String(80), nullable=False)   # Add last name


# Function to create tables
def create_tables():
    with app.app_context():
        db.create_all()


# Route to register a new student
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({'error': 'Invalid JSON format'}), 400

        username = data.get('username')
        password = data.get('password')
        first_name = data.get('firstName')
        last_name = data.get('lastName')

        if not username or not password or not first_name or not last_name:
            return jsonify({'error': 'All fields are required'}), 400

        # Check if the username already exists
        if Student.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 400

        # Add the new student to the database
        new_student = Student(
            username=username,
            password=password,  # Replace with hashed password if needed
            first_name=first_name,
            last_name=last_name
        )
        db.session.add(new_student)
        db.session.commit()
        session['student_id'] = new_student.id

        return jsonify({
            'message': 'Student registered successfully',
            'first_name': first_name,
            'last_name': last_name,
            'username': username
        }), 201

    except Exception as e:
        print("Error:", e)  # For debugging purposes
        return jsonify({'error': 'Invalid JSON data or server error'}), 400


# Route for student login
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        

        # Verify the student (check username and password)
        student = Student.query.filter_by(username=username, password=password).first()

        if student:
            session['student_id'] = student.id  # Use student_id instead of user_id
            return jsonify({
                'message': 'Login successful',
                'first_name': student.first_name,
                'last_name': student.last_name,
                'username': student.username
            }), 200
        else:
            return jsonify({'error': 'Invalid username or password'}), 401

    except Exception as e:
        print("Error:", e)  # For debugging purposes
        return jsonify({'error': 'Server error occurred'}), 500


# Route to fetch currently logged-in student
@app.route('/current_student', methods=['GET'])
def current_student():
    if 'student_id' in session:
        student = Student.query.get(session['student_id'])
        if student:
            return jsonify({
                'first_name': student.first_name,
                'last_name': student.last_name,
                'username': student.username,
            }), 200
    return jsonify({'error': 'No student logged in'}), 401



if __name__ == '__main__':
    create_tables()  # Initialize the database tables
    app.run(debug=True, host='0.0.0.0', port=5000) 
