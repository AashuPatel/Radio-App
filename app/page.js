"use client"
import Image from "next/image";
import "./css/maincss.css";
import { useState, useEffect, useRef } from "react";
import MainR from "./components/mainR";
import { stateContext } from "./context/stateContext";
import Hls from 'hls.js';
import RAnim from "./components/rAmin";
export default function Home() {

  const [channels, setChannels] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [filteredChannels, setFilteredChannels] = useState(channels);
  const [audioSrc, setAudioSrc] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState([]);
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Fetching channel data from the API
    const fetchChannels = async () => {
      try {
        const response = await fetch("http://localhost:3006/fetchChannels"); // Update with your API endpoint
        const data = await response.json();
        setChannels(data);
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };

    fetchChannels();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, []);
  
  useEffect(() => {
    console.log('Channels data:', channels);
    console.log('Selected state:', selectedState);
    console.log('filtered channels:', filteredChannels);
  }, [channels, selectedState]);
  

  useEffect(() => {
    let filtered = channels.filter((channel) => channel.state === selectedState);
    setFilteredChannels(filtered);
  }, [selectedState, channels]);
  
  
  const playChannel = async (m3u8Link) => {
    if (m3u8Link.endsWith('.m3u8')){
      
        try {
          // Ensure the audioRef is set
          if (!audioRef.current) {
            console.warn("Audio element is not set. Creating dynamically...");
            
            // Dynamically create an audio element and assign it to the ref
            const audioElement = document.createElement("audio");
            audioElement.style.display = "none"; // Optional, for design purposes
            document.body.appendChild(audioElement); // Attach to the DOM
            audioRef.current = audioElement;
          }
      
          // Check if HLS is supported
          if (Hls.isSupported()) {
            // Cleanup any previous HLS instance
            if (audioRef.current.hlsInstance) {
              audioRef.current.hlsInstance.destroy();
              audioRef.current.hlsInstance = null;
            }
      
            // Initialize HLS
            const hls = new Hls();
            hls.loadSource(m3u8Link);
            hls.attachMedia(audioRef.current);
      
            // Wait for the manifest to be parsed
            await new Promise((resolve, reject) => {
              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log("Manifest parsed. Ready to play.");
                resolve();
              });
      
              hls.on(Hls.Events.ERROR, (_, data) => {
                if (data.fatal) {
                  console.error("Fatal HLS error:", data);
                  reject(data);
                }
              });
            });
      
            // Store the HLS instance on the audio element for cleanup
            audioRef.current.hlsInstance = hls;
      
            // Attempt to play the audio
            await audioRef.current.play();
            console.log("Playback started successfully.");
          } else {
            console.error("HLS is not supported in this browser.");
          }
        } catch (error) {
          console.error("Error during playback:", error);
        }
    }else {
      console.log("Playing a non-m3u8 link.");
    
      // If an audio element exists, remove it and create a new one
      if (audioRef.current) {
        console.log("Existing audio element found. Removing and creating a new one...");
        audioRef.current.pause(); // Pause the current audio
        audioRef.current.src = ''; // Clear the source
        audioRef.current.load(); // Free up memory
        audioRef.current.parentNode.removeChild(audioRef.current); // Remove from DOM
      }
    
      // Create a new audio element and set it to the ref
      const audioElement = document.createElement("audio");
      audioElement.style.display = "none"; // Optional, for design purposes
      document.body.appendChild(audioElement); // Attach to the DOM
      audioRef.current = audioElement;
    
      // Set the source and play the audio
      audioRef.current.src = m3u8Link;
      try {
        await audioRef.current.play();
        console.log("Playback started successfully.");
      } catch (error) {
        console.error("Error during playback:", error);
      }
    }
  };    
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = ''; // Free up memory by resetting the src
        audioRef.current.load();
      }
    };
  }, []);
  
  



  return (
    <>
    <stateContext.Provider value={{channels, playChannel ,setSelectedChannel, setChannels , selectedState , setSelectedState, audioRef, selectedChannel}}> 
      <div className="rdofront">
        <div className="left">
          <div className="leftUp">
          <div className="home bg-grey m1 p1 rounded">
                <div className="logo  items-center flex">
                    <Image width={46} height={46} src="/logo1.png" alt="logo"/>
                    <h1>Aashu&apos;s</h1>
                    <Image width={46} height={46} src="/cross.svg" alt="" className="cross invert"/>
                </div>
                <ul>
                    <li><Image width={46} height={46} src="/home.svg" alt="home" className="invert"/> Home</li>
                    <li><Image width={46} height={46} src="/search.svg" alt="library" className="invert"/> Search</li>
                </ul>
            </div>

          </div>

          <div className="leftBtm">

            <div className="availableChannels">
              Available Channels
            </div>

            <ul>
                {(filteredChannels.length === 0 ? channels : filteredChannels).map((channel, index) => (
                  <li key={index}
                  onClick={()=>{
                    const m3u8Link = channel.description;
                    setSelectedChannel(channel);
                    playChannel(m3u8Link);
                  }}
                  >
                    <Image width={46} height={46} src="/music.svg" alt="" className="invert" />
                    <div className="info">
                      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                        {channel.name} {/* Channel name from API */}
                      </div>
                      <div className="artist">{channel.frequency}</div> {/* Frequency from API */}
                    </div>
                    <div className="playnow">
                      <span>Play Now</span>
                      <Image width={46} height={46} src="/play1.svg" alt="" className="invert" />
                    </div>
                  </li>
                ))}
              </ul>

          </div>

        </div>

        <div className="right">
          <MainR />
          <RAnim/>
          <div className="audioP">
            {audioSrc && (
              <audio ref={audioRef} controls style={{display:"none"}}>
                Your browser does not support the audio element.
              </audio>
            )}
          </div>

          <div>
            <video ref={videoRef} style={{ display: "none" }}>
              Your browser does not support the video element.
            </video>
          </div>

        </div>
      </div>
    </stateContext.Provider>
    </>
  );
}
