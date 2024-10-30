import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__leftside">
          <a href="/" className="footer__logo">
            <img src={process.env.PUBLIC_URL + "/images/silant-logo-wide.svg"} alt="logo" />
          </a>
          <span className="footer__contacts">+7-8352-20-12-09, telegram</span>
        </div>
        <div className="footer__rightside">
          <span className="footer__contacts">&copy; Мой Силант, 2022</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
