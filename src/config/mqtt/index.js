// src/mqttService.js
import mqtt from 'mqtt';

// Ganti dengan kredensial dan URL milikmu
const MQTT_BROKER = 'wss://abda57f3c12743db931e9bed3781aca3.s1.eu.hivemq.cloud:8884/mqtt';
const MQTT_TOPIC = 'test/ESP32';
const username = 'Testing.Rippers';
const password = 'Bismillah1';

let client = null;

const connect = (onMessageCallback, onConnectCallback = () => {}) => {
    client = mqtt.connect(MQTT_BROKER, {
        username,
        password,
        clean: true,       // session baru
        reconnectPeriod: 5000, // auto-reconnect tiap 1 detik
        connectTimeout: 10000,  // timeout 4 detik
    });

    client.on('connect', () => {
        console.log('Connected to MQTT broker');
        client.subscribe(MQTT_TOPIC, (err) => {
        if (!err) {
            console.log(`Subscribed to ${MQTT_TOPIC}`);
        }
        });
        onConnectCallback(true);
    });

    client.on('message', (topic, payload) => {
        if (typeof onMessageCallback === 'function') {
        onMessageCallback(topic, payload.toString());
        }
    });

    client.on('error', (err) => {
        console.error('MQTT Error:', err);
        onConnectCallback(false);
    });
};

const publish = (message) => {
  if (client && client.connected) {
    client.publish(MQTT_TOPIC, message);
  } else {
    console.warn('MQTT client not connected');
  }
};

const disconnect = () => {
  if (client) {
    client.end();
  }
};

export default {
  connect,
  publish,
  disconnect,
};