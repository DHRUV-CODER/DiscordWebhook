import React from "react";
import axios from "axios";
import { useState } from "react";
import Discordpreview from "./DiscordPreview";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const SendMessage = () => {
  const [Url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [ProfileUrl, setProfileUrl] = useState(null);
  const [Tts, setTts] = useState(false);
  const [ValidUrl, setValidUrl] = useState("");
  const [ValidProfileUrl, setValidProfileUrl] = useState("✔");

  let Iscontent = true;

  const AfterUrlChange = () => {
    if (ValidUrl === "✔") {
      if (!username) {
        axios.get(Url).then((resp) => setUsername(resp.data.name));
      } else if (!ProfileUrl) {
        axios.get(Url).then((resp) => {
          if (resp.data.avatar != null) {
            setProfileUrl(
              `https://cdn.discordapp.com/avatars/${resp.data.id}/${resp.data.avatar}.webp?size=128`
            );
          } else {
            setProfileUrl(null);
          }
        });
      }
    }
  };

  AfterUrlChange();

  if (content.length === 0) {
    Iscontent = false;
  }

  const CheckValidUri = () => {
    axios
      .get(Url)
      .then((resp) => {
        if (resp.data.type === 1) {
          setValidUrl("✔");
        } else if (!Url) {
          setValidUrl("⁉");
        }
      })
      .catch((err) => {
        if (err.response.status === 404 || err.response.status === 401) {
          setValidUrl("❌");
        }
      });
  };
  CheckValidUri();

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
    CheckValidUri();
    setUsername("");
    setProfileUrl("");
    AfterUrlChange();
  };

  const SuccessFull_Request = () => {
    toast.success("Message Sent", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  const Failed_Request = (err) => {
    toast.error(err, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const HandleRequest = () => {
    axios
      .post(Url, {
        username: username,
        content: content,
        avatar_url: ProfileUrl,
        tts: Tts,
      })
      .then((res) => {
        if (res.status === 204) {
          console.log("Sent Request");
          SuccessFull_Request();
        }
      })
      .catch((err) => {
        if (err.response.status === 429) {
          Failed_Request("Sending Messages Too Fast , Chill");
        } else {
          Failed_Request(err.message);
          Failed_Request(
            "Check for invalid URL , Silly Mistakes or empty inputs"
          );
        }
      });
  };

  const HandleUri = () => {
    if (ValidUrl === "⁉" || ValidUrl === "❌") {
      return "Enter Valid Webhook Url To Access Other Features";
    }
  };

  const handleProfileUrl = (event) => {
    setProfileUrl(event.target.value);

      axios
      .get(ProfileUrl)
      .then((resp) => {
        if (!resp["headers"]["content-type"] === "image/webp") {
          setValidProfileUrl("❌");
        } else if (resp["headers"]["content-type"] === "image/webp" || resp["headers"]["content-type"] === "image/jpeg" || resp["headers"]["content-type"] === "image/png" || resp["headers"]["content-type"] === "image/jpg") {
          setValidProfileUrl("✔");
        }
      })
      .catch(() => {
          if (ProfileUrl.length === null) {
            setValidProfileUrl("✔");
          } else if (ProfileUrl.length !== 0){
            setValidProfileUrl("⁉");
          }
      });
    }

  const handleDisable = () => {
    if (ValidUrl === "❌" || ValidUrl === "⁉") {
      return true;
    } else if (Url.length !== 0) {
      if (
        content.length > 2000 ||
        username.length > 80 ||
        !content.length
      ) {
        return true;
      }
    } else {
      return false;
    }
  };

  const handleTTS = () => {
    if (Tts === false) {
      setTts(true)
    }else {
      setTts(false)
    }
  }

  return (
    <>
      <div className="container">
        <div className="input-group my-3">
          <span className="input-group-text">Webhook Url</span>
          <input
            type="text"
            id="inputUrl"
            className="form-control"
            aria-describedby="AboutUrl"
            placeholder="https://discord.com/api/webhooks/{id}/{token}"
            onChange={handleUrlChange}
          />
          <span className="input-group-text">{ValidUrl}</span>
        </div>
        <strong>{HandleUri()}</strong>
        <div className="input-group mb-3 my-3">
          <input
            type="text"
            className="form-control"
            placeholder={`Username: ${username ? username : "No Username"}`}
            onChange={(e) => setUsername(e.target.value)}
            disabled={ValidUrl === "❌" || ValidUrl === "⁉"}
          />
          <span className="input-group-text">@</span>
          <input
            type="text"
            className="form-control"
            placeholder={`Profile Url: ${
              ProfileUrl ? ProfileUrl : "Deafult Avatar , Set Custom"
            }`}
            onChange={handleProfileUrl}
            disabled={ValidUrl === "❌" || ValidUrl === "⁉"}
          />
          <span className="input-group-text">{ValidProfileUrl}</span>
        </div>
        <div className="my-3">
          <strong style={{ color: "black" }}>
            {Url.length !== 0 &&
              username.length > 80 &&
              `Username Charachter limit is 80 ,${80 - username.length}`}
          </strong>
        </div>
        <div className="input-group my-3">
          <span className="input-group-text">Content</span>
          <textarea
            className="form-control"
            aria-label="With textarea"
            onChange={(e) => setContent(e.target.value)}
            disabled={ValidUrl === "❌" || ValidUrl === "⁉"}
            placeholder="ie: Hello World"
            required
          ></textarea>
        </div>
        <div className="my-3">
          <strong style={{ color: "black" }}>
            {content.length > 2000 &&
              `You cannot send more then 2000 Words ,${2000 - content.length}`}
          </strong>
          <strong style={{ color: "green" }}>
            {content.length < 2000 && `${2000 - content.length} Words left`}
          </strong>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckChecked"
            onClick={handleTTS}
            disabled={
              ValidUrl === "❌" ||
              ValidUrl === "⁉" ||
              content.length > 2000 ||
              !content.length
            }
          />
          <label className="form-check-label" htmlFor="flexCheckChecked">
            Enable Text-To-Speech (TTS)
          </label>
        </div>
        <button
          type="button"
          className="btn btn-primary my-3"
          onClick={HandleRequest}
          disabled={handleDisable()}
        >
          <strong>Send</strong>
        </button>
        <h2>Preview</h2>
        <Discordpreview
          username={username ? username : "No Username"}
          avatar={ProfileUrl ? ProfileUrl : null}
          content={Iscontent ? content : "No content"}
        />
        <h5 className="my-3 text-center">
          Made By{" "}
          <strong>
            <a
              target={"_blank"}
              rel="noreferrer"
              href="https://github.com/DHRUV-CODER"
            >
              Hails
            </a>
          </strong>{" "}
          with{" "}
          <a target={"_blank"} rel="noreferrer" href="https://reactjs.org/">
            <img
              src="https://icons-for-free.com/iconfiles/png/512/design+development+facebook+framework+mobile+react+icon-1320165723839064798.png"
              alt=""
              width={32}
            />
          </a>
        </h5>
      </div>
    </>
  );
};

export default SendMessage;
