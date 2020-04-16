import pandas as pd
import numpy as np
import sqlite3
from collections import OrderedDict


conn = sqlite3.connect("tmdb.db")
df1 = pd.read_sql_query("select * from credits;", conn)
df2 = pd.read_sql_query("select * from movies;", conn)

df1.columns = ['id', 'tittle', 'cast', 'crew']
df2 = df2.merge(df1, on='id')

def all_movies():
    return list(df2['title'])
