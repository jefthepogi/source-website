import React, { useState } from 'react';
import { ShoppingCart, XCircle, ArrowLeft } from 'lucide-react';
import { FaMoneyBill, FaMobileAlt } from 'react-icons/fa';
import HeaderBgImage from '../assets/merch.png';
import Jersey1 from '../assets/merch/jersey1.png';
import Jersey2 from '../assets/merch/jersey2.png';
import Jersey3 from '../assets/merch/jersey3.png';
import RomeoImg from '../assets/officers-img/romeo.png';
import MaricarImg from '../assets/officers-img/maricar.png';
import RusselImg from '../assets/officers-img/russel.png';
import QRCodeImg from '../assets/merch/qr-code.jpg';
import toast, { Toaster } from 'react-hot-toast';

const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbwUmYr6O2duKZ4QSfGNoIIQF1IgcHNP3v2vfSR0ThqibMZ6mE_FlbtXHkjLHrV8oJQ4/exec";

const jerseySpecificFields = {
    1: (handleChange) => (
        <select name="role" onChange={handleChange} className="w-full p-2 border rounded mb-2">
            <option value="">Select Role</option>
            <option value="Student">Student</option>
            <option value="Officer">Officer</option>
            <option value="Faculty">Faculty</option>
        </select>
    ),
    2: (handleChange) => (
        <select name="eventName" onChange={handleChange} className="w-full p-2 border rounded mb-2">
            <option value="">Select Event</option>
            <option value="Event Head">Event Head</option>
            <option value="Hip Hop">Hip Hop Competition</option>
            <option value="Tinig Sintunado">Tinig Sintunado</option>
            <option value="Tinig ng Agila">Tinig ng Agila</option>
            <option value="Video Parody">Video Parody</option>
            <option value="Quiz Bee">Quiz Bee</option>
            <option value="Poster Slogan Making">Poster Slogan Making</option>
            <option value="Video Competition">Video Competition</option>
            <option value="Chess">Chess</option>
            <option value="Scrabble">Scrabble</option>
            <option value="Word Factory">Word Factory</option>
            <option value="Mobile Legends">Mobile Legends</option>
            <option value="Valorant">Valorant</option>
            <option value="CODM">CODM</option>
            <option value="Team Building">Team Building</option>
        </select>
    ),
3: (handleChange, formData) => (
        <>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sleeveless?</label>
            <select name="sleeveless" onChange={handleChange} value={formData.sleeveless} className="w-full p-2 border rounded mb-2">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>
            <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">Back Number</label>
            <input
                type="text"
                name="backNumber"
                placeholder="Enter Back Number" // More descriptive placeholder
                onChange={handleChange}
                value={formData.backNumber}
                className="w-full p-2 border rounded mb-2"
            />
        </>
    ),
};

const paymentOptions = [
    { value: 'Cash', label: 'Cash', icon: <FaMoneyBill size={20} /> },
    { value: 'GCash', label: 'GCash', icon: <FaMobileAlt size={20} /> },
];

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
        merchType: '',
        size: '',
        role: 'N/A',
        eventName: 'N/A',
        backNumber: 'N/A',
        sleeveless: 'No',
        paymentMethod: '',
        gcashReference: 'N/A',
    });
    const [loading, setLoading] = useState(false);
    const [formStep, setFormStep] = useState(1);

    const jerseys = [
        { id: 1, name: 'Green Jersey', price: '₱350.00', description: 'Student/Officer/Faculty', image: Jersey1 },
        { id: 2, name: 'Fire Nation Event Jersey', price: '₱350.00', description: 'w/ Event Name', image: Jersey2 },
        { id: 3, name: 'Fire Nation Sports Jersey', price: '₱350.00', description: 'w/ Back Number', image: Jersey3 },
    ];

    const officers = [
        { name: 'Romeo S. Jagonia Jr.', image: RomeoImg },
        { name: 'Maricar C. Roda', image: MaricarImg },
        { name: 'Russel Ashley R. Dolera', image: RusselImg },
    ];

    const openModal = (jersey) => {
        setSelectedJersey(jersey);
        setShowModal(true);
        setFormData({
            ...formData,
            paymentMethod: '',
            gcashReference: '',
            merchType: jersey.name,
            role: 'N/A',
            eventName: 'N/A',
            backNumber: 'N/A',
            sleeveless: 'No',
        });
        setFormStep(1);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({
            firstName: '',
            middleInitial: '',
            lastName: '',
            sex: '',
            phoneNumber: '',
            email: '',
            size: '',
            merchType: '',
            role: 'N/A',
            eventName: 'N/A',
            backNumber: 'N/A',
            sleeveless: 'No',
            paymentMethod: '',
            gcashReference: '',
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const errors = [];
        if (!formData.firstName.trim()) errors.push('First name is required');
        if (!formData.lastName.trim()) errors.push('Last name is required');
        if (!formData.sex) errors.push('Sex is required');
        if (!formData.phoneNumber.match(/^[0-9]{10,15}$/)) errors.push('Enter a valid phone number');
        if (!formData.email.match(/^[^@\s]+@lsu\.edu\.ph$/)) errors.push('Use a valid LSU email address');
        if (!formData.size) errors.push('Size is required');

        if (selectedJersey.id === 1 && formData.role === 'N/A') errors.push('Role is required');
        if (selectedJersey.id === 2 && formData.eventName === 'N/A') errors.push('Event name is required');
        if (selectedJersey.id === 3 && formData.backNumber === 'N/A') errors.push('Back number is required');
        if (selectedJersey.id === 3 && formData.sleeveless === '') errors.push('Sleeveless option is required');
        if (formStep === 3 && formData.paymentMethod === 'GCash' && !formData.gcashReference.trim())
            errors.push('Reference number is required for GCash payments');

        if (errors.length > 0) {
            errors.forEach(error => toast.error(error, { duration: 3000 }));
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm() || loading) return;
        setLoading(true);
        const payload = new URLSearchParams();
        Object.keys(formData).forEach((key) => payload.append(key, formData[key]));
        payload.append("jerseyName", selectedJersey.name);
        try {
            await fetch(GOOGLE_SHEET_WEBHOOK, { method: "POST", body: payload });
            toast.success("Pre-order submitted successfully!");
            closeModal();
        } catch (error) {
            toast.error("Submission failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderJerseySpecificFields = () => {
        const SpecificFieldComponent = jerseySpecificFields[selectedJersey.id];
        return SpecificFieldComponent ? SpecificFieldComponent(handleChange, formData) : null;
    };

    const handlePaymentSelection = (method) => {
        setFormData({ ...formData, paymentMethod: method });
        setFormStep(3);
    };

    const renderPaymentOptions = () => (
        <div>
            <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
            <div className="flex flex-col">
                {paymentOptions.map(option => (
                    <button
                        key={option.value}
                        onClick={() => handlePaymentSelection(option.value)}
                        className="w-full bg-gray-200 p-2 rounded-md mb-2 flex items-center justify-center gap-2"
                    >
                        {option.icon} {option.label}
                    </button>
                ))}
            </div>
            <button onClick={() => setFormStep(1)} className="mt-2 text-gray-600">
                <ArrowLeft size={24} />
            </button>
        </div>
    );

    const renderPaymentDetails = () => {
        const handleBackToPayment = () => {
            setFormStep(2);
        };
        if (formData.paymentMethod === 'Cash') {
            return (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Cash Payment</h2>
                    <p className="text-gray-600 text-sm mb-4">Reach out to one of the officers below to arrange your cash payment.</p>
                    <div className="flex flex-col">
                        {officers.map((officer) => (
                            <div key={officer.name} className="flex items-center mb-2">
                                <img src={officer.image} alt={officer.name} className="w-12 h-12 rounded-full mr-2" />
                                <span>{officer.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between">
                        <button onClick={handleBackToPayment} className="mt-2 text-gray-600">
                            <ArrowLeft size={24} />
                        </button>
                        <button
                            onClick={handleSubmit}
                            className={`bg-[#087830] text-white px-4 py-2 rounded-md  mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#065d24]'}`}
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>
            );
        } else if (formData.paymentMethod === 'GCash') {
            return (
                <div>
                    <h2 className="text-xl font-semibold mb-4">GCash Payment</h2>
                    <p className="text-gray-600 text-sm mb-4">Open the GCash App and use it to scan this QR code.</p>
                    <img src={QRCodeImg} alt="GCash QR Code" className="w-48 h-48 mx-auto" />
                    <p className="text-center mt-2 text-gray-600">GCash Number: 09157924836</p>
                    <input
                        type="text"
                        placeholder="Reference Number"
                        name="gcashReference"
                        value={formData.gcashReference}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mb-2 mt-4"
                    />
                    <div className="flex justify-between">
                        <button onClick={handleBackToPayment} className="mt-2 text-gray-600">
                            <ArrowLeft size={24} />
                        </button>
                        <button
                            onClick={handleSubmit}
                            className={`bg-[#087830] text-white px-4 py-2 rounded-md mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#065d24]'}`}
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>
            );
        }
        return null;
    };

    const renderContent = () => {
        switch (formStep) {
            case 1:
                return (
                    <>
                        <h2 className="text-2xl font-bold text-center mb-4">Pre-Order</h2>
                        <div className="flex flex-col items-center mb-4">
                            <img src={selectedJersey.image} alt={selectedJersey.name} className="w-24 h-24 object-cover rounded-md" />
                            <p className="text-lg font-semibold mt-2">{selectedJersey.name}</p>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
                        {['firstName', 'middleInitial', 'lastName', 'phoneNumber', 'email'].map((name) => {
                            let placeholder;
                            if (name === 'firstName') {
                                placeholder = 'First Name';
                            } else if (name === 'middleInitial') {
                                placeholder = 'Middle Initial';
                            } else if (name === 'lastName') {
                                placeholder = 'Last Name';
                            } else if (name === 'phoneNumber') {
                                placeholder = 'Phone Number';
                            } else if (name === 'email') {
                                placeholder = 'Email';
                            }

                            return (
                                <input
                                    key={name}
                                    type="text"
                                    name={name}
                                    placeholder={placeholder}
                                    onChange={handleChange}
                                    value={formData[name]}
                                    className="w-full p-2 border rounded mb-2"
                                />
                            );
                        })}
                        <select name="sex" onChange={handleChange} value={formData.sex} className="w-full p-2 border rounded mb-2">
                            <option value="">Select Sex</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <h3 className="text-xl font-semibold mb-2 mt-4">Merch Information</h3>
                        <select name="size" onChange={handleChange} value={formData.size} className="w-full p-2 border rounded mb-2">
                            <option value="">Select Size</option>
                            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                        {renderJerseySpecificFields()}
                        <button
                            onClick={() => {
                                if (validateForm()) setFormStep(2);
                            }}
                            className={`bg-[#087830] text-white px-4 py-2 rounded-md w-full mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#065d24]'}`}
                            disabled={loading}
                        >
                            Next
                        </button>
                    </>
                );
            case 2:
                return renderPaymentOptions();
            case 3:
                return renderPaymentDetails();
            default:
                return null;
        }
    }

    return (
        <>
            <Toaster />
            <div className="bg-[#087830] text-white py-12 px-8">
                <div className="flex justify-between items-center max-w-6xl mx-auto">
                    <h1 className="text-6xl font-bold flex items-center gap-2">Merch</h1>
                    <p className="max-w-md text-xl italic text-end">Grab your exclusive SOURCE Merch now!</p>
                </div>
            </div>
            <div className="relative w-full" style={{ height: '400px' }}>
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HeaderBgImage})`, height: '100%', width: '100%' }}>
                    <div className="absolute inset-0" style={{ backgroundColor: '#014018', opacity: 0.6 }}></div>
                </div>
            </div>
            <div className="bg-gray-100">
                <div className="p-10 max-w-5xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-2">Jerseys</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {jerseys.map((jersey) => (
                            <div
                                key={jersey.id}
                                className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
                            >
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
                        <button onClick={closeModal} className="absolute top-3 right-3 text-gray-600 hover:text-gray-800">
                            <XCircle size={24} />
                        </button>
                        {renderContent()}
                    </div>
                </div>
            )}
        </>
    );
}

export default MerchPage;