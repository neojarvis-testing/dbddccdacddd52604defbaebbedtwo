// SellerMobiles.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SellerMobiles.css";
import axios from "axios";
import { apiUrl } from "../apiconfig.js";

const SellerMobiles = () => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [mobileToBeDelete, setMobileToBeDelete] = useState(null);
  const [mobiles, setMobiles] = useState([]);
  const [filteredMobiles, setFilteredMobiles] = useState([]); // 👈 for frontend filter
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("editId", "");
    fetchMobiles();
  }, [sortValue]);

  useEffect(() => {
    handleSearch(); // 👈 re-run filtering whenever searchTerm changes
  }, [searchTerm, mobiles]);

  async function fetchMobiles() {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        apiUrl + "/mobile/getMobilesByUserId",
        {
          searchValue: "", // backend fetches all initially
          sortValue: sortValue,
          userId: JSON.parse(localStorage.getItem("userData")).userId,
        },
        { headers: { Authorization: `${token}` } }
      );

      if (response.status === 200) {
        setMobiles(response.data);
        setFilteredMobiles(response.data); // initial load
      }
    } catch (error) {
      navigate("/error");
    }
  }

  // 🔍 Frontend Search
  function handleSearch() {
    if (!searchTerm.trim()) {
      setFilteredMobiles(mobiles);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = mobiles.filter(
        (m) =>
          m.brand.toLowerCase().includes(lowerSearch) ||
          m.model.toLowerCase().includes(lowerSearch)
      );
      setFilteredMobiles(filtered);
    }
  }

  const handleDeleteClick = (id) => {
    setMobileToBeDelete(id);
    setShowDeletePopup(true);
  };

  async function deleteMobile() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        apiUrl + `/mobile/deleteMobile/${mobileToBeDelete}`,
        { headers: { Authorization: `${token}` } }
      );

      if (response.status === 200) {
        fetchMobiles();
      }
      setShowDeletePopup(false);
    } catch (error) {
      navigate("/error");
    }
  }

  return (
    <div>
      <div className={`ProductsList ${showDeletePopup ? "popup-open" : ""}`}>
        <nav className="navbar">
          <div className="navbar-left">
            <h2 className="logo">MyMobiles</h2>
          </div>
          <div className="navbar-right">
            <button className="nav-btn" onClick={() => navigate("/addmobile")}>
              Add Mobile
            </button>
            <button
              className="nav-btn logout"
              onClick={() => navigate("/login")}
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Search functionality */}
        <input
          type="text"
          placeholder="Search by brand or model"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Sort dropdown */}
        <div className="sort-container">
          <label htmlFor="sortPrice">Sort by Price: </label>
          <select
            id="sortPrice"
            value={sortValue}
            onChange={(e) => setSortValue(Number(e.target.value))}
          >
            <option value={1}>Low to High</option>
            <option value={-1}>High to Low</option>
          </select>
        </div>

        {/* Table layout */}
        <table>
          <thead>
            <tr>
              <th>Brand</th>
              <th>Model</th>
              <th>Description</th>
              <th>Price</th>
              <th>Available Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredMobiles.length ? (
              filteredMobiles.map((mobile) => (
                <tr key={mobile._id}>
                  <td>{mobile.brand}</td>
                  <td>{mobile.model}</td>
                  <td>{mobile.description}</td>
                  <td>{mobile.mobilePrice}</td>
                  <td>{mobile.availableQuantity}</td>
                  <td>
                    <button
                      style={{ backgroundColor: "red", marginRight: "10px" }}
                      onClick={() => handleDeleteClick(mobile._id)}
                    >
                      Delete
                    </button>
                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() => {
                        localStorage.setItem("editId", mobile._id);
                        navigate("/addmobile");
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="norecord"
                  colSpan={6}
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDeletePopup && (
        <div className="delete-popup">
          <p>Are you sure you want to delete this mobile?</p>
          <button onClick={deleteMobile}>Yes, Delete</button>
          <button onClick={() => setShowDeletePopup(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default SellerMobiles;