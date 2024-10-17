import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Content.css";

function Content() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:9009/api/v1/field")
      .then((response) => {
        if (Array.isArray(response.data.fields)) {
          setData(response.data.fields);
        } else {
          setData([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("There was an error fetching the data!");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <div className="contentWrapper">
        <div className="fieldtypeList">
          {data.map((item) => (
            <div
              key={item._id}
              className="field field1"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${
                  item.image ? item.image : "/path/to/default-image.jpg"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <p>{item.name}</p>
              <p>
                <strong>{item.quantity}</strong> sân
              </p>
              <a href="/booking" className="orderBtn">
                Đặt sân
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Content;
