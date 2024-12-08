import React, { useEffect, useContext, useRef } from 'react';
import '../css/RAnim.css';
import { stateContext } from '../context/stateContext';

const RAnim = () => {
  const val = useContext(stateContext);
  const allCh = val.channels;
  const rAnimRef = useRef(null); // Reference to the RAnim container

  // Function to create a full <li> element for the expansion
  function createLi(ch, position) {
    const divLi = document.createElement('div');
    divLi.className = 'channel-item';
    divLi.style.position = 'fixed';
    divLi.style.width = '300px'; // Set controlled width
    divLi.style.height = '80px'; // Set controlled height
    divLi.style.top = `${position.top - 110}px`;
    divLi.style.zIndex = '1';
    
  
    divLi.innerHTML = `
      <img src="music.svg" alt="" class="invert"/>
      <div class="info">
        <div style="font-weight: bold; font-size: 20px;">${ch.name}</div>
        <div class="artist">${ch.frequency}</div>
      </div>
      <div class="playnow">
      </div>
    `;
  
    // Append the expanded <li> content to the container
    rAnimRef.current.appendChild(divLi);
  }
  

  useEffect(() => {
    function createFallingDiv(ch, index) {
      if (!rAnimRef.current) return;

      const containerWidth = rAnimRef.current.offsetWidth; // Get the width of the RAnim container
      const div = document.createElement('div');
      div.className = 'falling-div';
      div.textContent = ch.frequency; // Set channel name as text
      div.style.backgroundColor = `rgb(${Math.floor(Math.random() * 55)}, ${Math.floor(Math.random() * 55)}, ${Math.floor(Math.random() * 55)})`; // Cycle through colors
      div.style.left = Math.random() * (containerWidth - 120) + 'px'; // Random horizontal position
      div.style.animationDuration = (Math.random() * 3 + 2) + 's'; // Random animation duration
      div.style.animationDelay = (Math.random() * 2) + 's'; // Random animation delay
      
      rAnimRef.current.appendChild(div); // Append div to the RAnim container

      // Pause animation and expand on mouse enter
      div.addEventListener('mouseenter', () => {
        div.style.animationPlayState = 'paused'; // Pause the animation
        const rect = div.getBoundingClientRect();
        console.log(rect);
        createLi(ch, rect);
        div.style.width = '150px';
        div.textContent = "Click to Play";
        div.style.zIndex= '2';
      });

      // Resume animation and expand on mouse leave
      div.addEventListener('mouseleave', () => {
        div.textContent = ch.frequency;
        div.style.width = '100px';
        div.style.animationPlayState = 'running'; // Resume the animation
        const items = document.getElementsByClassName('channel-item');
        for (let i = 0; i < items.length; i++) {
          items[i].remove();
        }
      });

      div.addEventListener('click', ()=>{
        const m3u8Link = ch.description;
        val.setSelectedChannel(ch);
        val.playChannel(m3u8Link)
      })

      div.addEventListener('animationend', () => {
        div.remove(); // Remove the div after animation ends
      });
    }

    let currentChannelIndex = 0;

    const interval = setInterval(() => {
      if (allCh.length === 0) return; // Skip if no channels are available
      createFallingDiv(allCh[currentChannelIndex], currentChannelIndex);
      currentChannelIndex = (currentChannelIndex + 1) % allCh.length; // Loop through channels
    }, 500);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [allCh]);

  return (
    <div className="RAnim" ref={rAnimRef}>
      <div className="RAnimTitle">All Channels:</div>
      <div className="RAnimList">
        <ul>
          {allCh.map((channell, indexx) => (
            <li
              key={indexx}
              onClick={() => {
                if (val.setSelectedChannel) {
                  val.setSelectedChannel(channell);
                  val.playChannel(channell.description);
                } else {
                  console.error("setSelectedChannel is not defined in context.");
                }
              }}
            >
              <img src="music.svg" alt="" className="invert" />
              <div className="info">
                <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                  {channell.name}
                </div>
                <div className="artist">{channell.frequency}</div>
              </div>
              <div className="playnow">
                <span>Play Now</span>
                <img src="play1.svg" alt="" className="invert" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RAnim;
