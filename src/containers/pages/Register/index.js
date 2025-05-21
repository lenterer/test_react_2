import React, {Component} from 'react';
import './Register.scss';
import Button from '../../../components/atoms/Button';
import { connect } from 'react-redux';
import { registerUserAPI } from '../../../config/redux/action';

class Register extends Component {
    state = {
        email : '',
        password : '',
        isLoading: false
    }

    handleChangeText = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    handleRegisterSubmit = async () => {
        const {email, password} = this.state;
        const res = await this.props.registerAPI({email, password}).catch(err => err);
        if(res){
            this.setState({
                email: '',
                password: ''
            })
        }
    }

    render(){
        return(
            <div className="register-page">
                <div className="form-box">
                    <p>Register Page</p>
                    <input placeholder="Email" id='email' type="text" onChange={this.handleChangeText} value={this.state.email}/>
                    <input placeholder="Password" id='password' type="password" onChange={this.handleChangeText} value={this.state.password}/>
                    <Button onClick={this.handleRegisterSubmit} title="Register asw" loading={this.props.isLoading}/>
                </div>
                <button className="goto-btn">Go to Dashboard</button>
            </div>
        );
    }
}

const reduxState = (state) => ({
    isLoading: state.isLoading
})

const reduxdDispatch = (dispatch) => ({
    registerAPI: (data) => dispatch(registerUserAPI(data))
})

export default connect(reduxState, reduxdDispatch)(Register);