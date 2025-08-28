import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MobilesList.css";
import axios from "axios";
import { apiUrl } from "../apiconfig";

const MobilesList = () => {
  const [mobiles, setMobiles] = useState([]);
  const [filteredMobiles, setFilteredMobiles] = useState([]);
  const [selectedMobile, setSelectedMobile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMobiles();
  }, [sortValue]);

  async function fetchMobiles() {
    try {
      let userResponse = await axios.get(apiUrl + "/user/getAllUsers", {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      });
      userResponse = await userResponse.data;

      let mobileResponse = await axios.post(
        apiUrl + "/mobile/getAllMobiles",
        { sortValue: sortValue },
        { headers: { Authorization: `${localStorage.getItem("token")}` } }
      );

      mobileResponse = await mobileResponse.data;

      // Match mobiles with user details
      mobileResponse.forEach((mobile) => {
        userResponse.forEach((user) => {
          if (mobile.userId === user._id) {
            mobile.userName = user.firstName + " " + user.lastName;
            mobile.userEmail = user.email;
            mobile.userPhone = user.mobileNumber;
          }
        });
      });

      setMobiles(mobileResponse);
      setFilteredMobiles(mobileResponse);
    } catch (error) {
      navigate("/error");
    }
  }

  // Search handler (filters by brand or model)
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = mobiles.filter(
      (mobile) =>
        mobile.brand.toLowerCase().includes(value) ||
        mobile.model.toLowerCase().includes(value)
    );

    setFilteredMobiles(filtered);
  };

  const openPopup = (mobile) => {
    setSelectedMobile(mobile);
    setShowPopup(true);
  };

  const closePopup = () => {
    setSelectedMobile(null);
    setShowPopup(false);
  };

  return (
    <div className="MobilesList">
      <button
        className="styledbutton"
        onClick={() => {
          navigate("/login");
        }}
      >
        Logout
      </button>
      <h1>Available Mobiles</h1>

      {/* Search functionality */}
      <input
        type="text"
        placeholder="Search by brand or model"
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Table layout */}
      <table>
        <thead>
          <tr>
            <th>Brand</th>
            <th>Model</th>
            <th>Description</th>
            <th>
              Price
              <div>
                <button
                  className="sortButtons"
                  onClick={() => setSortValue(1)}
                >
                  ⬆️
                </button>
                <button
                  className="sortButtons"
                  onClick={() => setSortValue(-1)}
                >
                  ⬇️
                </button>
              </div>
            </th>
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
                <td>
                  <button onClick={() => openPopup(mobile)}>View Info</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="norecord"
                colSpan={5}
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Popup to display additional information */}
      {showPopup && selectedMobile && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>
              &times;
            </span>
            <h2>
              {selectedMobile.brand} {selectedMobile.model} Details
            </h2>
            <p>Description: {selectedMobile.description}</p>
            <p>Price: {selectedMobile.mobilePrice}</p>
            <p>Available Quantity: {selectedMobile.availableQuantity}</p>
            <p>Posted By: {selectedMobile.userName}</p>
            <p>Contact Email: {selectedMobile.userEmail}</p>
            <p>Contact Phone: {selectedMobile.userPhone}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobilesList;
