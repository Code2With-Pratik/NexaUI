import React from 'react';

export default function Card8() {
  return (
    <>
      <div className="gev-card-wrapper">
        {/* You can easily change the hover color by modifying the --color variable here */}
        <div className="gev-card" style={{ "--color": "#da9696" } as React.CSSProperties}>
          <span>1</span>
          <h2>Card Heading</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod nam
            quis consectetur, cupiditate vitae consequatur.
          </p>
          <a href="#">read more</a>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: styles }} />
    </>
  );
}

const styles = `
  /* Added a wrapper to simulate the dark background and center the single card */
  .gev-card-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 80px 20px;
    background-color: hsl(0, 0%, 0%);
    font-family: 'Poppins', sans-serif;
  }

  .gev-card {
    background-color: hsl(220, 6%, 10%);
    padding: 120px 30px 30px;
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 350px;
    overflow: hidden;
  }

  .gev-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: var(--color, #da9696);
    z-index: -1;
    clip-path: circle(40px at 70px 70px);
    transition: clip-path 1s ease;
  }

  .gev-card:hover::before {
    /* Increased to 150% to ensure it fully covers the rectangular corners */
    clip-path: circle(150%);
  }

  .gev-card span {
    position: absolute;
    left: 0;
    top: 0;
    height: 80px;
    width: 80px;
    font-size: 50px;
    font-weight: bold;
    transform: translate(30px, 30px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: hsl(0, 0%, 0%);
    transition: transform 1s ease;
  }

  .gev-card:hover span {
    transform: translate(0, 30px);
  }

  .gev-card h2 {
    font-size: 20px;
    color: hsl(0, 0%, 100%);
    font-weight: 600;
    margin-bottom: 10px;
    line-height: 1.3;
    transition: color 1s ease;
  }

  .gev-card p {
    color: hsl(0, 0%, 85%);
    line-height: 1.5;
    transition: color 1s ease;
  }

  .gev-card a {
    display: inline-block;
    text-transform: capitalize;
    color: hsl(0, 0%, 100%);
    margin-top: 20px;
    font-weight: 500;
    font-size: 20px;
    text-decoration: none;
    transition: color 1s ease;
  }

  /* Text color changes to black when the card is hovered */
  .gev-card:hover a,
  .gev-card:hover h2,
  .gev-card:hover p {
    color: hsl(0, 0%, 0%);
  }
`;