import "./home.css";
import Hero from "../../components/Hero/Hero";
import Title from "../../components/Title/Title";
import LatestProducts from "../../components/LatestProducts/LatestProducts";
import NewsletterBox from "../../components/NewsletterBox/NewsletterBox";

const Home = () => {
  return (
    <div>
      <Hero />
      <Title
        text1={"NIE WYRZUCAJ zbędnych przedmiotów!"}
        text2={"Zawsze znajdzie się ktoś komu to się przyda!"}
      />
      <hr />
      <LatestProducts />

      <NewsletterBox />
    </div>
  );
};

export default Home;
