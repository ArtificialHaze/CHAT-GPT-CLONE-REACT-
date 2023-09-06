import "./App.css";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";

const API_KEY = "[YOUR_API_KEY]";

function App() {
  const [outputData, setOutputData] = useState(null);
  const [value, setValue] = useState("");
  const [prevChat, setPrevChat] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const handleClickNewChat = () => {
    setOutputData(null);
    setValue("");
    setPrevChat([]);
    setCurrentTitle(null);
  };

  const fetchData = async () => {
    const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: outputData,
          },
        ],
      }),
    });
    const data = await response.json();
    setOutputData(data.choices[0].message.content);
  };

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setOutputData(null);
    setValue("");
  };

  useEffect(() => {
    if (!currentTitle && value && outputData) {
      setCurrentTitle(value);
    }

    if (currentTitle && value && outputData) {
      setPrevChat((prev) => [
        ...prev,
        { title: currentTitle, role: "user", content: value },
        {
          title: currentTitle,
          role: outputData.role,
          content: outputData.content,
        },
      ]);
    }
  }, [outputData, currentTitle]);

  const currentChat = prevChat.filter((item) => item.title === currentTitle);
  const uniqueTitles = Array.from(new Set(prevChat.map((prev) => prev.title)));

  return (
    <div className="App">
      <>
        <section className="sidebar">
          <button onClick={handleClickNewChat}>New Chat +</button>
          <ul className="history">
            {uniqueTitles?.map((item, index) => (
              <li
                onClick={() => {
                  handleClick(item);
                }}
                key={index}
              >
                {item}
              </li>
            ))}
          </ul>
          <div className="nav">
            <p>Made by DreamDevs</p>
          </div>
        </section>
        <section className="main">
          {!currentTitle && <h1>DreamGPT</h1>}
          <ul className="feed">
            {currentChat?.map((item, index) => (
              <li key={index}>
                <p className="role">{item.role}</p>
                <p>{item.message}</p>
              </li>
            ))}
          </ul>
          <p id="output">{outputData}</p>
          <div className="bottom-section">
            <div className="input-container">
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type="text"
              />
              <div id="submit" onClick={fetchData}>
                <FaArrowRight />
              </div>
            </div>
          </div>
          <p className="info">
            Chat GPT September 6 Version. Free Research preview.
          </p>
        </section>
      </>
    </div>
  );
}

export default App;
