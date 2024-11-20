import { Link } from "react-router-dom";
import footerLogo from "../../assets/media/silant-logo-footer.svg";
import "../../styles/Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <Link to="/">
        <img className="footer-logo" src={footerLogo} alt="logo" />
      </Link>
      <div className="footer-text">
        <p className="footer-text__contacts">+7-8352-20-12-09, Telegram</p>
        <p className="footer__copyright">Мой Силант, 2024</p>
      </div>
    </footer>
  );
};

export default Footer;
