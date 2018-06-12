import React from 'react';
import { Link } from 'react-router-dom';
import OrderLinks from '../OrderLinks/OrderLinks';
import styles from '../OrderState.scss';

const OrderSuccess = props => (
  <div className={styles.container}>
    <h2 className={styles.title}>Order success</h2>

    <Link to="/" className={styles['another-order']}>
      Make Another Order!
    </Link>

    <OrderLinks {...props} />
  </div>
);

export default OrderSuccess;