import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import isFiatOrder from 'Utils/isFiatOrder';
import styles from './OrderCoinProcessed.scss';

class OrderCoinProcessed extends Component {
  state = { order: this.props.order };

  componentDidMount() {
    this.prepareState(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ order: nextProps.order }, () => {
      this.prepareState(nextProps);
    });
  }

  triggerCopyTooltip() {
    $('#copy-address-to-clipboard').tooltip({
      trigger: 'click',
      placement: 'top',
    });

    $('#copy-address-to-clipboard')
      .tooltip('hide')
      .attr('data-original-title', 'Address copied!')
      .tooltip('show');

    setTimeout(() => {
      $('#copy-address-to-clipboard').tooltip('destroy');
    }, 1000);
  }

  prepareState = props => {
    if (props.type === 'Deposit') {
      this.setState({
        coin: props.order.pair.quote.code,
        oppositeCoin: props.order.pair.base.code,
        amount: parseFloat(props.order.amount_quote),
        address: props.order.deposit_address ? props.order.deposit_address.address : '',
        order: props.order,
      });
    } else if (props.type === 'Receive') {
      this.setState({
        coin: props.order.pair.base.code,
        oppositeCoin: props.order.pair.quote.code,
        amount: parseFloat(props.order.amount_base),
        address: props.order.withdraw_address ? props.order.withdraw_address.address : '',
        order: props.order,
      });
    }
  };

  render() {
    let rates = ``;

    if (this.state.order && this.state.order.price) {
      rates += `Rates at order creation: \n`;
      rates += `1 ${this.state.coin} = `;

      if (this.props.type === 'Deposit') rates += `${(1 / this.state.order.price.rate).toFixed(8)} ${this.state.oppositeCoin}\n`;
      else if (this.props.type === 'Receive') rates += `${this.state.order.price.rate.toFixed(8)} ${this.state.oppositeCoin}\n`;

      rates += `1 ${this.state.coin} = `;

      if (this.props.type === 'Deposit')
        rates += `${((1 / this.state.order.price.rate) * this.state.order.price.rate_usd).toFixed(8)} USD\n`;
      else if (this.props.type === 'Receive') rates += `${this.state.order.price.rate_usd.toFixed(8)} USD\n`;

      rates += `1 ${this.state.coin} = `;

      if (this.props.type === 'Deposit') rates += `${((1 / this.state.order.price.rate) * this.state.order.price.rate_btc).toFixed(8)} BTC`;
      else if (this.props.type === 'Receive') rates += `${this.state.order.price.rate_btc.toFixed(8)} BTC`;

      if (this.state.order.user_provided_amount === 1 && this.props.type === 'Receive') {
        rates += `\n\nWithdrawal fee: \n`;
        rates += `${this.state.order.withdrawal_fee} ${this.state.order.pair.base.code}`;
      } else if (this.state.order.user_provided_amount === 0 && this.props.type === 'Deposit') {
        rates += `\n\nWithdrawal fee: \n`;
        rates += `${this.state.order.withdrawal_fee_quote} ${this.state.order.pair.quote.code}`;
      }
    }

    return (
      <div className={`col-xs-12 col-sm-6 ${styles['col-sm-6']} ${this.props.type === 'Receive' ? styles['pull-right-md'] : null}`}>
        <div className={`${styles.box} box ${this.props.type === 'Deposit' && isFiatOrder(this.props.order) ? 'fiat' : ''}`}>
          <div className={`${styles['media-left']}`}>
            <i className={`${styles.coin} cc ${this.state.coin}`} />
          </div>

          <div className={`${styles['media-right']}`}>
            <h5>
              {this.props.type}{' '}
              <b>
                {this.state.amount} {this.state.coin}
              </b>
              <i
                className="fa fa-question-circle"
                data-toggle="tooltip"
                data-placement="top"
                style={{ marginLeft: 8 }}
                data-original-title={rates}
              />
            </h5>

            <div>
              <div className={styles.address}>
                <h6>{this.state.address}</h6>
              </div>

              {this.props.type === 'Deposit' &&
                !isFiatOrder(this.props.order) && (
                  <CopyToClipboard text={this.props.order.deposit_address.address} onCopy={() => this.triggerCopyTooltip()}>
                    <i id="copy-address-to-clipboard" className={`${styles.copy} fas fa-copy`} />
                  </CopyToClipboard>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderCoinProcessed;
