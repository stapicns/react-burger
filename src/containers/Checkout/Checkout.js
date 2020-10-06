import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';
// import * as actions from '../../store/actions/index';

const checkout = props => {

  // UNSAFE_componentWillMount() {
  //   const query = new URLSearchParams(this.props.location.search);
  //   const ingredients = {}
  //   let price = 0;
  //     for (let param of query.entries()) {
  //       //['salad', '1']
  //       console.log('[Checkout.js] param: ' + param);
  //       if (param[0] === 'price') {
  //         price = param[1];
  //       } else {
  //         ingredients[param[0]] = +param[1];
  //       }
  //     }
  //     console.log('[Checkout.js]: ' + price);
  //     this.setState({ingredients: ingredients, totalPrice: price});
  // }

  const checkoutCancelledHandler = () => {
    props.history.goBack();
  }

  const checkoutContinuedHandler = () => {
    props.history.replace('/checkout/contact-data');
  }

    let summary = <Redirect to="/" />

    if (props.ings) {
      const purchasedRedirect = props.purchased ? <Redirect to="/" /> : null;
     summary = ( 
     <div>
       {purchasedRedirect}
       <CheckoutSummary
          ingredients={props.ings}
          checkoutCancelled={checkoutCancelledHandler}
          checkoutContinued={checkoutContinuedHandler} />;

      <Route
          path={props.match.path + '/contact-data'}
          component={ContactData} />;
      </div>
      )
    }
    return  summary
      //  render={(props) => (<ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} {...props}/>)};
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    purchased: state.order.purchased
  };
}

export default connect(mapStateToProps)(checkout);