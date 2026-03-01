import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { StoreContext } from '../storecontext/StoreContext';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const sessionId = searchParams.get("session_id");
    
    const navigate = useNavigate();
    const { token, clearCart } = useContext(StoreContext);

    const verifyPayment = async () => {
        try {
            const authToken = token || localStorage.getItem("accessToken") || localStorage.getItem("token");
            const response = await axios.post('/orders/verify', { success, orderId, sessionId }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            
            if (response.data.success) {
                if(clearCart) clearCart(); 
                navigate("/thankyou", { state: { orderData: { id: orderId } }, replace: true });
            } else {
                navigate("/");
            }
        } catch(error) {
            console.error("Verification failed");
            navigate("/");
        }
    };

    useEffect(() => {
        verifyPayment();
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
            <h2>Verifying your payment...</h2>
        </div>
    );
}

export default Verify;
