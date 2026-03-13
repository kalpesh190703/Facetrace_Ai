import "../assets/css/addRecord.css";

export default function AddRecord() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const res = await fetch("http://localhost:5000/api/add-record", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (res.ok) {
      alert("Record added successfully");
      e.target.reset();
    } else {
      alert("Error adding record");
    }
  };

  return (
    <div className="container">
      <h1>➕ Add Person Record</h1>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="name" placeholder="Name" required />
        <input name="age" type="number" placeholder="Age" required />
        <input name="city" placeholder="City" required />

        <select name="category">
          <option value="criminal">Criminal</option>
          <option value="missing person">Missing Person</option>
        </select>

        <textarea name="details" placeholder="Details" />

        <input type="file" name="images" multiple required />

        <button type="submit">Save Record</button>
      </form>
    </div>
  );
}
