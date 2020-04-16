from flask import render_template, url_for, request, redirect, flash, jsonify, json
from flask_sqlalchemy import SQLAlchemy
from app import app, db, bcrypt, jwt
from app.forms import LoginForm, SignupForm
from flask_login import login_user, logout_user, current_user, login_required
from app.models import User, MovieRating
from werkzeug.urls import url_parse
from app.recommender import top_n_movies, get_recommendation
from app.all_movies import all_movies
from flask_jwt_extended import (create_access_token)
import pandas as pd
import numpy as np
import sqlite3
from collections import OrderedDict
import time

@app.route('/', methods=['POST', 'GET'])
@app.route('/index', methods=['POST', 'GET'])
def index():
    topN = top_n_movies(50)

    top_movies = []

    conn = sqlite3.connect("tmdb.db")
    cur = conn.cursor()

    for movie in topN:
         
        cur.execute("select * from movies where title = ?", (movie,))
        for result in cur:
            
            poster = result[20]
            movie_id = result[3]
            top_movies.append(
            
                {'title': movie, 'rating': 0, 'poster_path': poster, 'movie_id': movie_id})
    return jsonify({'movies': top_movies})

@app.route('/browse/<page_number>', methods=['POST', 'GET'])
def browse(page_number):
    movies = all_movies()
    page = int(page_number)
    start = (page - 1) * 48
    end = start + 48
    movies_page = sorted(list(movies))[start:end]
    

    movies_dict = []

    conn = sqlite3.connect("tmdb.db")
    cur = conn.cursor()

    for movie in movies_page:
   
        cur.execute("select * from movies where title = ?", (movie,))
        for result in cur:
            
            poster = result[20]
            movie_id = result[3]
            movies_dict.append(
            
                {'title': movie, 'rating': 0, 'poster_path': poster, 'movie_id': movie_id})
    
    return jsonify({'movies': movies_dict})
    

@app.route('/users/login', methods=['GET', 'POST'])
def login():
    username = request.get_json()['username']
    password = request.get_json()['password']
    result = ""
    user = User.query.filter_by(username=username).first()
    if user is None:
        result = jsonify({"Error": "Invalid username or password"})
    elif bcrypt.check_password_hash(user.get_password(), password):
        login_user(user)
        access_token = create_access_token(identity= {"username": user.get_username(),
        "email": user.get_email()})
        result = access_token
    else: 
        result = jsonify({"error": "Invalid username and password"})

    return result

@app.route('/users/register', methods=['GET', 'POST'])
def signup():
    username = request.get_json()['username']
    email = request.get_json()['email']
    password = bcrypt.generate_password_hash(
        request.get_json()['password']).decode('utf-8')
    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    result = {
        'username': username,
        'email': email,
        'password': password
    }
    return jsonify({'result': result})

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/movies', methods=['GET'])
def movies():
    query = request.args.get('search')
    limit = request.args.get('limit')

    conn = sqlite3.connect("tmdb.db")
    cur = conn.cursor()
    cur.execute("select * from movies where title like '%" +
                query + "%' limit " + str(limit) + ";")

    searched_movies = []

    for result in cur:
        
        movie_title = result[17]
        poster = result[20]
        movie_id = result[3]
        searched_movies.append(
            {'title': movie_title, 'rating': 0, 'poster_path': poster, 'movie_id': movie_id})
    return jsonify({'movies': searched_movies})



@app.route('/rated_movies/<user>')
def rated_movies(user):
    movie_list = MovieRating.query.filter_by(username=user)
    
    rated_movies = []

    conn = sqlite3.connect("tmdb.db")
    cur = conn.cursor()
    
    if movie_list:
        for movie in movie_list:
            
            cur.execute("select * from movies where title = ?", (movie.title,))
            for result in cur:
                
                poster = result[20]
                movie_id = result[3]
            rated_movies.append(
                
                {'title': movie.title, 'rating': movie.rating, 'poster_path': poster, 'movie_id': movie_id})

    time.sleep(5)
    return jsonify({'movies': rated_movies})

@app.route('/rec_movies/<user>')
def rec_movies(user):
    movie_list = MovieRating.query.filter_by(username=user)
    rated_movies = []
    recommended_movies = []

    conn = sqlite3.connect("tmdb.db")
    cur = conn.cursor()

    if movie_list:
        for movie in movie_list:
            cur.execute("select * from movies where title = ?", (movie.title,))
            for result in cur:
                
                poster = result[20]
                movie_id = result[3]
            rated_movies.append(
               
                {'title': movie.title, 'rating': movie.rating, 'poster_path': poster, 'movie_id': movie_id})

    
    if rated_movies:
        recommended_list = get_recommendation(rated_movies)
        for movie in recommended_list:
            
            cur.execute("select * from movies where title = ?", (movie,))
            for result in cur:
                
                poster = result[20]
                movie_id = result[3]
            recommended_movies.append(
                
                {'title': movie, 'poster_path': poster, 'movie_id': movie_id})
    time.sleep(8)
    return jsonify({'movies': recommended_movies})



@app.route('/add_rating', methods=['GET', 'POST'])
def add_rating():
    movie_data = request.get_json()

    
    rating = MovieRating.query.filter_by(title=movie_data['title'], username=movie_data['user']).first()
    if rating is not None:
        db.session.delete(rating)
        db.session.commit()

    movie_rating = MovieRating(
        title=movie_data['title'], rating=movie_data['rating'], username=movie_data['user'])

    if movie_data['rating'] != 0:
        db.session.add(movie_rating)
        db.session.commit()

    return 'Done', 201


def delay_func():
    print("Hello")

@app.route('/delay', methods=['GET'])
def delay():
    r = Timer(5.0,delay_func)
    r.start()
    return "Delay worked?",200



