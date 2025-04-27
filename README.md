# KnowIt Frontend  
*Submission for UW Saves The World Hackathon – April 27, 2025*  

KnowIt is a Chrome extension frontend that helps users quickly assess the reliability of web articles and detect potential phishing in Gmail. This repo contains only the UI and client-side logic.  

---

## 📋 Table of Contents  
- [Project Overview](#project-overview)  
- [Features](#features)  
- [Demo Screenshots](#demo-screenshots)  
- [Tech Stack](#tech-stack)  
- [File Structure](#file-structure)  
- [Installation & Setup](#installation--setup)  
- [Usage](#usage)  
- [Future Work](#future-work)  
- [Contributing](#contributing)  
- [License](#license)  

---

## 🚀 Project Overview  
During the UW Saves The World Hackathon, we built **KnowIt**, a Chrome extension that empowers readers to:  
1. **Evaluate article reliability** with a clear score and alternative sources.  
2. **Detect phishing** in Gmail messages before clicking any links.  

This frontend repository contains the popup UI, styling, and Chrome-extension wiring.  

---

## 🔥 Features  
- **Article Reliability**  
  - Scrapes page content, sends it to a backend evaluator, and displays a reliability percentage.  
  - Offers links to alternative, credible articles.  
- **Gmail Phishing Detection**  
  - Reveals a “Check email for phishing” button only on mail.google.com.  
  - Displays a color-coded score and explanation when phishing is suspected.  

---

## 📸 Demo Screenshots  

### Article Reliability  
<picture>  
  <img src="Assets/article_reliability_screenshot.png" alt="Reliability score and alternative articles">  
</picture>  

### Gmail Phishing Detection  
<picture>  
  <img src="Assets/phishing_detection_screenshot.png" alt="Phishing score with orange ring and explanation">  
</picture>  

*(Replace these placeholders with real screenshots in `Assets/`.)*  

---

## 🛠 Tech Stack  
- **HTML5 / CSS3** – Popup markup & theming (light & dark modes)  
- **JavaScript (ES6)** – DOM manipulation, theme toggle, fetch API  
- **Chrome Extension Manifest V3** – Permissions, scripting, popup integration  

---

## 📁 File Structure  

KnowIt-Frontend/
├── Assets/                  # Icons & screenshot placeholders
├── manifest.json            # Chrome extension metadata (v3)
├── popup.html               # Popup UI markup
├── popup.css                # Styles: light/dark themes, layout, buttons
├── popup.js                 # Frontend logic, theme toggle, content scripts
├── readability.js           # Article‐scraping helper library
└── README.md                # This documentation

---

## ⚙️ Installation & Setup  
1. **Clone this repo**  
   ```bash
   git clone https://github.com/yourorg/KnowIt-Frontend.git

	2.	Open Chrome → chrome://extensions/
	3.	Enable Developer mode (top right)
	4.	Click Load unpacked → select this project folder
	5.	Pin the KnowIt extension to your toolbar

---

🎯 Usage
	•	On any article page:
	1.	Click the KnowIt icon.
	2.	View the reliability score and alternative links.
	•	In Gmail:
	1.	Open an email.
	2.	Click “Check email for phishing.”
	3.	See a colored score ring and explanation.

---

📈 Future Work
	•	Real-time background phishing detection without manual click
	•	Enhanced reliability dashboard with source citations
	•	User-customizable thresholds and notifications
	•	Cross-browser support (Firefox, Edge)

---

🤝 Contributing

We welcome bug reports, feature requests, and pull requests. Please fork, branch, and submit a PR.

---

📄 License

This project is released under the MIT License. See LICENSE for details.

---
