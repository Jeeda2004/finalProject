from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
import os
from flask_cors import CORS
from sqlalchemy import create_engine, text
import csv
from datetime import datetime

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

# Define the Student model (renamed from user to student)``
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)  
    first_name = db.Column(db.String(80), nullable=False)  
    last_name = db.Column(db.String(80), nullable=False)   
    clubs = db.relationship('Membership', back_populates='student')

class Club(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    club_name = db.Column(db.String(100), nullable=False)
    club_head = db.Column(db.String(100), nullable=False)
    logo = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    members = db.relationship('Membership', back_populates='club')
# Function to create tables

class Membership(db.Model):
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), primary_key=True)
    club_id = db.Column(db.Integer, db.ForeignKey('club.id'), primary_key=True)
    join_date = db.Column(db.DateTime, default=datetime.utcnow)
    student = db.relationship("Student", back_populates="clubs")
    club = db.relationship("Club", back_populates="members")

def create_tables():
    with app.app_context():
        db.create_all()

def seed_clubs_from_csv(csv_path):
    with app.app_context():
        with open(csv_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                # Check if the club already exists to avoid duplicates
                if not Club.query.filter_by(club_name=row['clubName']).first():
                    club = Club(
                        club_name=row['clubName'],
                        club_head=row['clubHead'],
                        logo=row['logo'],
                        description=row['description']
                    )
                    db.session.add(club)
            db.session.commit()
        print("Clubs seeded successfully from CSV!")

# Route to populate the clubs table from a CSV file
@app.route('/seed_clubs', methods=['POST'])
def seed_clubs():
    csv_path = request.json.get('csv_path', 'clubs.csv')  # Default to `clubs.csv`
    try:
        seed_clubs_from_csv(csv_path)
        return jsonify({'message': 'Clubs seeded successfully'}), 200
    except Exception as e:
        print("Error seeding clubs:", e)
        return jsonify({'error': 'Failed to seed clubs'}), 500

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
            password=password,  
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
            session['student_id'] = student.id  
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


@app.route('/clubs', methods=['GET'])
def get_clubs():
    print(request.headers)  # Debugging: Check what headers are being sent
    clubs = Club.query.all()
    return jsonify([
        {"id": club.id, "club_name": club.club_name, "club_head": club.club_head, "logo": club.logo ,"description": club.description}
        for club in clubs
    ]), 200

@app.route('/clubs/<club_name>', methods=['GET'])
def get_club_by_name(club_name):
    club = Club.query.filter_by(club_name=club_name).first()
    if club:
        return jsonify({
            "id": club.id,
            "club_name": club.club_name,
            "club_head": club.club_head,
            "logo": club.logo,
            "description": club.description
        }), 200
    return jsonify({'error': 'Club not found'}), 404

@app.route('/join_club/<club_name>', methods=['POST'])
def join_club(club_name):
    username = request.json.get('username')
    if not username:
        return jsonify({'error': 'Username is required'}), 400
    
    student = Student.query.filter_by(username=username).first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    club = Club.query.filter_by(club_name=club_name).first()
    if not club:
        return jsonify({'error': 'Club not found'}), 404

    if Membership.query.filter_by(student_id=student.id, club_id=club.id).first():
        return jsonify({'error': 'Membership already exists'}), 409

    new_membership = Membership(student_id=student.id, club_id=club.id)
    db.session.add(new_membership)
    db.session.commit()

    return jsonify({'message': 'Successfully joined the club'}), 201

@app.route('/student_clubs', methods=['POST'])
def get_student_clubs():
    try:
        username = request.json.get('username')
        if not username:
            return jsonify({'error': 'Username is required'}), 400

        # Find the student by username
        student = Student.query.filter_by(username=username).first()
        if not student:
            return jsonify({'error': 'Student not found'}), 404

        # Fetch clubs joined by the student
        memberships = Membership.query.filter_by(student_id=student.id).all()
        clubs = [membership.club for membership in memberships]

        return jsonify([
            {
                "id": club.id,
                "club_name": club.club_name,
                "club_head": club.club_head,
                "logo": club.logo,
                "description": club.description
            }
            for club in clubs
        ]), 200
    except Exception as e:
        print("Error fetching clubs:", e)
        return jsonify({'error': 'Failed to fetch clubs'}), 500


@app.route('/get_student_id/<username>', methods=['GET'])
def get_student_id(username):
    student = Student.query.filter_by(username=username).first()
    if student:
        return jsonify({"id": student.id}), 200
    return jsonify({"error": "Student not found"}), 404


if __name__ == '__main__':
    create_tables()  # Initialize the database tables
    seed_clubs_from_csv('src\ Backend\clubs.csv')
    app.run(debug=True, host='0.0.0.0', port=5000) 
