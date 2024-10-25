import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footerContent">
        <div className="footerSection">
          <h4>Về chúng tôi</h4>
          <p>
            Với những sân bóng chất lượng cao và dịch vụ tốt, Saigon FutField là
            nơi lý tưởng để các bạn giao lưu, chia sẻ đam mê trái bóng tròn.
            Nghĩa vụ của chúng tôi là giúp các bạn có thể thỏa niềm đam mê của
            mình.
          </p>
        </div>
        <div className="footerSection">
          <h4>Liên hệ chúng tôi</h4>
          <p>Email: saigonfutfield@gmail.com</p>
          <p>Điện thoại: (123) 456-7890</p>
          <p>Địa chỉ: 1202 Huỳnh Tấn Phát, Quận 7, Thành phố Hồ Chí Minh</p>
        </div>
        <div className="footerSection">
          <h4>Follow Us</h4>
          <p>
            <a href="#">Facebook</a> | <a href="#">Twitter</a> |{" "}
            <a href="#">Instagram</a>
          </p>
        </div>
      </div>
      <div className="footerBottom">
        <p>&copy; 2024 Saigon Futfield. All rights reserved.</p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.4193698711456!2d106.62341247485578!3d10.702101089442175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317532010b26a8a7%3A0x45ca077758ea7a0b!2zMTMgxJAuIDEwNUMgVHLhu4tuaCBRdWFuZyBOZ2jhu4ssIFBoxrDhu51uZyA3LCBRdeG6rW4gOCwgSOG7kyBDaMOtIE1pbmgsIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1729074683539!5m2!1sen!2s"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </footer>
  );
}

export default Footer;
