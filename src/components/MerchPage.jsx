import React, { useState } from 'react';
import { ShoppingCart, XCircle } from 'lucide-react';
import HeaderBgImage from '../assets/merch.png';
import Jersey1 from '../assets/merch/jersey1.png';
import Jersey2 from '../assets/merch/jersey2.png';
import Jersey3 from '../assets/merch/jersey3.png';
import toast, { Toaster } from 'react-hot-toast';

function MerchPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedJersey, setSelectedJersey] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    middleInitial: '',
    lastName: '',
    sex: '',
    phoneNumber: '',
    email: '',
    size: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const jerseys = [
    { id: 1, name: 'Green Jersey', price: 'PRICE SOON', description: 'Student', image: Jersey1 },
    { id: 2, name: 'Fire Nation Jersey 1', price: 'PRICE SOON', description: 'w/ Event Name', image: Jersey2 },
    { id: 3, name: 'Fire Nation Jersey 2', price: 'PRICE SOON', description: 'w/ Back Number', image: Jersey3 },
  ];

  const openModal = (jersey) => {
    setSelectedJersey(jersey);
    setShowModal(true);
    setSubmitted(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setErrors({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.sex) newErrors.sex = 'Sex is required';
    if (!formData.size) newErrors.size = 'Size is required';
    if (!formData.phoneNumber.match(/^[0-9]{10,15}$/)) newErrors.phoneNumber = 'Enter a valid phone number';
    if (!formData.email.match(/^[^@\s]+@lsu\.edu\.ph$/)) newErrors.email = 'Use a valid LSU email address';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((error) => toast.error(error, { duration: 3000 }));
      console.log(errors);
      return false;
    }

    return true;
  };

  const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbwBrZPx3e383nNUXTrEAPipMhuujMBWVm-3tYVLV7zZ00JoEoQWNY9kmFTFd18YQBNv/exec";

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!validateForm() || loading) return; // Prevent multiple submissions
  
    setLoading(true); // Disable button
    const payload = new URLSearchParams();
    
    Object.keys(formData).forEach((key) => {
      payload.append(key, formData[key]);
    });
    payload.append("jerseyName", selectedJersey.name);
  
    try {
      await fetch(GOOGLE_SHEET_WEBHOOK, {
        method: "POST",
        body: payload,
      });
  
      toast.success("Pre-order submitted successfully!");
  
      // ✅ Reset form fields after submission
      setFormData({
        firstName: '',
        middleInitial: '',
        lastName: '',
        sex: '',
        phoneNumber: '',
        email: '',
        size: ''
      });
  
      setErrors({}); // Clear validation errors
      setSubmitted(true);
    } catch (error) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false); // Re-enable button
    }
  };
  
  return (
    <>
      <Toaster />
      
      {/* Header Section */}
      <div className="bg-[#087830] text-white py-12 px-8">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-6xl font-bold flex items-center gap-2">
            Merch
          </h1>
          <p className="max-w-md text-xl italic text-end">Grab your exclusive SOURCE Merch now!</p>
        </div>
      </div>

      {/* Background Image Section */}
      <div className="relative w-full" style={{ height: '400px' }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${HeaderBgImage})`,
            height: '100%',
            width: '100%',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: '#014018',
              opacity: 0.6,
            }}
          ></div>
        </div>
      </div>


      <div className="bg-gray-100">
        <div className="p-10 max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            Jerseys
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jerseys.map((jersey) => (
              <div key={jersey.id} className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                <div className="w-full aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${jersey.image})` }}></div>
                <div className="p-5 text-center">
                  <h3 className="text-xl font-semibold">{jersey.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{jersey.description}</p>
                  <p className="text-lg text-gray-600 font-medium">{jersey.price}</p>
                  <button
                    onClick={() => openModal(jersey)}
                    className="bg-[#087830] text-white px-5 py-2 mt-4 inline-flex items-center gap-2 rounded-md text-lg font-semibold hover:bg-[#065d24] transition-all"
                  >
                    <ShoppingCart /> Pre-Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && selectedJersey && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full max-h-[70vh] overflow-y-auto relative">
          
          {/* ❌ Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          >
            <XCircle size={24} />
          </button>

          {submitted ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
              <p>Cash: SOURCE Buficom</p>
              <p>GCash: SOON</p>
              <button 
                onClick={closeModal} 
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md w-full"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center mb-4">Pre-Order</h2>
              <div className="flex flex-col items-center mb-4">
                <img 
                  src={selectedJersey.image} 
                  alt={selectedJersey.name} 
                  className="w-24 h-24 object-cover rounded-md" 
                />
                <p className="text-lg font-semibold mt-2">{selectedJersey.name}</p>
              </div>
              
              {/* Form Fields */}
              <input 
                type="text" name="firstName" placeholder="First Name" 
                onChange={handleChange} className="w-full p-2 border rounded mb-2" 
              />
              <input 
                type="text" name="middleInitial" placeholder="Middle Initial" 
                onChange={handleChange} className="w-full p-2 border rounded mb-2" 
              />
              <input 
                type="text" name="lastName" placeholder="Last Name" 
                onChange={handleChange} className="w-full p-2 border rounded mb-2" 
              />
              <select 
                name="sex" onChange={handleChange} 
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input 
                type="text" name="phoneNumber" placeholder="Phone Number" 
                onChange={handleChange} className="w-full p-2 border rounded mb-2" 
              />
              <input 
                type="email" name="email" placeholder="LSU Email" 
                onChange={handleChange} className="w-full p-2 border rounded mb-2" 
              />
              <select 
                name="size" onChange={handleChange} 
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">Select Size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>

              {/* Submit Button with Loading State */}
              <button 
                onClick={handleSubmit} 
                className={`bg-[#087830] text-white px-4 py-2 rounded-md w-full mt-4 
                  ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#065d24]"}`} 
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </>
          )}
        </div>
      </div>
)}

    </>
  );
}

export default MerchPage;
