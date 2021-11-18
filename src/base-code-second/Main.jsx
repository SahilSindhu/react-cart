import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import ProductGallery from './ProductGallery';
import { getProductList } from '../service';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Cart from './Cart';
import About from './About';
import ErrorPage from './ErrorPage';
import { Link } from 'react-router-dom';
import { CartIcon } from '../icons';

export default function Main() {
  const [productList, setProductList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [cartList, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getProductList()
      .then((products) => {
        setProductList(products);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  const handleProductAddition =  (id) => {
    const updatedCart = [...cartList];
    const alreadyAddedIndex = updatedCart.findIndex((ele) => ele.id === id);
    if (alreadyAddedIndex === -1) {
      updatedCart.push({ id, count: 1 });
    } else {
      updatedCart[alreadyAddedIndex].count += 1;
    }
    setTotalCount(updatedCart.length);
    setCart(updatedCart);
  };

  const getCartList = () => {
    return cartList.map((item) => {
      const data = productList.find((product) => product.id === item.id);
      return { ...data, count: item.count };
    });
  };

  return (
    <div className="main-container">
      <Router>
        <Header>
          <Link to="/">Store</Link>
          <Link to="/about/abc">About</Link>
          <Link to="/cart">
            {' '}
            <CartIcon /> Cart ({totalCount})
          </Link>
        </Header>
        {loading ? (
          <h1>loading...</h1>
        ) : error ? (
          <p>Something went wrong</p>
        ) : (
          <Switch>
            <Route exact path="/">
              <ProductGallery
                products={productList}
                handleProductAddition={handleProductAddition}
                cartProducts={cartList}               
                />
            </Route>
            <Route path="/about">
              <About />
            </Route>

            <Route
              path="/cart"
              component={() => <Cart selectedProducts={getCartList()} />}
            ></Route>
            <Route path="*" component={ErrorPage} />
          </Switch>
        )}
      </Router>
    </div>
  );
}