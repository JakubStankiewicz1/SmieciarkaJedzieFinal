import { useContext, useEffect, useState } from "react";
import "./collection.css";
import { ShopContext } from "../../context/ShopContext";
import ProductItem from "../../components/ProductItem/ProductItem";
import { assets } from "../../assets/assets";

const Collection = () => {
  const { ogloszenia, setOgloszenia, fetchCategoriesCitiesAndStreets, categories, cities, searchVisible, setSearchVisible } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;
  const [searchTerm, setSearchTerm] = useState("");

  
  useEffect(() => {
    console.log(searchVisible);
  });

  useEffect(() => {
    setFilterProducts(ogloszenia);
  }, [ogloszenia]);

  useEffect(() => {
    fetchCategoriesCitiesAndStreets();
  }, [fetchCategoriesCitiesAndStreets]);

  // Sortowanie ogłoszeń
  const sortProducts = (products, order) => {
    return products.sort((a, b) => {
      if (order === "newest") {
        return new Date(b.data_dodania) - new Date(a.data_dodania);
      } else if (order === "oldest") {
        return new Date(a.data_dodania) - new Date(b.data_dodania);
      }
      return 0;
    });
  };

  // Filtracja według kategorii
  const filterByCategory = (products) => {
    if (selectedCategory.length === 0) return products;
    return products.filter((product) => selectedCategory.includes(product.kategoria_id));
  };

  // Filtracja według miasta
  const filterByCity = (products) => {
    if (!selectedCity) return products;
    return products.filter((product) => product.miasto_id === selectedCity);
  };

  // Filtracja według ważności terminu
  const filterByValidity = (products) => {
    const currentDate = new Date();
    return products.filter((product) => new Date(product.termin_waznosci) > currentDate);
  };

  // Filtracja według wyszukiwanego terminu
  const filterBySearchTerm = (products) => {
    if (!searchTerm) return products;
    return products.filter((product) =>
      product.tytul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.opis.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  useEffect(() => {
    let filteredProducts = [...ogloszenia];
    filteredProducts = filterByCategory(filteredProducts);
    filteredProducts = filterByCity(filteredProducts);
    filteredProducts = filterByValidity(filteredProducts);
    filteredProducts = filterBySearchTerm(filteredProducts);
    filteredProducts = sortProducts(filteredProducts, sortOrder);
    setFilterProducts(filteredProducts);
  }, [selectedCategory, selectedCity, sortOrder, ogloszenia, searchTerm]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filterProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filterProducts.length / productsPerPage);

  // Funkcje zmieniające stronę
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="collection">
      <div className="filters">
        <p className="filterTextElement">FILTERS</p>
        <hr />



        {/* Searching products by name
        <div className="searchFilter">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => setSearchTerm(searchTerm)}>Search</button>
        </div> */}




        {/* Filtracja po kategoriach */}
        <div className=" categoryFilter">
          <p>CATEGORIES</p>
          <div className="categoriesContainer">
            {categories.map((category) => (
              <p key={category.id}>
                <input
                  type="checkbox"
                  value={category.nazwa}
                  className="collectionInputElement"
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectedCategory((prev) =>
                      checked ? [...prev, category.id] : prev.filter((id) => id !== category.id)
                    );
                  }}
                />{" "}
                {category.nazwa}
              </p>
            ))}
          </div>
        </div>
        {/* Filtracja po mieście */}
        <div className="cityFilter">
          <p>CITY</p>
          <select value={selectedCity} onChange={(e) => setSelectedCity(parseInt(e.target.value))}>
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.nazwa}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="rightPartElement">
      <div className="topPart">
          <p className="allText">All Products</p>
          <div className="sortContainer">
            <p>Sort by:</p>
            <select className="sortContainerItemsContainer" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>



        
        {
          searchVisible ?
          /* Searching products by name */
          <div className="searchFilter">
            <input
              className="searchFilterInput"
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <img src={assets.close} alt="" className="searchFilterCloseIcon" onClick={() => setSearchVisible(false)} />
            {/* <button onClick={() => setSearchTerm(searchTerm)}>Search</button> */}
          </div> : null
        }
        




        <div className="productList">
          {currentProducts.map((ogloszenie, index) => (
            <ProductItem
              key={index}
              id={ogloszenie.id}
              data={ogloszenie.data_dodania}
              miasto={ogloszenie.miasto_id}
              termin={ogloszenie.termin_waznosci}
              zdjecie={ogloszenie.zdjecie}
              tytul={ogloszenie.tytul}
              opis={ogloszenie.opis}
              className="productItem"
            />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="paginationControls">
          <img onClick={prevPage} src={assets.back} alt="Previous" className="paginationControlsBtn" />
          <span className="pageElement"> Strona {currentPage} z {totalPages} </span>
          <img onClick={nextPage} src={assets.next} alt="Next" className="paginationControlsBtn" />
        </div>
      </div>
    </div>
  );
};

export default Collection;