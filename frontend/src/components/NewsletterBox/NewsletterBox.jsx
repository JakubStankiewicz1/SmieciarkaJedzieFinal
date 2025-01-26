import "./newsletterBox.css";

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="newsletterbox">
      <h2>Nasz Newsletter</h2>
      <p className="newsletterboxText1">
        Zapisz się do naszego newsletter i bądź na bieżąco ze wszystkimi
        nowościami
      </p>

      <form onSubmit={onSubmitHandler} className="formEle">
        <input
          type="email"
          placeholder="Enter your email"
          className="newsletterboxEmailInput"
        />
        <button type="submit" className="newsletterBtn">
          Subscribe
        </button>
      </form>

      <p className="newsletterPrivacy">
        We respect your privacy because that's the right thing to do. 💌
      </p>
    </div>
  );
};

export default NewsletterBox;
