import React from 'react';

function EventCard({ title, date, location, description }) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title text-2xl font-bold">{title}</h3>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Location:</strong> {location}</p>
        <p>{description}</p>
        <div className="card-actions justify-end">
          <a href="#register" className="btn btn-secondary">Register</a>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
