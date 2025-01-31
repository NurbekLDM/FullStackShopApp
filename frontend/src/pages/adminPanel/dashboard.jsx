import React, {useEffect, useState} from 'react';
import AdminPanelNavbar from "./components/navbar";
import {Outlet , useLocation} from "react-router-dom";
import {ClipLoader} from 'react-spinners';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});

    useEffect(() => {
        setTimeout(() => {
            setData('Loaded data');
            setLoading(false);
        }, 2000);
    }, []);
    const location = useLocation()
    const isDashboard = location.pathname === '/adminPanel';
    return (
        <div>
            <AdminPanelNavbar />

            <div>
                {loading ? (
                    <div style={{marginLeft: '50%', marginTop: '250px'}} className="spinner">
                        <ClipLoader size={50} color="#123abc" loading={loading}/>
                    </div>
                ) : (
                    <div className="content">
                        {isDashboard}
                        <Outlet/>
                    </div>
                )}
            </div>

        </div>
    );
}