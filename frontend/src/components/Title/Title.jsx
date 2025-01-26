import "./title.css";

const Title = ({ text1, text2 }) => {
  return (
    <div className="title">
      <p className="titleText">
        {text1} <span className="text2">{text2}</span>
      </p>
    </div>
  );
};

export default Title;
