from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)


CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Basic configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:password@localhost/CLUB'  # Replace with your MySQL credentials
app.config['SECRET_KEY'] = 'simple_secret_key'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)

class Club(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    club_name = db.Column(db.String(100), nullable=False)
    club_head = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)

def create_tables():
    with app.app_context():
        db.create_all()


# Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    first_name = data.get('firstName')
    last_name = data.get('lastName')

    if Student.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400

    student = Student(username=username, password=password, first_name=first_name, last_name=last_name)
    db.session.add(student)
    db.session.commit()
    return jsonify({'message': 'Student registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    student = Student.query.filter_by(username=username, password=password).first()
    if student:
        session['student_id'] = student.id
        return jsonify({'message': 'Login successful'}), 200
    return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/clubs', methods=['GET'])
def get_clubs():
    print(request.headers)  # Debugging: Check what headers are being sent
    clubs = Club.query.all()
    return jsonify([
        {"id": club.id, "club_name": club.club_name, "club_head": club.club_head, "description": club.description}
        for club in clubs
    ]), 200


@app.route('/')
def home():
    return jsonify({'message': 'Simple Backend is running with MySQL!'})

if __name__ == '__main__':
    create_tables()  # Initialize the database tables before starting the app
    app.run(debug=True)



