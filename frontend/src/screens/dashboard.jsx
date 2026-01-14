import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie } from 'recharts';

import './dashboard.css';
import { useGetOrdersAnalysisQuery, useGetProductsAnalysisQuery, useGetProductsAnalysisIdQuery, useGetProductsAnalysisAllQuery, useGetUsersAnalysisQuery } from '../slices/dashboardApiSlice';
import { useGetQuery, useUpdateMutation } from '../slices/paymentApiSLice';
import { useUpdateUserMutation, useGetUserQuery } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';

const Dashboard = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { data: UsersAnalysis, isLoading: usersAnalysIsLoading, refetch: refetchUserAnalysis } = useGetUsersAnalysisQuery();
    const { data: user, isLoading: usersIsLoading, refetch } = useGetUserQuery(userInfo._id);
    const { data: RequestAnalysis, isLoading: requestAnalysisLoading, refetch: refetchRequests } = useGetQuery();
    const [update, { isLoading: isLoadingUpdate }] = useUpdateMutation();
    const [updateUser, { isLoading: isLoadingUpdateUser }] = useUpdateUserMutation();
    const { data: ProductsAnalysis, isLoading: productsAnalysisLoading, refetch: refetchProductsAnalysis } = useGetProductsAnalysisQuery();
    const { data: ProductsAnalysisId, isLoading: productsAnalysisLoadingId, refetch: refetchProductsAnalysisId } = userInfo.role === "2" ? useGetProductsAnalysisIdQuery(userInfo._id) : useGetProductsAnalysisAllQuery();
    const { data: OrdersAnalysis, isLoading: ordersAnalysisLoading, refetch: refetchOrdersAnalysis } = useGetOrdersAnalysisQuery();
    const [filterStatus, setFilterStatus] = useState('all');
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        if (!hasFetched) {
            refetchUserAnalysis();
            refetchRequests();
            refetchProductsAnalysis();
            refetchProductsAnalysisId();
            refetchOrdersAnalysis();
            refetch();
            setHasFetched(true);
        }
    }, [dispatch, refetchUserAnalysis, refetchRequests, refetchProductsAnalysis, refetchProductsAnalysisId, refetchOrdersAnalysis, refetch, hasFetched]);

    const isAdmin = userInfo?.role === "0";
    const isVendor = userInfo?.role === "2" || userInfo?.role === "3";

    const adminMenu = {
        main: [
            { label: 'Dashboard', content: 'Dashboard', path: '/dashboard' },
            { label: 'Profile', content: 'Manage Profile', path: '/profile' },
        ],
        lists: [
            { label: 'Users', content: 'Manage Users' },
            { label: 'Products', content: 'Manage Products' },
            { label: 'Orders', content: 'Manage Orders' },
        ],
        maintenance: [
            { label: 'Requests', content: 'Manage Requests' },
            { label: 'Setting', content: 'Manage Setting', path: '/setting' },
        ],
    };

    const vendorMenu = {
        main: [
            { label: 'Dashboard', content: 'Dashboard', path: '/dashboard' },
            { label: 'Profile', content: 'Manage Profile', path: '/profile' },
        ],
        lists: [
            { label: 'Products', content: 'Manage Products' },
            { label: 'Sales', content: 'View Sales' },
        ],
        maintenance: [
            { label: 'Incomes', content: 'View Incomes of the Last Month' },
            { label: 'Setting', content: 'Manage Setting', path: '/setting' },
        ],
    };

    const menu = isAdmin ? adminMenu :
        isVendor ? vendorMenu : {};

    const [selectedMenu, setSelectedMenu] = useState(menu.main[0] || { label: 'Home', content: 'Welcome to the Dashboard' });

    const handleMenuClick = (item) => {
        setSelectedMenu(item);
        if (item.path) {
            navigate(item.path);
        }
    };

    const handleDone = async (request) => {
        try {
            const confirm = window.confirm('Did The Payment Successfully Passed?');
            if (!confirm) {
                return;
            }
            const updateData = {
                status: "completed"
            };
            await update({ id: request._id, ...updateData }).unwrap();

            const response = await fetch(`/api/client/${request.vendor._id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch vendor data");
            }
            const vendor = await response.json();
            let sold = vendor.sold - request.total;
            const data = {
                sold: sold
            };
            await updateUser({ id: request.vendor._id, data }).unwrap();
            toast.success("Request Has Been Paid!", { autoClose: 1000 });
            refetchRequests();
        } catch (error) {
            console.log(error);
            toast.error("Request Failed!", { autoClose: 1000 });
        }
    }

    useEffect(() => {
        if (user) { // Add this check to ensure `user` is defined
            if (user.sold !== userInfo.sold) {
                dispatch(setCredentials({ user: null, token: null }));
            }
        }
    }, [user, userInfo, dispatch]);

    return (
        <>
            <div className="dashboard-container">
                <div className="dashboard-sidebar">
                    <h5>Main</h5>
                    <ul>
                        {menu.main.map((item, index) => (
                            <li
                                key={index}
                                className={selectedMenu?.label === item.label ? 'active' : ''}
                                onClick={() => handleMenuClick(item)}
                            >
                                {item.label}
                            </li>
                        ))}
                    </ul>

                    {menu.lists.length > 0 && (
                        <>
                            <h5>Lists</h5>
                            <ul>
                                {menu.lists.map((item, index) => (
                                    <li
                                        key={index}
                                        className={selectedMenu?.label === item.label ? 'active' : ''}
                                        onClick={() => handleMenuClick(item)}
                                    >
                                        {item.label}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    {menu.maintenance.length > 0 && (
                        <>
                            <h5>Maintenance</h5>
                            <ul>
                                {menu.maintenance.map((item, index) => (
                                    <li
                                        key={index}
                                        className={selectedMenu?.label === item.label ? 'active' : ''}
                                        onClick={() => handleMenuClick(item)}
                                    >
                                        {item.label}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>

                <div className="dashboard-content">
                    {selectedMenu?.label === 'Dashboard' && (
                        <div className="dashboard-intro">
                            <h2>Welcome to Your Dashboard</h2>
                            <p>This is your dashboard overview. You can navigate through various sections to manage your profile, settings, and other important tasks.</p>
                            <p>Here you can monitor the user's activity, items such as images, videos and audio's best sells and analysis</p>

                            {userInfo.role === "2" && (
                                <>
                                    <span style={{ textDecoration: 'underline' }}>
                                        Your Current Sold Is: {userInfo.sold}DH
                                    </span>
                                    <p style={{ color: 'red' }}>
                                        You are eligible to request a bank payment after 30 days of account activation, provided your total sales exceed 100 DH.
                                    </p>
                                    {userInfo.sold >= 100 && new Date() - new Date(userInfo.dateCreated) >= 30 * 24 * 60 * 60 * 1000 &&
                                        <button class="dashboard-button" onClick={() => navigate('/request-payout')}>Request Payout to Bank</button>
                                    }
                                </>
                            )}
                        </div>
                    )}

                    {selectedMenu?.label === 'Users' && (
                        <div className="users-section">
                            {UsersAnalysis?.mostActiveUser?.length > 0 && (
                                <div className="chart-container">
                                    <h3>Most Active User</h3>
                                    <BarChart width={600} height={300} data={UsersAnalysis.mostActiveUser.map(user => ({
                                        username: user._id.username,
                                        activityCount: user.activityCount,
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="username" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="activityCount" fill="#73D6BA" />
                                    </BarChart>
                                    <p>
                                        <strong>
                                            {UsersAnalysis.mostActiveUser[0]._id.firstName} {UsersAnalysis.mostActiveUser[0]._id.lastName}
                                        </strong>
                                        <br />
                                        Username: {UsersAnalysis.mostActiveUser[0]._id.username}
                                        <br />
                                        Activity Count: {UsersAnalysis.mostActiveUser[0].activityCount}
                                    </p>
                                </div>
                            )}

                            {UsersAnalysis?.topVendorsItems?.length > 0 && (
                                <div className="chart-container">
                                    <h3>Top Vendors (Items)</h3>
                                    <BarChart width={600} height={300} data={UsersAnalysis.topVendorsItems.map(vendor => ({
                                        username: vendor._id.username,
                                        totalRevenue: vendor.totalRevenue,
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="username" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="totalRevenue" fill="#FFBB28" />
                                    </BarChart>
                                    <p>
                                        <strong>
                                            {UsersAnalysis.topVendorsItems[0]._id.firstName} {UsersAnalysis.topVendorsItems[0]._id.lastName}
                                        </strong>
                                        <br />
                                        Username: {UsersAnalysis.topVendorsItems[0]._id.username}
                                        <br />
                                        Total Revenue: {UsersAnalysis.topVendorsItems[0].totalRevenue}DH
                                    </p>
                                </div>
                            )}

                            {UsersAnalysis?.topVendorsServices?.length > 0 && (
                                <div className="chart-container">
                                    <h3>Top Vendors (Services)</h3>
                                    <BarChart width={600} height={300} data={UsersAnalysis.topVendorsServices.map(vendor => ({
                                        username: vendor._id.username,
                                        totalRevenue: vendor.totalRevenue,
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="username" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="totalRevenue" fill="#FFBB28" />
                                    </BarChart>
                                    <p>
                                        <strong>
                                            {UsersAnalysis.topVendorsServices[0]._id.firstName} {UsersAnalysis.topVendorsServices[0]._id.lastName}
                                        </strong>
                                        <br />
                                        Username: {UsersAnalysis.topVendorsServices[0]._id.username}
                                        <br />
                                        Total Revenue: {UsersAnalysis.topVendorsServices[0].totalRevenue}DH
                                    </p>
                                </div>
                            )}

                            {UsersAnalysis?.topClients?.length > 0 && (
                                <div className="chart-container">
                                    <h3>Top Clients</h3>
                                    <BarChart width={600} height={300} data={UsersAnalysis.topClients.map(client => ({
                                        username: client._id.username,
                                        totalSpent: client.totalSpent,
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="username" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="totalSpent" fill="#82ca9d" />
                                    </BarChart>
                                    <p>
                                        <strong>
                                            {UsersAnalysis.topClients[0]._id.firstName} {UsersAnalysis.topClients[0]._id.lastName}
                                        </strong>
                                        <br />
                                        Username: {UsersAnalysis.topClients[0]._id.username}
                                        <br />
                                        Total Spent: {UsersAnalysis.topClients[0].totalSpent}DH
                                    </p>
                                </div>
                            )}

                            {UsersAnalysis?.averageClientSpending && (
                                <div className="chart-container">
                                    <h3>Average Client Spending</h3>
                                    <BarChart
                                        width={600}
                                        height={300}
                                        data={[{ category: 'Average', totalSpending: UsersAnalysis.averageClientSpending }]}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="category" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="totalSpending" fill="#8884d8" />
                                    </BarChart>
                                    <p>Average Client Spending: {UsersAnalysis.averageClientSpending}DH</p>
                                </div>
                            )}
                        </div>
                    )}

                    {selectedMenu?.label === 'Products' && (
                        <div className="products-section">
                            {productsAnalysisLoading ? (
                                <p>Loading product analysis...</p>
                            ) : (
                                <>
                                    {ProductsAnalysis.mostSoldProducts?.length > 0 && (
                                        <div className="chart-container">
                                            <h3>Top 5 Most Sold Products</h3>
                                            <BarChart
                                                width={600}
                                                height={300}
                                                data={ProductsAnalysis.mostSoldProducts.map(product => ({
                                                    name: product._id?.title || 'Unknown',
                                                    totalSold: product.totalSold,
                                                }))}>
                                                <XAxis
                                                    dataKey="name"
                                                    label={{ value: 'Product', position: 'insideBottomRight', offset: 15 }}
                                                />
                                                <YAxis
                                                    label={{ value: 'Total Sold', angle: -90, position: 'insideLeft', offset: 15 }}
                                                />
                                                <Tooltip />
                                                <Bar dataKey="totalSold" className="bar-color-1" />
                                            </BarChart>
                                        </div>
                                    )}

                                    {ProductsAnalysis.topRevenueGeneratingItems?.length > 0 && (
                                        <div className="chart-container">
                                            <h3>Top 5 Revenue-Generating Products</h3>
                                            <BarChart
                                                width={600}
                                                height={300}
                                                data={ProductsAnalysis.topRevenueGeneratingItems.map(item => ({
                                                    name: item._id?.title || 'Unknown',
                                                    totalRevenue: item.totalRevenue,
                                                }))}>
                                                <XAxis
                                                    dataKey="name"
                                                    label={{ value: 'Product', position: 'insideBottomRight', offset: 15 }}
                                                />
                                                <YAxis
                                                    label={{ value: 'Total Revenue', angle: -90, position: 'insideLeft', offset: 15 }}
                                                />
                                                <Tooltip />
                                                <Bar dataKey="totalRevenue" className="bar-color-2" />
                                            </BarChart>
                                        </div>
                                    )}

                                    {ProductsAnalysis.mostPopularCategories?.length > 0 && (
                                        <div className="chart-container">
                                            <h3>Top 5 Most Popular Categories</h3>
                                            <PieChart width={400} height={400}>
                                                <Pie
                                                    data={ProductsAnalysis.mostPopularCategories.map(category => ({
                                                        name: category._id?.name || 'Unknown',
                                                        value: category.totalProducts,
                                                    }))}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    fill="#ffc658"
                                                    label
                                                />
                                                <Legend />
                                                <Tooltip formatter={(value, name) => `${name}: ${value} products`} />
                                            </PieChart>
                                        </div>
                                    )}

                                    {ProductsAnalysis.mostUsedTags?.length > 0 && (
                                        <div className="chart-container">
                                            <h3>Top 5 Most Used Tags</h3>
                                            <BarChart
                                                width={600}
                                                height={300}
                                                data={ProductsAnalysis.mostUsedTags.map(tag => ({
                                                    name: tag._id?.name || 'Unknown',
                                                    totalTags: tag.totalTags,
                                                }))}>
                                                <XAxis
                                                    dataKey="name"
                                                    label={{ value: 'Tag', position: 'insideBottomRight', offset: 15 }}
                                                />
                                                <YAxis
                                                    label={{ value: 'Total Tags', angle: -90, position: 'insideLeft', offset: 15 }}
                                                />
                                                <Tooltip />
                                                <Bar dataKey="totalTags" className="bar-color-3" />
                                            </BarChart>
                                        </div>
                                    )}

                                    {ProductsAnalysis.topVendorsBySales?.length > 0 && (
                                        <div className="chart-container">
                                            <h3>Top 5 Vendors by Sales</h3>
                                            <BarChart
                                                width={600}
                                                height={300}
                                                data={ProductsAnalysis.topVendorsBySales.map(vendor => ({
                                                    name: vendor._id?.username || 'Unknown',
                                                    totalSales: vendor.totalSales,
                                                }))}>
                                                <XAxis
                                                    dataKey="name"
                                                    label={{ value: 'Vendor', position: 'insideBottomRight', offset: 15 }}
                                                />
                                                <YAxis
                                                    label={{ value: 'Total Sales', angle: -90, position: 'insideLeft', offset: 15 }}
                                                />
                                                <Tooltip />
                                                <Bar dataKey="totalSales" className="bar-color-4" />
                                            </BarChart>
                                        </div>
                                    )}

                                    {ProductsAnalysis.topVendorsByProducts?.length > 0 && (
                                        <div className="chart-container">
                                            <h3>Top 5 Vendors by Products</h3>
                                            <BarChart
                                                width={600}
                                                height={300}
                                                data={ProductsAnalysis.topVendorsByProducts.map(vendor => ({
                                                    name: vendor._id?.username || 'Unknown',
                                                    totalProducts: vendor.totalProducts,
                                                }))}>
                                                <XAxis
                                                    dataKey="name"
                                                    label={{ value: 'Vendor', position: 'insideBottomRight', offset: 15 }}
                                                />
                                                <YAxis
                                                    label={{ value: 'Total Products', angle: -90, position: 'insideLeft', offset: 15 }}
                                                />
                                                <Tooltip />
                                                <Bar dataKey="totalProducts" className="bar-color-5" />
                                            </BarChart>
                                        </div>
                                    )}

                                    {ProductsAnalysis.topSpendingCustomers?.length > 0 && (
                                        <div className="chart-container">
                                            <h3>Top 5 Spending Customers</h3>
                                            <BarChart
                                                width={600}
                                                height={300}
                                                data={ProductsAnalysis.topSpendingCustomers.map(customer => ({
                                                    name: customer._id?.username || 'Unknown',
                                                    totalSpent: customer.totalSpent,
                                                }))}>
                                                <XAxis
                                                    dataKey="name"
                                                    label={{ value: 'Customer', position: 'insideBottomRight', offset: 15 }}
                                                />
                                                <YAxis
                                                    label={{ value: 'Total Spent', angle: -90, position: 'insideLeft', offset: 15 }}
                                                />
                                                <Tooltip />
                                                <Bar dataKey="totalSpent" className="bar-color-1" />
                                            </BarChart>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {selectedMenu?.label === 'Orders' && (
                        <div className="orders-section">
                            {OrdersAnalysis?.topClientsBySpending?.length > 0 && (
                                <div className="top-clients">
                                    <h3>Top Clients by Spending</h3>
                                    {OrdersAnalysis.topClientsBySpending.map(client => (
                                        <div key={client.id}>
                                            <p><strong>Client Username:</strong> {client.username}</p>
                                            <p><strong>Total Spent:</strong> {client.totalSpent.toFixed(2)}DH</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="orders-summary">
                                {OrdersAnalysis?.totalOrders > 0 && (
                                    <div className="chart-container">
                                        <h3>Order Status Overview</h3>
                                        <BarChart
                                            width={600}
                                            height={300}
                                            data={[
                                                { name: 'Total Orders', value: OrdersAnalysis.totalOrders },
                                                { name: 'Completed Orders', value: OrdersAnalysis.completedOrders },
                                                { name: 'Pending Orders', value: OrdersAnalysis.pendingOrders },
                                                { name: 'Cancelled Orders', value: OrdersAnalysis.cancelledOrders },
                                            ]}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="value" fill="#8884d8" name="Order Count" />
                                        </BarChart>
                                    </div>
                                )}

                                {(OrdersAnalysis?.totalRevenue || OrdersAnalysis?.averageOrderTotal) && (
                                    <div className="chart-container">
                                        <h3>Revenue & Average Order</h3>
                                        <BarChart
                                            width={600}
                                            height={300}
                                            data={[
                                                { name: 'Total Revenue (DH)', value: OrdersAnalysis.totalRevenue },
                                                { name: 'Average Order Total (DH)', value: OrdersAnalysis.averageOrderTotal },
                                            ]}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="value" fill="#82ca9d" name="Revenue & Average" />
                                        </BarChart>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {selectedMenu?.label === 'Sales' && (
                        <div className="sales-section">
                            {productsAnalysisLoadingId ? (
                                <p>Loading sales data...</p>
                            ) : (
                                <>
                                    {ProductsAnalysisId.mostSoldProducts?.length > 0 ? (
                                        <div className="chart-container">
                                            <h3>Most Sold Products</h3>
                                            <ul>
                                                {ProductsAnalysisId.mostSoldProducts.map(product => (
                                                    <li key={product._id}>
                                                        <strong>{product.productData?.title || 'Unknown Product'}</strong>
                                                        <p>Total Sold: {product.totalProductsSold}</p>
                                                        <p>Total Revenue: {product.totalRevenue}DH</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <p>No data available for Most Sold Products.</p>
                                    )}

                                    {ProductsAnalysisId.mostSoldVideos?.length > 0 ? (
                                        <div className="chart-container">
                                            <h3>Most Sold Videos</h3>
                                            <ul>
                                                {ProductsAnalysisId.mostSoldVideos.map((video, index) => (
                                                    <li key={index}>
                                                        <strong>{video.videoData?.title || 'Unknown Video'}</strong>
                                                        <p>Total Sold: {video.totalVideosSold}</p>
                                                        <p>Order Total: {video.orderTotal}DH</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <p>No data available for Most Sold Videos.</p>
                                    )}

                                    {ProductsAnalysisId.mostSoldAudios?.length > 0 ? (
                                        <div className="chart-container">
                                            <h3>Most Sold Audios</h3>
                                            <ul>
                                                {ProductsAnalysisId.mostSoldAudios.map((audio, index) => (
                                                    <li key={index}>
                                                        <strong>{audio.audioData?.title || 'Unknown Audio'}</strong>
                                                        <p>Total Sold: {audio.totalAudiosSold}</p>
                                                        <p>Total Revenue: {audio.totalRevenue}DH</p>
                                                        <p>Order Total: {audio.orderTotal}DH</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <p>No data available for Most Sold Audios.</p>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {selectedMenu?.label === 'Incomes' && (
                        <div className="incomes-section">
                            {productsAnalysisLoadingId ? (
                                <p>Loading income data...</p>
                            ) : (
                                <>
                                    {ProductsAnalysisId.mostSoldProducts?.length > 0 ? (
                                        <div className="chart-container">
                                            <h3>Income Over Time</h3>
                                            <BarChart
                                                width={500}
                                                height={300}
                                                data={ProductsAnalysisId.mostSoldProducts.map(product => ({
                                                    date: new Date(product.dateCreated).toLocaleDateString(),
                                                    income: product.totalRevenue,
                                                }))}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="income" fill="#4CAF50" />
                                            </BarChart>
                                            <div className="total-revenue">
                                                <h4>Total Revenue:</h4>
                                                <h5>
                                                    {ProductsAnalysisId.mostSoldProducts.reduce(
                                                        (total, product) => total + product.totalRevenue,
                                                        0
                                                    )}DH
                                                </h5>
                                            </div>
                                        </div>
                                    ) : (
                                        <p>No data available for Income Over Time.</p>
                                    )}

                                    {ProductsAnalysisId.mostSoldProducts?.length > 0 ? (
                                        <div className="pie-chart-container">
                                            <h3>Revenue Distribution</h3>
                                            <PieChart width={400} height={400}>
                                                <Pie
                                                    data={ProductsAnalysisId.mostSoldProducts.map(product => ({
                                                        name: product.product?.title || product.video?.title || product.audio?.title || 'Unknown',
                                                        value: product.totalRevenue,
                                                    }))}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={150}
                                                    fill="#8884d8"
                                                    label
                                                />
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </div>
                                    ) : (
                                        <p>No data available for Revenue Distribution.</p>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {selectedMenu?.label === 'Requests' && (
                        <div className="requests-section">
                            <div className="filter-section">
                                <label htmlFor="status-filter">Filter by Status:</label>
                                <select
                                    id="status-filter"
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    value={filterStatus}
                                >
                                    <option value="all">All</option>
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            {requestAnalysisLoading ? (
                                <p>Loading income data...</p>
                            ) : (
                                <>
                                    {RequestAnalysis.filter(
                                        (request) =>
                                            filterStatus === 'all' || request.status === filterStatus
                                    ).length === 0 ? (
                                        <div className="no-data">
                                            <p>No requests found for the selected status.</p>
                                        </div>
                                    ) : (
                                        <table className="request-table">
                                            <thead>
                                                <tr>
                                                    <th>Bank Details</th>
                                                    <th>Vendor</th>
                                                    <th>Order Details</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {RequestAnalysis.filter(
                                                    (request) =>
                                                        filterStatus === 'all' || request.status === filterStatus
                                                ).map((request) => (
                                                    <tr key={request._id}>
                                                        <td>
                                                            <p><strong>Account Holder Name:</strong> {request.bankDetails.accountHolderName}</p>
                                                            <p><strong>Account Number:</strong> {request.bankDetails.accountNumber}</p>
                                                            <p><strong>Bank Name:</strong> {request.bankDetails.bankName}</p>
                                                            <p><strong>Branch:</strong> {request.bankDetails.branch}</p>
                                                            <p><strong>RIB:</strong> {request.bankDetails.rib}</p>
                                                        </td>
                                                        <td>
                                                            <p><strong>Username:</strong> {request.vendor.username}</p>
                                                            <img
                                                                src={`${import.meta.env.VITE_API_BASE_URL}api/pictures/avatar/${request.vendor._id}/${request.vendor.avatar.split('/').pop()}`}
                                                                alt="Vendor Avatar"
                                                                className="vendor-avatar"
                                                                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <p><strong>Total:</strong> {request.total}DH</p>
                                                            <p><strong>Status:</strong> {request.status}</p>
                                                            <p><strong>Date Created:</strong> {new Date(request.dateCreated).toLocaleDateString()}</p>
                                                        </td>
                                                        {request.status === "pending" &&
                                                            <td>
                                                                <button
                                                                    className="done-button"
                                                                    onClick={() => handleDone(request)}
                                                                >
                                                                    <span className="icon">✔</span>
                                                                </button>
                                                            </td>
                                                        }
                                                        {request.status === "completed" &&
                                                            <td>
                                                                <span className="green-check">✔</span>
                                                            </td>
                                                        }
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default Dashboard;
