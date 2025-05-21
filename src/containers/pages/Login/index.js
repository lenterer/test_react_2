import React, {Component} from 'react';
import './Login.scss'
import { connect } from 'react-redux';
import { actionUserName, loginUserAPI } from '../../../config/redux/action'
import Button from '../../../components/atoms/Button';
import { useNavigate } from 'react-router-dom';

class Login extends Component {
    changeUser = () => {
        this.props.changeUserName()
    }

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

    handleLoginSubmit = async () => {
        const {email, password} = this.state;
        const { navigate } = this.props;
        const res = await this.props.loginAPI({email, password}).catch(err => err);
        if(res){
            console.log('Login Succes');
            this.setState({
                email: '',
                password: ''
            })
            navigate('/dashboard')
        }else {
            console.log('Login Failed')
        }
    }

    render(){
        return(
            <div className="login-page">
                <div className="form-box">
                    <p>Login Page</p>
                    <input placeholder="Email" id='email' type="text" onChange={this.handleChangeText} value={this.state.email}/>
                    <input placeholder="Password" id='password' type="password" onChange={this.handleChangeText} value={this.state.password}/>
                    <Button onClick={this.handleLoginSubmit} title="Login" loading={this.props.isLoading}/>
                </div>
                <button className="goto-btn">Go to Dashboard</button>
            </div>
        );
    }
}

const reduxState = (state) => ({
    isLoading: state.isLoading
});

const reduxDispatch = (dispatch) => ({
    loginAPI: (data) => dispatch(loginUserAPI(data))
});

const withNavigate = (Component) => {
    return function WrappedComponent(props) {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
};

export default withNavigate(
    connect(reduxState, reduxDispatch)(Login)
);