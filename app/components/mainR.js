"use client"
import React from 'react'
import Script from 'next/script';
import '../css/mainR.css'
import Image from 'next/image';
import { useState, useRef, useEffect,useContext } from 'react';
import { stateContext } from '../context/stateContext';
import RAnim from './rAmin';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const MainR = () => {
  const stateNames = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry"];

  const value = useContext(stateContext)
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);
  const [chk , setChk] = useState(0);

  useEffect(() => {
    if (chk === 0) {
      toast.info("Backend may take a minute to respond on first hit", { autoClose: 60000 });
      setChk(1);
    }
  }, [chk]);
  



  // setInterval(() => {
  //   if (value.audioRef.current && !value.audioRef.current.paused) {
  //     setElapsedTime((prev) => prev + 1);
  //   }
  // }, 1000);

  useEffect(() => {
    
      timerRef.current = setInterval(() => {
        if (value.audioRef.current && !value.audioRef.current.paused) {
          setElapsedTime((prev) => prev + 1);
        }
      }, 1000);
    }, [value.audioRef]);


  useEffect(() => {
    console.log(value.selectedState)
  }, [value.selectedState]);

  const stateListRef = useRef(null);

  const handleStateVisible = () => {
    if (stateListRef.current) {
      stateListRef.current.style.display = 'flex';
      stateListRef.current.style.flexWrap = 'wrap';
    }
  };

  const handleStateHidden = () => {
    if (stateListRef.current) {
      stateListRef.current.style.display = 'none';
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs} : ${mins} : ${secs}`;
  };

  return (
    <div className='mainR'>    
      <ToastContainer />  
        <div className="mainHead">
          <button onClick={()=>{
            value.leftSide.current.style.left= '0%';
            value.leftSide.current.style.zIndex= '1';
          }}>
            <Image width={36} height={36} src="hamburger.svg" alt="" className="hamburger invert"/>
          </button>

          <div className="mainRAllchbtn" onClick={()=>{
            // document.getElementsByClassName('RAnim')[0].style.right= '0px';
            // document.getElementsByClassName('RAnim')[0].style.zIndex= '1';
          }}>
            <div className="a1">

             <span className='a11'>Live Radio</span> <Image width={40} height={40} src="radio.svg" alt="" className='invert'/>

            </div>
          </div>


        </div>

        <div className="mainLocn">
          <div className="mainLocnUp">
            We have covered whole country
          </div>

          <div className="mainLocnDwn">
            <div className="mainLocnDwnL">
            You are from
            </div> 

            <div className="mainLocnDwnR">
              <div className="chooseLocn"
                onMouseEnter={handleStateVisible}
               
              >
                <Script
                  src="https://cdn.lordicon.com/lordicon.js"
                  strategy="lazyOnload"
                />
                <lord-icon
                  src="https://cdn.lordicon.com/onmwuuox.json"
                  trigger="hover"
                  colors="primary:#121331,secondary:#1663c7"
                  style={{ width: "50px", height: "50px" }}
                  className ="invert">
                </lord-icon>
                <div className="chooseState">
                  Select your State
                </div>
              </div>
              <div 
                ref={stateListRef} 
                className="stateList"
                onMouseLeave={handleStateHidden}
              >
              {stateNames.map((Sname, index) => (
                <div
                  key={index}
                  className={`stateDiv ${
                    value.selectedState === Sname ? "selectedS" : ""
                  }`}
                  onClick={() =>{
                    value.setSelectedState(Sname);                   
                    value.leftSide.current.style.left= '0%';
                    value.leftSide.current.style.zIndex= '1';                    
                    setTimeout(() => {
                      handleStateHidden();
                    }, 7000);
                  }}
                >
                  {Sname}
                </div>
              ))}
            </div>


            </div>
          </div>

        </div>

        <div className="mainRAllch">
          <RAnim/>
        </div>

        <div className="mainPlay">
          <div className="mainRplaybar">

            <div className="mainRtop">


              <div className='mainRlineT'></div>

            </div>
            <div className="mainRbottom">
              <div className="mainRleft">
                <div className="mainRmInfo">
                  <div className="mainRblackBox">
                    <div className="mainRbBoxUp">
                      <span className='mainRlive'>Live</span>
                      <span className='mainRhd' style={{ color: "white", padding: "5px" }}>Radio</span>

                    </div>

                    <div className="mainRbBoxDown">
                      <div className="mainRfreq">
                        {`${value.selectedChannel.frequency} - 128bit`}
                      </div>
                      <div className="mainRtime">
                        {formatTime(elapsedTime)}
                      </div>
                    </div>

                  </div>

                  <div className="mainRdesc">
                    <div className="mainRbBoxUp">
                      <span className='mainRsongName'>{value.selectedChannel.name}</span>


                    </div>

                    <div className="mainRbBoxDown">

                      <span className="mainRplaying">
                      Playing...
                      </span>
                    </div>

                  </div>

                </div>
                <div className="mainRnavB">

                </div>

              </div>
              <div className="mainRright">
                <div className="mainRmPlayer">

                  <div className="mainRbigCircle">
                    <button 
                      className="mainRsmallCircle"
                      onClick={() => value.audioRef.current.play()}
                    >
                     <Image width={40} height={40} src="playAnimated.svg" alt="" />

                    </button>
                  </div>

                </div>
                <div className="mainRplyps">
                  <button  className="mainRupCircle" onClick={() => value.audioRef.current.pause()}>
                    
                  {/* onClick={() => { audioRef.current.pause() }} */}
                    <div className="mainRpause"
                      
                    >

                    </div>

                  </button>

                  <button onClick={()=>{
                    window.location.reload(true);
                  }} className="mainRdownCircle">
                      <lord-icon
                          src="https://cdn.lordicon.com/mfblariy.json"
                          trigger="hover"
                          stroke="bold"
                          colors="primary:#ffffe6,secondary:#000000"
                          style={{ width: '20px', height: '20px' }}>
                      </lord-icon>
                    {/* <div className="mainRrec"></div> */}

                  </button>

                </div>

              </div>
            </div>

          </div>


        </div>
      
    </div>
  )
}

export default MainR
