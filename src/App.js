import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./App.css";

let timer;
const App = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const observer = useRef();

  const lastElement = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      console.log("in", entries);
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPageNumber) => prevPageNumber + 1);
      }
    });
    console.log("node", node);
    if (node) observer.current.observe(node);
  };

  console.log("oberser", observer);

  useEffect(() => {
    setData([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    const getSearchItems = async () => {
      const shows = await axios.get(
        `http://openlibrary.org/search.json?title=${query}&page=${page}`
      );
      setLoading(false);
      setHasMore(shows.data.docs.length > 0);
      setData((prevBooks) => {
        return [
          ...new Set([...prevBooks, ...shows.data.docs.map((b) => b.title)]),
        ];
      });
    };

    getSearchItems();
  }, [query, page]);

  const handleChange = (e) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      setQuery(e.target.value);
      setPage(1);
    }, 1000);
  };

  return (
    <div className="searchContainer">
      <input type="text" onChange={(e) => handleChange(e)} />

      {data.map((book, index) => {
        if (data.length === index + 1) {
          return (
            <div className="searchtitle" ref={lastElement} key={book}>
              {book}
            </div>
          );
        } else {
          return (
            <div className="searchtitle" key={book}>
              {book}
            </div>
          );
        }
      })}
      <div>{loading && "Loading..."}</div>
      {/* <div>{error && 'Error'}</div> */}
    </div>
  );
};

export default App;
