import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import CInput from '../components/CRInput';
import CDropDown from '../components/CDropDown';
import CCheckbox from '../components/CCheckbox';
import authActions from '../redux/reducers/auth/actions';

class renderField extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { props } = this;

    if (props.type === 'checkbox') {
      return (
        <CCheckbox
          {...props}
          checkboxTitle={props.checkboxTitle}
        />
      );
    } if (props.type === 'select') {
      return (
        <CDropDown
          {...props}
          dropdownData={props.dropdownData}
          value={props.input.value}
        />
      );
    }

    return (
      <CInput
        {...props}
        editable={props.editable}
        error={props.error}
        viewStyle={props.viewStyle}
        mgBottom={props.mgBottom}
        leftIcon={props.leftIcon}
        MleftIcon={props.MleftIcon}
        FleftIcon={props.FleftIcon}
        textArea={props.textArea}
        bankdetails={props.bankdetails}
        placeholder={props.placeholder}
        keyboardType={props.keyboardType}
        inputStyle={props.inputStyle}
        secureTextEntry={props.type === 'password'}
      />
    );
  }
}

renderField.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
  }).isRequired,
  meta: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    error: PropTypes.string,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    visited: PropTypes.bool.isRequired,
  }).isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  auth: PropTypes.objectOf(PropTypes.any),
};

renderField.defaultProps = {
  type: '',
  auth: {},
};

function mapStateToProps(state, ownProps) {
  return {
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(renderField);
