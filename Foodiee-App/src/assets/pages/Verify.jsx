import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { StoreContext } from '../storecontext/StoreContext';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    
    const navigate = useNavigate();
    const { token, clearCart } = useContext(StoreContext); // Make sure clearCart exists in your Context

    const verifyPayment = async () => {
        try {
            const response = await axios.post('/api/orders/verify', { success, orderId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                // Empty the cart and redirect to the user's orders page
                if(clearCart) clearCart(); 
                navigate("/myorders");
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