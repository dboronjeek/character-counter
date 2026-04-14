import React, { useState, useEffect } from "react";
import "./App.css";

import logoDark from "./images/logo-dark-theme.svg";
import logoLight from "./images/logo-light-theme.svg";
import iconSun from "./images/icon-sun.svg";
import iconMoon from "./images/icon-moon.svg";
import iconInfo from "./images/icon-info.svg";

const App = () => {
  const [text, setText] = useState("");
  const [excludeSpaces, setExcludeSpaces] = useState(false);
  const [charLimit, setCharLimit] = useState(false);
  const [limitValue, setLimitValue] = useState(300);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const charCount = excludeSpaces
    ? text.replace(/\s/g, "").length
    : text.length;
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const sentenceCount = text
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0).length;
  const readingTime = Math.ceil(wordCount / 200);

  const getLetterDensity = () => {
    // ISPRAVLJENO: Sada prepoznaje i hrvatska slova
    const letters = text
      .toLowerCase()
      .replace(/[^a-zčćđšž]/g, "")
      .split("");
    const stats = {};
    letters.forEach((l) => (stats[l] = (stats[l] || 0) + 1));
    return Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const isOverLimit = charLimit && charCount > limitValue;

  return (
    <div className="app-wrapper">
      <div className="container">
        <header className="main-header">
          <img
            src={theme === "dark" ? logoDark : logoLight}
            alt="Logo"
            className="logo"
          />
          <button
            className="theme-btn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <img src={theme === "dark" ? iconSun : iconMoon} alt="Theme" />
          </button>
        </header>

        <section className="hero">
          <h1>
            Analyze your text <br /> in real-time.
          </h1>
        </section>

        <main className="input-section">
          <textarea
            className={isOverLimit ? "input-error" : ""}
            placeholder="Type or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="input-footer">
            <div className="options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={excludeSpaces}
                  onChange={() => setExcludeSpaces(!excludeSpaces)}
                />
                <span className="custom-checkbox"></span>
                Exclude Spaces
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={charLimit}
                  onChange={() => setCharLimit(!charLimit)}
                />
                <span className="custom-checkbox"></span>
                Set Character Limit
              </label>
              {charLimit && (
                <input
                  type="number"
                  className="limit-num"
                  value={limitValue}
                  onChange={(e) => setLimitValue(e.target.value)}
                />
              )}
            </div>
            <div className="reading-info">
              Approx. reading time: {readingTime < 1 ? "<1" : readingTime}{" "}
              minute
            </div>
          </div>
          {isOverLimit && (
            <div className="warning-msg">
              <img src={iconInfo} alt="info" /> Limit exceeded!
            </div>
          )}
        </main>

        <section className="stats-container">
          <div className="stat-card purple-card">
            <span className="count">
              {charCount.toString().padStart(2, "0")}
            </span>
            <span className="label">Total Characters</span>
          </div>
          <div className="stat-card orange-card">
            <span className="count">
              {wordCount.toString().padStart(2, "0")}
            </span>
            <span className="label">Word Count</span>
          </div>
          <div className="stat-card red-card">
            <span className="count">
              {sentenceCount.toString().padStart(2, "0")}
            </span>
            <span className="label">Sentence Count</span>
          </div>
        </section>

        <section className="density-section">
          <h2>Letter Density</h2>
          {getLetterDensity().length > 0 ? (
            getLetterDensity().map(([letter, count]) => {
              const totalLetters = text
                .toLowerCase()
                .replace(/[^a-zčćđšž]/g, "").length;
              const percentage = ((count / totalLetters) * 100).toFixed(2);
              return (
                <div key={letter} className="density-row">
                  <span className="letter">{letter.toUpperCase()}</span>
                  <div className="progress-bar">
                    <div
                      className="fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="numbers">
                    {count} ({percentage}%)
                  </span>
                </div>
              );
            })
          ) : (
            <p className="empty-msg">No characters detected</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default App;
