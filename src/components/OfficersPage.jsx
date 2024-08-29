import React from 'react';
import HeaderBgImage from '../assets/officer_header-bg.jpg';
import officerData from '../data/officers.json';
import officerStructure from '../assets/officer-structure.png'; // Adjust the path as needed



// Function to dynamically import images
const requireImage = (imageName) => {
  if (!imageName) {
    console.error("Image name is undefined or null");
    return null;
  }

  try {
    return require(`../assets/officers-img/${imageName}`);
  } catch (e) {
    console.error(`Image not found: ${imageName}`);
    return null;
  }
};

function OfficersPage() {
  // Add image paths to the officer data
  const categorizedOfficers = officerData.map(category => ({
    ...category,
    officers: category.officers.map(officer => ({
      ...officer,
      image: requireImage(officer.image)
    }))
  }));

  return (
    <>
      {/* Header Section */}
      <div className="bg-[#087830] text-white padding py-12">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-6xl font-bold">Meet the Officers</h1>
            <p className='px-1'>A.Y. 2024 - 2025</p>
          </div>
          <div>
            <p className="max-w-md text-xl italic text-end">
              A dedicated team working towards the advancement of ICT.
            </p>
          </div>
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

      {/* Officers Section */}
      <div className="p-10 space-y-20 padding">
        {categorizedOfficers.map((category, index) => (
          <CategorySection key={index} title={category.category} officers={category.officers} />
        ))}
      </div>

      <div className="bg-[#087830] p-4 padding">
        <div className="max-w-3xl mx-auto text-white text-center py-6">
          <h1 className='text-5xl font-bold mb-3'>Organizational Structure</h1>
          <p>The SOURCE Student Council is comprised of nine (9) core committees (including their undersecretaries) and the representatives of each year-level.</p>
        </div>
        <img src={officerStructure} alt="Officer Structure" className="w-full h-auto px-16 mb-6" />
      </div>
    </>
  );
}

function CategorySection({ title, officers }) {
  return (
    <div className="text-left">
      <h3 className="text-3xl font-bold mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {officers.map((officer, index) => (
          <div key={index} className="card bg-base-100 shadow-xl transform hover:-translate-y-2 transition-transform duration-300">
            <div className="card-body flex flex-col items-center">
              <img
                src={officer.image}
                alt={officer.name}
                className="w-48 object-cover"
              />
              <h4 className="card-title text-xl font-semibold">{officer.name}</h4>
              <div className='bg-[#087830] text-white text-sm rounded-md px-4 py-1'>
                <p>{officer.position}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OfficersPage;
