import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";  // Named import from firebase.js


const SalesForm = () => {
  const [formData, setFormData] = useState({
    Item_Name: "",
    Unit_Price: "",
    Quantity: "",
    Total_Price: 0,
  });
  const [entries, setEntries] = useState([]);

  // Fetch existing sales data from Firestore when component mounts
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "sales"));
      const salesData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        ID: doc.id, // Firestore doc ID
      }));
      setEntries(salesData);
    };
    fetchData();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission to add a new entry
  const handleSubmit = async (e) => {
    e.preventDefault();

    const Total_Price =
      parseFloat(formData.Unit_Price) * parseInt(formData.Quantity);

    const newEntry = {
      Item_Name: formData.Item_Name,
      Unit_Price: parseFloat(formData.Unit_Price),
      Quantity: parseInt(formData.Quantity),
      Total_Price: Total_Price,
    };

    // Add new entry to Firestore
    try {
      const docRef = await addDoc(collection(db, "sales"), newEntry);
      setEntries((prevEntries) => [
        ...prevEntries,
        { ...newEntry, ID: docRef.id },
      ]);
      setFormData({
        Item_Name: "",
        Unit_Price: "",
        Quantity: "",
        Total_Price: 0,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Handle delete action
  const handleDelete = async (ID) => {
    try {
      await deleteDoc(doc(db, "sales", ID));
      setEntries((prevEntries) => prevEntries.filter((entry) => entry.ID !== ID));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <div className="sales-form-container">
      <h1>SALES FORM</h1>
      <form onSubmit={handleSubmit} className="sales-form">
        <div>
          <label>Item Name</label>
          <input
            type="text"
            name="Item_Name"
            value={formData.Item_Name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Unit Price</label>
          <input
            type="number"
            name="Unit_Price"
            value={formData.Unit_Price}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div>
          <label>Quantity</label>
          <input
            type="number"
            name="Quantity"
            value={formData.Quantity}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Add Item
        </button>
      </form>

      <h2>Sales Details</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((item) => (
            <tr key={item.ID}>
              <td>{item.Item_Name}</td>
              <td>
                {item.Unit_Price ? `$${item.Unit_Price.toFixed(2)}` : "N/A"}
              </td>
              <td>{item.Quantity}</td>
              <td>
                {item.Total_Price ? `$${item.Total_Price.toFixed(2)}` : "N/A"}
              </td>
              <td>
                <button
                  onClick={() => handleDelete(item.ID)}
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3">Total Sales</td>
            <td>
              $
              {entries
                .reduce((acc, item) => acc + (item.Total_Price || 0), 0)
                .toFixed(2)}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default SalesForm;
