import { useState } from "react";
import * as Yup from "yup";

const FormValidation = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    employeeID: "",
    email: "",
    phoneNumber: "",
    department: "",
    dateOfJoining: "",
    role: "",
  });

  const [errors, setErrors] = useState({});

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    employeeID: Yup.string()
      .max(10, "Employee ID cannot exceed 10 characters")
      .required("Employee ID is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone Number must be 10 digits")
      .required("Phone Number is required"),
    department: Yup.string().required("Department is required"),
    dateOfJoining: Yup.date()
      .max(new Date(), "Date of Joining cannot be in the future")
      .required("Date of Joining is required"),
    role: Yup.string().required("Role is required"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        // Validate form data using Yup
        await validationSchema.validate(formData, { abortEarly: false });

        // Send the data to the backend
        const response = await fetch("http://127.0.0.1:5000/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            console.log("Form Submitted Successfully:", formData);
            alert(result.message); // Show success message
            // Clear the form on success
            setFormData({
                firstName: "",
                lastName: "",
                employeeID: "",
                email: "",
                phoneNumber: "",
                department: "",
                dateOfJoining: "",
                role: "",
            });
            setErrors({});
        } else {
            console.log("Backend Validation Error:", result.message);
            alert(result.message); // Show backend validation error
        }
    } catch (error) {
        if (error.name === "ValidationError") {
            // Collect Yup validation errors
            const newErrors = {};
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
        } else {
            // Handle network or other unexpected errors
            console.error("An unexpected error occurred:", error);
            alert("An unexpected error occurred. Please try again later.");
        }
    }
};

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      employeeID: "",
      email: "",
      phoneNumber: "",
      department: "",
      dateOfJoining: "",
      role: "",
    });
    setErrors({});
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div>
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          placeholder="Enter your first name"
          onChange={handleChange}
        />
        {errors.firstName && <div className="error">{errors.firstName}</div>}
      </div>
      <div>
        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          placeholder="Enter your last name"
          onChange={handleChange}
        />
        {errors.lastName && <div className="error">{errors.lastName}</div>}
      </div>
      <div>
        <label>Employee ID:</label>
        <input
          type="text"
          name="employeeID"
          value={formData.employeeID}
          placeholder="Enter your Employee ID"
          onChange={handleChange}
        />
        {errors.employeeID && <div className="error">{errors.employeeID}</div>}
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Enter your email"
          onChange={handleChange}
        />
        {errors.email && <div className="error">{errors.email}</div>}
      </div>
      <div>
        <label>Phone Number:</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          placeholder="Enter your phone number"
          onChange={handleChange}
        />
        {errors.phoneNumber && <div className="error">{errors.phoneNumber}</div>}
      </div>
      <div>
        <label>Department:</label>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
        >
          <option value="">Select Department</option>
          <option value="HR">HR</option>
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Marketing</option>
          <option value="Intern">Intern</option>
        </select>
        {errors.department && <div className="error">{errors.department}</div>}
      </div>
      <div>
        <label>Date of Joining:</label>
        <input
          type="date"
          name="dateOfJoining"
          value={formData.dateOfJoining}
          onChange={handleChange}
        />
        {errors.dateOfJoining && (
          <div className="error">{errors.dateOfJoining}</div>
        )}
      </div>
      <div>
        <label>Role:</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          placeholder="Enter your role"
          onChange={handleChange}
        />
        {errors.role && <div className="error">{errors.role}</div>}
      </div>
      <button type="submit">Submit</button>
      <button type="button" onClick={handleReset} style={{ marginLeft: "10px" }}>
        Reset
      </button>
    </form>
  );
};

export default FormValidation;
