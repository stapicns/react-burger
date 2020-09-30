import React from 'react';
import { withRouter } from 'react-router-dom'

import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import classes from './Burger.css';

const burger = (props) => {
  // console.log(props)
  // const test = Object.keys(props.ingredients);
  // console.log(test);
  // transforms object to key/value pair
  let transformedIngredients = Object.keys(props.ingredients)
    .map(igKey => {
      // console.log('Keys: ', igKey);
      // console.log('Props: ', props.ingredients[igKey]);
      return [...Array(props.ingredients[igKey] )].map( (_, i) => {
        // console.log('i: ', igKey + i);
        return <BurgerIngredient key={igKey + i} type={igKey}/>;
      });
    })
    .reduce((arr, el) => {
      return arr.concat(el);
    }, []);
    
    if (transformedIngredients.length === 0) {
      transformedIngredients = <p>Please start adding ingredients!</p>
    }
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top"/>
      {transformedIngredients}
      <BurgerIngredient type="bread-bottom"/>
    </div>
  );
};

export default withRouter(burger);