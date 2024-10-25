import React from "react";
import "./Sidebar.css";
import s5logo from "./media/Untitled-removebg-preview (1).png";
import s7logo from "./media/301697190_483904237076536_2914190063577147033_n-removebg-preview.png";
import s11logo from "./media/foot-ball-or-soccer-ball-icon-symbol-for-art-illustration-logo-website-apps-pictogram-news-infographic-or-graphic-design-element-format-png.webp";
function Sidebar() {
  return (
    <nav>
      <ul>
        <li>
          <div class="home-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
            </svg>
          </div>
        </li>
        <li>
          <div class="about-icon">
            <div class="head">
              <div class="eyes"></div>
              <div class="beard"></div>
            </div>
          </div>
        </li>
        <li>
          <img src={s5logo} alt="" className="sidebarIcon" />
        </li>
        <li>
          <img src={s7logo} className="sidebarIcon" alt="" />
        </li>
        <li>
          <img src={s11logo} className="sidebarIcon" alt="" />
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
