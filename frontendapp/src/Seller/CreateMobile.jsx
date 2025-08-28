// CreateMobile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./CreateMobile.css";
import { apiUrl } from '../apiconfig';

const CreateMobile = () => {
  const navigate = useNavigate();

  const [mobileData, setMobileData] = useState({
    brand: '',
    model: '',
    description: '',
    mobilePrice: '',
    availableQuantity: ''
  });

  const [errors, setErrors] = useState({
    brand: '',
    model: '',
    description: '',
    mobilePrice: '',
    availableQuantity: ''
  });

  useEffect(() => {
    const editId = localStorage.getItem("editId");
    if (editId && editId !== "") {
      fetchMobileById(editId);
    }
  }, []);

  async function fetchMobileById(id) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/mobile/getMobileById/${id}`, {
        headers: { Authorization: `${token}` }
      });
      setMobileData(response.data);
    } catch (error) {
      console.error("Error fetching mobile:", error);
    }
  }

  const handleInputChange = (e) => {
    setMobileData({ ...mobileData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSaveMobile = async () => {
    const validationErrors = {};

    if (!mobileData.brand) validationErrors.brand = "Brand is required";
    if (!mobileData.model) validationErrors.model = "Model is required";
    if (!mobileData.mobilePrice) validationErrors.mobilePrice = "Price is required";
    if (!mobileData.availableQuantity) validationErrors.availableQuantity = "Quantity is required";
    if (!mobileData.description) validationErrors.description = "Description is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // attach userId from localStorage
    const userData = JSON.parse(localStorage.getItem("userData"));
    const payload = { ...mobileData, userId: userData.userId };

    try {
      const token = localStorage.getItem("token");
      const editId = localStorage.getItem("editId");

      if (!editId || editId === "") {
        // create
        const createResponse = await axios.post(`${apiUrl}/mobile/addMobile`, payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`
          }
        });
        if (createResponse.status === 200) {
          navigate("/sellerviewmobiles");
        }
      } else {
        // update
        const updateResponse = await axios.put(`${apiUrl}/mobile/updateMobile/${editId}`, payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`
          }
        });
        if (updateResponse.status === 200) {
          localStorage.setItem("editId", "");
          navigate("/sellerviewmobiles");
        }
      }
    } catch (error) {
      console.error("Error saving mobile:", error);
      // navigate("/error");
    }
  };

  return (
    <div className="create-mobile-container">
      <button onClick={() => navigate(-1)}>Back</button>

      {localStorage.getItem("editId") === "" ? <h2>Add New Mobile</h2> : <h2>Update Mobile</h2>}

      <div className="form-group">
        <label>Brand:</label>
        <input
          type="text"
          name="brand"
          value={mobileData.brand}
          onChange={handleInputChange}
        />
        <span className="error-message">{errors.brand}</span>
      </div>

      <div className="form-group">
        <label>Model:</label>
        <input
          type="text"
          name="model"
          value={mobileData.model}
          onChange={handleInputChange}
        />
        <span className="error-message">{errors.model}</span>
      </div>

      <div className="form-group">
        <label>Price:</label>
        <input
          type="number"
          name="mobilePrice"
          value={mobileData.mobilePrice}
          onChange={handleInputChange}
        />
        <span className="error-message">{errors.mobilePrice}</span>
      </div>

      <div className="form-group">
        <label>Description:</label>
        <textarea
          name="description"
          value={mobileData.description}
          onChange={handleInputChange}
        />
        <span className="error-message">{errors.description}</span>
      </div>

      <div className="form-group">
        <label>Available Quantity:</label>
        <input
          type="number"
          name="availableQuantity"
          value={mobileData.availableQuantity}
          onChange={handleInputChange}
        />
        <span className="error-message">{errors.availableQuantity}</span>
      </div>

      <button className='submit-button' type="button" onClick={handleSaveMobile}>
        {localStorage.getItem("editId") === "" ? "Add Mobile" : "Update Mobile"}
      </button>
    </div>
  );
};

export default CreateMobile;
