import React, {useEffect, useState} from 'react';
import Axios from "axios";

const Subscribe = ({ userTo, userFrom }) => {

    const [SubscribeNumber, setSubscribeNumber] = useState(0);
    const [Subscribed, setSubscribed] = useState(false);

    useEffect(() => {

        const variables = { userTo };

        Axios.post('/api/subscribe/subscribeNumber', variables)
            .then(response => {
                response.data.success ? setSubscribeNumber(response.data.subscribeNumber) : alert("failed");
            });

        const subscribeVariables = { userTo, userFrom: localStorage.getItem('userId') };

        Axios.post('/api/subscribe/subscribed', subscribeVariables)
            .then(response => {
                response.data.success ? setSubscribed(response.data.subscribed) : alert("failed");
            });

    }, []);

    const onSubscribe = () => {

        const subscribedVariables = { userTo, userFrom };
        if (Subscribed) {
            Axios.post('/api/subscribe/unsubscribe', subscribedVariables)
                .then(response => {
                    if (response.data.success) {
                        setSubscribeNumber(SubscribeNumber - 1);
                        setSubscribed(!Subscribed);
                    } else {
                        alert('구독을 취소하는데 실패했습니다.');
                    }
                });
        } else {
            Axios.post('/api/subscribe/subscribe', subscribedVariables)
                .then(response => {
                    if (response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1);
                        setSubscribed(!Subscribed);
                    } else {
                        alert('구독 하는데 실패했습니다.');
                    }
                });
        }
    }

    return (
        <div>
            <button
                onClick={onSubscribe}
                style={{
                    backgroundColor: `${Subscribed ? "#AAAAAA" : '#CC0000' }`, borderRadius: '4px',
                    color: 'white', padding: '10px 16px',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
            >
                {SubscribeNumber} {Subscribed ? '구독중' : '구독'}
            </button>
        </div>
    );
};

export default Subscribe;