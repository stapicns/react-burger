import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';

const burgerBuilder = props => {
  const [purchasing, setPurchasing] = useState(false);

  const dispatch = useDispatch();
  
  const ings = useSelector(state => {
    return state.burgerBuilder.ingredients;
  });

  const price = useSelector(state => {
    return state.burgerBuilder.totalPrice;
  });
  
  const error = useSelector(state => {
    return state.burgerBuilder.error;
  });
    
  const isAuthenticated = useSelector(state => {
    return state.auth.token !== null;
  });

  const onIngredientAdded = ingName => dispatch(actions.addIngredient(ingName));
  const onIngredientRemoved = ingName => dispatch(actions.removeIngredient(ingName));
  const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), []);
  const onInitPurchase = () => dispatch(actions.purchaseInit());
  const onSetAuthRedirectPath = path => dispatch(actions.setAuthRedirectPath(path));

  // const {onInitIngredients} = props;
  useEffect (() => {
    onInitIngredients();
    // axios.get('https://react-my-burger-583bc.firebaseio.com/ingredients.json')
    //   .then(response => {
    //     this.setState({ingredients: response.data});
    //   })
    //   .catch(error => {
    //     this.setState({error: true});
    //   });
  }, [onInitIngredients]);

  // addIngredientHandler = (type) => {
  //   const oldCount = this.state.ingredients[type];
  //   const updatedCount = oldCount + 1;
  //   const updatedIngredients = {
  //     ...this.state.ingredients
  //   };

  //   updatedIngredients[type] = updatedCount;
  //   const priceAddition = INGREDIENT_PRICES[type];
  //   const oldPrice = this.state.totalPrice;
  //   const newPrace = oldPrice + priceAddition;

  //   this.setState({totalPrice: newPrace, ingredients: updatedIngredients});
  //   this.updatePurchaseState(updatedIngredients);

  // }

  // removeIngredientHandler = (type) => {
  //   const oldCount = this.state.ingredients[type];
  //   if (oldCount <= 0) {
  //     return;
  //   }
  //   const updatedCount = oldCount - 1;
  //   const updatedIngredients = {
  //     ...this.state.ingredients
  //   };

  //   updatedIngredients[type] = updatedCount;
  //   const priceDeduction = INGREDIENT_PRICES[type];
  //   const oldPrice = this.state.totalPrice;
  //   const newPrace = oldPrice - priceDeduction;

  //   this.setState({totalPrice: newPrace, ingredients: updatedIngredients});
  //   this.updatePurchaseState(updatedIngredients);
  // }

  const updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);

      return sum > 0;
  }

  const purchaseHandler = () => {
    if (isAuthenticated) {
      setPurchasing(true);
    } else {
      onSetAuthRedirectPath('/checkout');
      props.history.push('/auth');
    }
  }

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  }

  const purchaseContinueHandler = () => {
    // alert('You continue!');
    // this.setState({loading: true});
    // const order = {
    //   ingredients: this.state.ingredients,
    //   price: this.state.totalPrice,
    //   customer: {
    //     name: 'Max Schwarzmuller',
    //     address: {
    //       street: 'teststreet 1',
    //       zipCode: '41351',
    //       country: 'Germany'
    //     },
    //     email: 'test@test.com'
    //   },
    //   deliveryMethod: 'fastest'
    // };
    // axios.post('/orders.json', order)
    //   .then(response => {
    //     this.setState({loading: false, purchasing: false });
    //     return console.log(response);
    //   })
    //   .catch(error => {
    //     this.setState({loading:false, purchasing: false});
    //     return console.log(error)});

    // const queryParams = [];
    // for (let i in this.state.ingredients) {
    //   queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
    onInitPurchase();
    props.history.push('/checkout');
  }
  
  // queryParams.push('price=' + this.state.totalPrice);
  // const queryString = queryParams.join('&');
  // console.log('[BurgerBuilder.js]' + this.state.totalPrice);
  // this.props.history.push({
    //   pathname: '/checkout',
    //   search: '?' + queryString
    // });
  // }

    const disabledInfo = {
      ...ings
    };

    for(let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    let orderSummary = null

    let burger = error ? <p>Igredient can't be loaded!</p> : <Spinner />;
    if (ings) {
      burger = (
        <Aux>
          <Burger ingredients={ings}/>
            <BuildControls 
              ingredientAdded={onIngredientAdded}
              ingredientRemoved={onIngredientRemoved}
              disabled={disabledInfo}
              purchaseable={updatePurchaseState(ings)}
              ordered={purchaseHandler}
              isAuth={isAuthenticated}
              price={price}
              />
        </Aux>
      );
      orderSummary = <OrderSummary
          ingredients={ings}
          price={price}
          purchaseCancelled={purchaseCancelHandler}
          purchaseContinued={purchaseContinueHandler}/>;
    }

    return (
      <Aux>
        <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
         {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
}

// const mapStateToProps = state => {
//   return {
//     ings: state.burgerBuilder.ingredients,
//     price: state.burgerBuilder.totalPrice,
//     error: state.burgerBuilder.error,
//     isAuthenticated: state.auth.token !== null
//   }
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
//     onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
//     onInitIngredients: () => dispatch(actions.initIngredients()),
//     onInitPurchase: () => dispatch(actions.purchaseInit()),
//     onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
//   }
// };

// export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(burgerBuilder, axios));
export default withErrorHandler(burgerBuilder, axios);