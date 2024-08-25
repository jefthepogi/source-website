import React from 'react';
import StudentCouncil from '../assets/officer_header-bg.jpg';
import Discord from '../assets/discord.png';
import Minecraft from '../assets/minecraft.png'


const facebookPosts = [
    {
      url: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FLSUSOURCE%2Fposts%2Fpfbid029YF8C7EGAQNCzu2haUTCWt1T1dsKLjsggwpqPsN4ywEZmnjqrDX1Neayj1oZwQgnl",
      title: "Facebook Post 1"
    },
    {
      url: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FLSUSOURCE%2Fposts%2Fpfbid0u6bv5eQsa3VvXncmeXmZDnHCpr8fXMDB4FQBWazLsdrW9do5AnPrMRWJ7jMBijHHl",
      title: "Facebook Post 2"
    },
    {
      url: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FLSUSOURCE%2Fposts%2Fpfbid02uDNaLzJjhRrf7gbYh8QQnUR2tUTG6bPJxrvRgsNDkG6YMTDgWUmoqQ7b5pED2hmpl",
      title: "Facebook Post 3"
    }
  ];

function Body() {
  return (
    <div className="space-y-20">
      <section id="home" className="py-10 text-center padding">
        <p>
            <b>Student Organization Utilizing the Realm of Computer Eclecticism</b> is an academic-based organization in CCSEA, La Salle University - Ozamiz that focuses on the promotion of ICT in the community. We are dedicated to fostering excellence through innovative educational activities and practical ICT applications. Our mission includes enhancing creativity and productivity, promoting transparency and accountability, and identifying key areas for ICT development. By engaging students and the wider community, we aim to drive forward meaningful technological progress and collaborative learning.
        </p>
      </section>

      <section id="stay-updated" className="text-center">
        <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
        <div className="flex justify-center space-x-4">
          {facebookPosts.map((post, index) => (
            <div key={index} className="facebook-post w-[350px] h-[500px]">
              <iframe
                src={post.url}
                width="350"
                height="500"
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling="no"
                frameBorder="0"
                allow="encrypted-media"
                allowFullScreen="true"
                title={post.title}
              ></iframe>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-[#087830] text-white py-8 padding">
        <div className='py-8'>
            <h1 className="text-4xl font-bold">Explore</h1>
            <p className='px-1 py-4'>Learn more about SOURCE and our commitment to ICT excellence and community engagement.</p>
        </div>

        <div className="container mx-auto pb-8">
          <div className="grid grid-cols-1 gap-8 mb-8">
            {/* First Card: 1 row 1 column */}
            <Card
              title="SOURCE Student Council"
              description="Meet the dedicated officers of the SOURCE Student Council and learn about their roles."
              image={StudentCouncil}
              href="/officers"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Second Row: 2 cards in 2 columns */}
            <Card
              title="Discord"
              description="Connect with LSU CS/IT students and faculty on our Discord server for discussions, support, and networking"
              image={Discord}
              href="https://discord.gg/UEBu2gtETH"
            />
            <Card
              title="Minecraft"
              description="Take a break from academics and unleash your creativity on our Minecraft server. Join us for fun and relaxation!"
              image={Minecraft}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, description, image, href }) {
  return (
    <a
      href={href}
      className="card bg-cover bg-center h-48 text-white shadow-xl flex items-center justify-start transform hover:-translate-y-2 transition-transform duration-300"
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      <div className="card-body bg-black bg-opacity-25 p-10 text-left w-full h-full flex flex-col justify-center rounded-2xl">
        <h2 className="card-title text-3xl font-bold">{title}</h2>
        <p className='text-lg'>{description}</p>
      </div>
    </a>
  );
}


export default Body;
