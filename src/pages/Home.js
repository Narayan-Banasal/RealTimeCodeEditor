import React from "react";
import { v4 } from "uuid";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = v4();
    setRoomId(id);
    toast.success("Created a new Room");
  };

  const joinRoom = () => {
    if (!roomId){
      toast.error('ROOM ID is required');
      return;
    }
    if (!userName){
      toast.error('UserName is required');
      return;
    }

    // There we have to redirect
    navigate(`/editor/${roomId}`, {
      state: {
        userName,
      },
    })
  }

  const handleInputEnter = (e) => {
    if (e.code == 'Enter'){
      joinRoom();
    }
  }

  return (
    <>
      <div className="homePageWrapper">
        <div className="formWrapper">
          <img src="/image1.png" alt="code-logo" className="homePageLogo" />
          <h4 className="mainLabel">Enter Invitation ROOM ID</h4>
          <div className="inputGroup">
            <input
              type="text"
              className="inputBox"
              placeholder="ROOM ID"
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
              onKeyUp={handleInputEnter}
            />
            <input
              type="text"
              className="inputBox"
              placeholder="USERNAME"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              onKeyUp={handleInputEnter}
            />
            <button className="btn joinBtn" onClick={joinRoom}>Join</button>
            <span className="createInfo">
              If you don't have invite then you can create &nbsp;
              <a onClick={createNewRoom} href="" className="createNewBtn">
                new room
              </a>
            </span>
          </div>
        </div>
        <footer>
          <h4>
            Built by <a href="">Narayan Bansal</a>{" "}
          </h4>
        </footer>
      </div>
    </>
  );
};

export default Home;
