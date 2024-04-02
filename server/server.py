from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os

app= Flask(__name__)
CORS(app)

@app.route('/get_movie_names', methods=['GET'])


def get_movie_names():
    try:
       movies_path= os.path.abspath("C:/Users/hp/Documents/Jupyter notebook/New folder/web/server/artifacts/movies.pkl")
       movies_list=pickle.load(open(movies_path, 'rb'))
       print("Hello world")

    # movies_list= movies_list['title'].value()
       movies_titles = movies_list.get('title', []).tolist()
       response = jsonify({
         'locations': movies_titles
       })
       response.headers.add('Access-Control-Allow-Origin', '*')

       return response
    except Exception as err:
        print(f"An error occurred: {err}")

@app.route('/recommend', methods=['POST', 'GET'])
def recommend():
    print("Hello world")
    
    movies= request.json['movies']
    movies_path= os.path.abspath("C:/Users/hp/Documents/Jupyter notebook/New folder/web/server/artifacts/movies.pkl")
    similarity_path= os.path.abspath("C:/Users/hp/Documents/Jupyter notebook/New folder/web/server/artifacts/similarity.pkl")
    similarity= pickle.load(open(similarity_path, 'rb'))
    new_df=pickle.load(open(movies_path, 'rb'))

    movie_index= new_df[new_df['title']==movies].index[0]
    distances= similarity[movie_index]
    movie_list= sorted(list(enumerate(distances)), reverse=True, key= lambda x: x[1])[1:6]
    print(len(movie_list))
    
    recommend_movies=[]

    for i in movie_list:
        # print(i[0])
        recommend_movies.append(new_df.iloc[i[0]].title)
        # print(new_df.iloc[i[0]].title)
    response= jsonify({
        'movies': recommend_movies
    })
    
    return response

@app.route("/getposter", methods=['GET,POST'])

def getposter():
    list= request.json['movies']
    
    



if __name__ =="__main__":
    print("server has started successfully")
    app.run()