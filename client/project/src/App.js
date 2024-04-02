import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react'
import { useState } from 'react';
import styled from 'styled-components';

function App() {

  const [location, setLocation] = useState(null);
  const [data, setData] = useState({ Location: '' });
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const FormHandler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const getData = () => {
    fetch("http://127.0.0.1:5000/get_movie_names")
      .then((res) => res.json())
      .then((res) => {
        setLocation(res.locations);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  const showmovies = async (m) => {
    setLoading(true);
    let promises = m.map(movie =>
      fetch(`https://www.omdbapi.com/?apikey=893359a1&t=${movie}`)
        .then((res) => res.json())
        .then((res) => ({
          name: res.Title,
          poster: res.Poster
        }))
        .catch((err) => {
          console.log(err);
          return null;
        })
    );

    Promise.all(promises)
      .then(results => {
        setMovies(results.filter(movie => movie !== null));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const getMovies = () => {
    if (data.Location !== '') {
      fetch("http://127.0.0.1:5000/recommend", {
        method: 'POST',
        body: JSON.stringify({ 'movies': data.Location }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
        .then((res) => res.json())
        .then((res) => {
          showmovies(res.movies);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  return (
    <Head>
      <Text2>Movie Recommendation System</Text2>
      <Select name="Location" value={data.Location} onChange={FormHandler}>
        <Option value="" disabled defaultValue>
          Select a location
        </Option>
        {location && location.map((e, index) => (
          <Option key={index} value={e}>
            {e}
          </Option>
        ))}
      </Select>
      <Button onClick={getMovies}>Recommend</Button>
      <Head2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Head4>
            {movies.map((movie, index) => (
              <Head3 key={index}>
                <img src={movie.poster} alt={`Image ${index}`} style={{ height: '20rem', width: '15rem' }} />
                <Text>{movie.name}</Text>
              </Head3>
            ))}
          </Head4>
        )}
      </Head2>
    </Head>
  );
}

const Option = styled.option``;

const Text2= styled.h1`
color: white;
font-size: 3rem;
`

const Head = styled.div`
min-height: 100vh;
height: 100%;
width: 100%;
display: flex;
justify-content: start;
align-items: center;
background-color: #191b21;
// background-color: #212631;
flex-direction: column;
`

const Text = styled.h1`
color: white;
font-size: 1.5rem;
width: 12rem;
`

const Head2 = styled.div`
display: flex;
justify-content: center;
align-items: center;
margin-top: 1rem;
`

const Head3 = styled.div`
margin: 1rem;

`

const Head4 = styled.div`
display: flex;
flex-wrap: wrap;
justify-content: center;
`

const Select = styled.select`
  margin-top: 5rem;
  margin-bottom: 1rem;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  background-color: #212631;
  color: white;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  @media (min-width: 768px) {
    font-size: 18px; /* Adjusted font size for desktop screens */
  }
`;

export default App;
