import React, { useState } from 'react';
import StudentCouncil from '../assets/student_council.jpg';
import Discord from '../assets/discord.png';
import Minecraft from '../assets/minecraft.png';
import Events from '../assets/events.jpg';
import Merch from '../assets/merch.png';
import NewsCarousel from './NewsCarousel';
import InitiativesSection from './InitiativesSection';
import { FaUserFriends, FaCalendarAlt, FaTshirt, FaDiscord } from 'react-icons/fa';
import { TbBrandMinecraft } from "react-icons/tb";


function Body() {
  const [isMinecraftModalOpen, setMinecraftModalOpen] = useState(false);

  const openMinecraftModal = () => {
    setMinecraftModalOpen(true);
  };

  const closeMinecraftModal = () => {
    setMinecraftModalOpen(false);
  };

  return (
    <div className="">
      <section id="home" className="py-10 text-lg text-center padding mb-8">
        <p>
            <b>Student Organization Utilizing the Realm of Computer Eclecticism (SOURCE)</b> is a student organization dedicated to the exploration and application of cutting-edge computing technologies. We aim to foster a collaborative environment where students can enhance their skills, share knowledge, and contribute to the advancement of ICT in our school and beyond. By providing a platform for innovation and experimentation, we empower students to become leaders who can shape the future.
        </p>
      </section>

      <section id="stay-updated" className="text-center padding mb-8">
        <h2 className="text-4xl text-[#087830] font-bold mb-8">News and Updates</h2>
        <NewsCarousel />
      </section>

      <div className="bg-[#087830] text-white py-8 padding mb-8">
        <div className='py-8'>
            <h1 className="text-4xl font-bold">Explore</h1>
            <p className='px-1 py-4'>Learn more about SOURCE and our commitment to ICT excellence and community engagement.</p>
        </div>

        <div className="container mx-auto pb-8">
          <div className="grid grid-cols-1 gap-8 mb-6">
            <Card
              title="SOURCE Student Council"
              description="Meet the dedicated officers of the SOURCE Student Council and learn about their roles."
              image={StudentCouncil}
              href="/officers"
              icon={<FaUserFriends className="text-4xl" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
            <Card
              title="Events"
              description="Know more about our different events, initiatives, projects."
              image={Events}
              href="/events"
              icon={<FaCalendarAlt className="text-3xl" />}
            />
            <Card
              title="Merch"
              description="Exclusive SOURCE merch coming soon. Get ready to represent with style!"
              image={Merch}
              href="/merch"
              icon={<FaTshirt className="text-3xl" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <Card
              title="Discord"
              description="Connect with LSU CS/IT students and faculty on our Discord server for discussions, support, and networking."
              image={Discord}
              href="https://discord.gg/UEBu2gtETH"
              icon={<FaDiscord className="text-4xl" />}
            />
            <Card
              title="Minecraft"
              description="Take a break from academics and unleash your creativity on our Minecraft server."
              image={Minecraft}
              onClick={openMinecraftModal}
              icon={<TbBrandMinecraft className="text-4xl" />}
            />
          </div>

        </div>
      </div>

      <section id="initiatives" className="padding py-8">
        <h2 className="text-4xl text-[#087830] font-bold mb-8 text-center">Look out for our initiatives</h2>
        <InitiativesSection />
      </section>

      {isMinecraftModalOpen && (
        <MinecraftModal onClose={closeMinecraftModal} />
      )}
    </div>
  );
}

function Card({ title, description, image, href, onClick, icon }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="card relative h-52 text-white shadow-xl flex items-center justify-start transform hover:-translate-y-2 transition-transform duration-300"
    >
      {/* Image for lazy loading */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover z-0 rounded-2xl"
        loading="lazy"
      />
      {/* Overlay and card content */}
      <div className="card-body bg-black bg-opacity-40 p-10 text-left w-full h-full flex flex-col justify-center relative z-10 rounded-2xl">
        <div className="flex items-center mb-4">
          {icon}
          <h2 className="card-title text-3xl font-bold ml-2">{title}</h2>
        </div>
        <p className='text-lg'>{description}</p>
      </div>
    </a>
  );
}

function MinecraftModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Minecraft Server Info</h2>
        <p><strong>Server IP:</strong> mc.lsu-source.org</p>
        <p><strong>Version Supported:</strong> 1.21+</p>
        <button
          onClick={onClose}
          className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}

  export default Body;
