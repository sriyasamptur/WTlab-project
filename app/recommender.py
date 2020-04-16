import pandas as pd
import numpy as np
from functools import reduce
from ast import literal_eval
import sqlite3
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity


conn = sqlite3.connect("tmdb.db")
df1 = pd.read_sql_query("select * from credits;", conn)
df2 = pd.read_sql_query("select * from movies;", conn)

df1.columns = ['id', 'tittle', 'cast', 'crew']
df2 = df2.merge(df1, on='id')

C = df2['vote_average'].mean()
m = df2['vote_count'].quantile(0.9)

q_movies = df2.copy().loc[df2['vote_count'] >= m]
q_movies.shape


def weighted_rating(x, m=m, C=C):
    v = x['vote_count']
    R = x['vote_average']
    return (v / (v + m) * R) + (m / (m + v) * C)

q_movies['score'] = q_movies.apply(weighted_rating, axis=1)

q_movies = q_movies.sort_values('score', ascending=False)


def top_n_movies(n):
    return list(q_movies['title'].head(n))


def combine_features(row):
    try:
        return row['keywords'] + " " + row['cast'] + " " + row["genres"] + " " + row["director"]
    except:
        print("Error:", row)


def ctb_recommender(movie_user_likes, num, cosine_sim, df):
    similar_movies = []

    movie_index = df[df.title == movie_user_likes]["index"].values[0]
    similar_movies = list(enumerate(cosine_sim[movie_index]))
    
    
    sorted_similar_movies = sorted(similar_movies, key=lambda x: x[1], reverse=True)

    res = []
    i = 0
    for element in sorted_similar_movies[1:]:
        res.append(df[df.index == element[0]]["title"].values[0])
        i = i + 1
        if i >= num:
            break 

    return res

def get_recommendation(rated_movies):
    df = pd.read_csv("app/improved_tmdb_5000.csv")

    features = ['keywords', 'cast', 'genres', 'director']
    for feature in features:
        df[feature] = df[feature].fillna('')
    df["combined_features"] = df.apply(combine_features, axis=1)

    cv = CountVectorizer()
    count_matrix = cv.fit_transform(df["combined_features"])

    cosine_sim = cosine_similarity(count_matrix)

    total_recommendation = 30

    sorted_rated_movies = sorted(rated_movies, key=lambda m: m.get('rating'), reverse=True)

    total_ratings = reduce(lambda x, y: x + y, 
                    list(map(lambda m: m.get('rating'), sorted_rated_movies)))

    new_rated_movies = []
    for movie in sorted_rated_movies:
        new_rated_movies.append({'title': movie.get('title'),
                        'num': round(movie.get('rating') / total_ratings * total_recommendation)})

    
    recommended_movies_list = []
    for movie in new_rated_movies:
        recommended_movies_list.extend(ctb_recommender(
            movie.get('title'), movie.get('num'), cosine_sim, df))

    movies_list = [movie.get('title') for movie in rated_movies]

    for movie in recommended_movies_list:
        if movie in movies_list:
            recommended_movies_list.remove(movie)

    return list(set(recommended_movies_list)) 

