import React, { Component, useEffect, useState } from 'react';
import './Dashboard.scss'
import mqttService from '../../../config/mqtt'

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            message: '',
            incoming: {
                text: '',
                time: ''
              },
            connected: false,
        };
    }

    componentDidMount(){
        mqttService.connect(
            this.handleMessage, 
            (status) => {
                this.setState({ connected: status });
            } 
        );
    }

    componentWillUnmount(){
        mqttService.disconnect();
    }

    handleMessage = (topic, payload) => {
        const now = new Date();
        const timeMessage = now.toLocaleTimeString();

        this.setState({
            incoming: {
              text: payload,
              time: timeMessage
            }
        });
    };

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        });
    };

    sendMessage = () => {
        if (this.state.message.trim() === '') return;

        mqttService.publish(this.state.message);
        this.setState({ message: '' });
    };

    render(){
        const { message, incoming, connected } = this.state;
        
        return(
            <div className='dashboard-page'>
                <h1>Dashboard MQTT React App (HiveMQ)</h1>
                <p>Status: {connected ? 'Connected' : 'Disconnected'}</p>

                <div className="mqtt-box">
                    <div className="mqtt-column">
                        <h3>Pesan Masuk</h3>
                        <div className="incoming-box">
                            {incoming.text ? (
                                <>
                                <p>{incoming.time} {' -> '} {incoming.text}</p>
                                </>
                            ) : '(belum ada pesan)'
                            }
                        </div>
                    </div>

                    <div className="mqtt-column">
                    <h3>Kirim Pesan</h3>
                    <input
                        type="text"
                        id="message"
                        value={this.state.message}
                        onChange={this.handleChange}
                        placeholder="Tulis pesan..."
                        className="mqtt-input"
                    />
                    <button 
                        onClick={this.sendMessage} 
                        className="mqtt-button"
                        disabled={!connected}
                    >
                        Kirim
                    </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;