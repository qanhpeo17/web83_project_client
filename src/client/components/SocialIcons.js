import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGooglePlusG,
  faFacebookF,
  faGithub,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

const SocialIcons = () => {
  return (
    <div className="social-icons">
      <a href="#" className="icon">
        <FontAwesomeIcon icon={faGooglePlusG} />
      </a>
      <a href="#" className="icon">
        <FontAwesomeIcon icon={faFacebookF} />
      </a>
      <a href="#" className="icon">
        <FontAwesomeIcon icon={faGithub} />
      </a>
      <a href="#" className="icon">
        <FontAwesomeIcon icon={faLinkedinIn} />
      </a>
    </div>
  );
};

export default SocialIcons;
