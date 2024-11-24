import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie } from 'recharts';
import './dashboard.css';
import { useGetOrdersAnalysisQuery, useGetProductsAnalysisQuery, useGetServicesAnalysisQuery, useGetUsersAnalysisQuery } from '../slices/dashboardApiSlice';

const Dashboard = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const { data: UsersAnalysis, isLoading: usersAnalysisLoading } = useGetUsersAnalysisQuery();
    const { data: ProductsAnalysis, isLoading: productsAnalysisLoading } = useGetProductsAnalysisQuery();
    const { data: ServicesAnalysis, isLoading: servicesAnalysisLoading } = useGetServicesAnalysisQuery();
    const { data: OrdersAnalysis, isLoading: ordersAnalysisLoading } = useGetOrdersAnalysisQuery();

    useEffect(() => { }, []);

    const isAdmin = userInfo?.role === "0";
    const isClient = userInfo?.role === "1";
    const isVendor = userInfo?.role === "2" || userInfo?.role === "0";

    const adminMenu = {
        main: [
            { label: 'Dashboard', content: 'Dashboard', path: '/dashboard' },
            { label: 'Profile', content: 'Manage Profile', path: '/profile' },
        ],
        lists: [
            { label: 'Users', content: 'Manage Users' },
            { label: 'Products', content: 'Manage Products' },
            { label: 'Sales', content: 'View Sales' },
            { label: 'Orders', content: 'Manage Orders' },
        ],
        maintenance: [
            { label: 'Stock Library', content: 'Manage Stock Library', path: '/stock-library' },
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

    const clientMenu = {
        main: [
            { label: 'Dashboard', content: 'Dashboard', path: '/dashboard' },
            { label: 'Profile', content: 'Manage Profile', path: '/profile' },
        ],
        lists: [],
        maintenance: [
            { label: 'Setting', content: 'Manage Setting', path: '/setting' },
        ],
    };

    const menu = isAdmin ? adminMenu :
        isVendor ? vendorMenu : isClient ? clientMenu : {};

    const [selectedMenu, setSelectedMenu] = useState(menu.main[0] || { label: 'Home', content: 'Welcome to the Dashboard' });

    const handleMenuClick = (item) => {
        setSelectedMenu(item);
        if (item.path) {
            navigate(item.path);
        }
    };

    return (
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
                    </div>
                )}

                {selectedMenu?.label === 'Users' && (
                    <div className="users-section">
                        <h2>Manage Users</h2>
                        <p>Admin can manage the users here, view details, edit, or remove accounts.</p>

                        {/* Most Active User Bar Chart */}
                        {UsersAnalysis?.mostActiveUser && UsersAnalysis.mostActiveUser.length > 0 ? (
                            <div className="chart-container">
                                <h3>Most Active User</h3>
                                <BarChart width={600} height={300} data={UsersAnalysis.mostActiveUser}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="username" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="activityCount" fill="#73D6BA" />
                                </BarChart>
                                <p>
                                    <strong>{UsersAnalysis.mostActiveUser[0].firstName} {UsersAnalysis.mostActiveUser[0].lastName}</strong><br />
                                    Username: {UsersAnalysis.mostActiveUser[0].username} <br />
                                    Activity Count: {UsersAnalysis.mostActiveUser[0].activityCount}
                                </p>
                            </div>
                        ) : (
                            <p>No active users found.</p>
                        )}

                        {/* Top Product Vendors */}
                        {UsersAnalysis?.topProductVendors && UsersAnalysis.topProductVendors.length > 0 ? (
                            <div className="chart-container">
                                <h3>Top Product Vendor</h3>
                                <BarChart width={600} height={300} data={UsersAnalysis.topProductVendors}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="username" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="totalRevenue" fill="#FFBB28" />
                                </BarChart>
                                <p>
                                    <strong>{UsersAnalysis.topProductVendors[0].firstName} {UsersAnalysis.topProductVendors[0].lastName}</strong><br />
                                    Username: {UsersAnalysis.topProductVendors[0].username} <br />
                                    Total Revenue: {UsersAnalysis.topProductVendors[0].totalRevenue}
                                </p>
                            </div>
                        ) : (
                            <p>No top product vendors found.</p>
                        )}

                        {/* Top Clients by Purchases */}
                        {UsersAnalysis?.topClientsByPurchases && UsersAnalysis.topClientsByPurchases.length > 0 ? (
                            <div className="chart-container">
                                <h3>Top Clients by Purchases</h3>
                                <BarChart width={600} height={300} data={UsersAnalysis.topClientsByPurchases}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="username" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="totalPurchases" fill="#8884d8" />
                                </BarChart>
                                <p>
                                    <strong>{UsersAnalysis.topClientsByPurchases[0].firstName} {UsersAnalysis.topClientsByPurchases[0].lastName}</strong><br />
                                    Username: {UsersAnalysis.topClientsByPurchases[0].username} <br />
                                    Total Purchases: {UsersAnalysis.topClientsByPurchases[0].totalPurchases}
                                </p>
                            </div>
                        ) : (
                            <p>No top clients by purchases found.</p>
                        )}

                        {/* Top Clients by Spending */}
                        {UsersAnalysis?.topClientsBySpending && UsersAnalysis.topClientsBySpending.length > 0 ? (
                            <div className="chart-container">
                                <h3>Top Clients by Spending</h3>
                                <BarChart width={600} height={300} data={UsersAnalysis.topClientsBySpending}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="username" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="totalSpent" fill="#82ca9d" />
                                </BarChart>
                                <p>
                                    <strong>{UsersAnalysis.topClientsBySpending[0].firstName} {UsersAnalysis.topClientsBySpending[0].lastName}</strong><br />
                                    Username: {UsersAnalysis.topClientsBySpending[0].username} <br />
                                    Total Spent: {UsersAnalysis.topClientsBySpending[0].totalSpent}
                                </p>
                            </div>
                        ) : (
                            <p>No top clients by spending found.</p>
                        )}

                        {/* Average Client Spending */}
                        {UsersAnalysis?.averageClientSpending ? (
                            <div className="chart-container">
                                <h3>Average Client Spending</h3>
                                <BarChart width={600} height={300} data={[{ totalSpending: UsersAnalysis.averageClientSpending }]}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="totalSpending" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="totalSpending" fill="#8884d8" />
                                </BarChart>
                                <p>Average Client Spending: {UsersAnalysis.averageClientSpending}</p>
                            </div>
                        ) : (
                            <p>No average client spending data available.</p>
                        )}
                    </div>
                )}

                {selectedMenu?.label === 'Products' && (
                    <div className="products-section">
                        <h2>Manage Products</h2>
                        <p>Vendors and Admins can manage products, add new items, edit existing ones, and track inventory.</p>

                        {/* Check if the data is still loading */}
                        {productsAnalysisLoading ? (
                            <p>Loading product analysis...</p>
                        ) : (
                            <>
                                {/* Most Sold Products */}
                                <div className="chart-container">
                                    <h3>Top 5 Most Sold Products</h3>
                                    {ProductsAnalysis.mostSoldProducts?.length > 0 ? (
                                        <BarChart
                                            width={600}
                                            height={300}
                                            data={ProductsAnalysis.mostSoldProducts.map(product => ({
                                                name: product._id.title,
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
                                    ) : (
                                        <p>No data available for Most Sold Products.</p>
                                    )}
                                </div>

                                {/* Top Revenue-Generating Products */}
                                <div className="chart-container">
                                    <h3>Top 5 Revenue-Generating Products</h3>
                                    {ProductsAnalysis.topRevenueGeneratingProducts?.length > 0 ? (
                                        <BarChart
                                            width={600}
                                            height={300}
                                            data={ProductsAnalysis.topRevenueGeneratingProducts.map(product => ({
                                                name: product._id.title,
                                                totalRevenue: product.totalRevenue,
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
                                    ) : (
                                        <p>No data available for Top Revenue-Generating Products.</p>
                                    )}
                                </div>

                                {/* Most Popular Categories */}
                                <div className="chart-container">
                                    <h3>Top 5 Most Popular Categories</h3>
                                    {ProductsAnalysis.mostPopularCategories?.length > 0 ? (
                                        <PieChart width={400} height={400}>
                                            <Pie
                                                data={ProductsAnalysis.mostPopularCategories.map(category => ({
                                                    name: category.category,
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
                                            <Pie
                                                data={ProductsAnalysis.mostPopularCategories.map(category => ({
                                                    name: category.category,
                                                    value: category.totalProducts,
                                                    percentage: (category.totalProducts / ProductsAnalysis.totalProducts) * 100
                                                }))}
                                                dataKey="percentage"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={120}
                                                fill="#ffca28"
                                                label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                                            />
                                            <Legend
                                                payload={[
                                                    { value: 'High Total Products', type: 'square', color: '#ffc658' },
                                                    { value: 'Lower Total Products', type: 'square', color: '#ffca28' }
                                                ]}
                                            />
                                            <Tooltip formatter={(value, name) => `${name}: ${value} products`} />
                                        </PieChart>
                                    ) : (
                                        <p>No data available for Most Popular Categories.</p>
                                    )}
                                </div>

                                {/* Most Used Tags */}
                                <div className="chart-container">
                                    <h3>Top 5 Most Used Tags</h3>
                                    {ProductsAnalysis.mostUsedTags?.length > 0 ? (
                                        <BarChart
                                            width={600}
                                            height={300}
                                            data={ProductsAnalysis.mostUsedTags.map(tag => ({
                                                name: tag.tag,
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
                                    ) : (
                                        <p>No data available for Most Used Tags.</p>
                                    )}
                                </div>

                                {/* Top Vendors by Sales */}
                                <div className="chart-container">
                                    <h3>Top 5 Vendors by Sales</h3>
                                    {ProductsAnalysis.topVendorsBySales?.length > 0 ? (
                                        <BarChart
                                            width={600}
                                            height={300}
                                            data={ProductsAnalysis.topVendorsBySales.map(vendor => ({
                                                name: vendor._id.username,
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
                                    ) : (
                                        <p>No data available for Top Vendors by Sales.</p>
                                    )}
                                </div>

                                {/* Top Vendors by Products */}
                                <div className="chart-container">
                                    <h3>Top 5 Vendors by Products</h3>
                                    {ProductsAnalysis.topVendorsByProducts?.length > 0 ? (
                                        <BarChart
                                            width={600}
                                            height={300}
                                            data={ProductsAnalysis.topVendorsByProducts.map(vendor => ({
                                                name: vendor._id.username,
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
                                    ) : (
                                        <p>No data available for Top Vendors by Products.</p>
                                    )}
                                </div>

                                {/* Top Spending Customers */}
                                <div className="chart-container">
                                    <h3>Top 5 Spending Customers</h3>
                                    {ProductsAnalysis.topSpendingCustomers?.length > 0 ? (
                                        <BarChart
                                            width={600}
                                            height={300}
                                            data={ProductsAnalysis.topSpendingCustomers.map(customer => ({
                                                name: customer._id.username,
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
                                    ) : (
                                        <p>No data available for Top Spending Customers.</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {selectedMenu?.label === 'Services' && (
                    <div className="products-section">
                        <h2>Manage Products</h2>
                        <p>Vendors and Admins can manage products, add new items, edit existing ones, and track inventory.</p>

                        {/* Check if the data is still loading */}
                        {productsAnalysisLoading ? (
                            <p>Loading product analysis...</p>
                        ) : (
                            <>
                                {/* Most Sold Products */}
                                <div className="chart-container">
                                    <h3>Top 5 Most Sold Products</h3>
                                    {ProductsAnalysis.mostSoldProducts?.length > 0 ? (
                                        <BarChart
                                            width={600}
                                            height={300}
                                            data={ProductsAnalysis.mostSoldProducts.map(product => ({
                                                name: product._id.title,
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
                                    ) : (
                                        <p>No data available for Most Sold Products.</p>
                                    )}
                                </div>

                                {/* Top Revenue-Generating Products */}
                                <div className="chart-container">
                                    <h3>Top 5 Revenue-Generating Products</h3>
                                    {ProductsAnalysis.topRevenueGeneratingProducts?.length > 0 ? (
                                        <BarChart
                                            width={600}
                                            height={300}
                                            data={ProductsAnalysis.topRevenueGeneratingProducts.map(product => ({
                                                name: product._id.title,
                                                totalRevenue: product.totalRevenue,
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
                                    ) : (
                                        <p>No data available for Top Revenue-Generating Products.</p>
                                    )}
                                </div>

                                {/* Most Popular Categories */}
                                <div className="chart-container">
                                    <h3>Top 5 Most Popular Categories</h3>
                                    {ProductsAnalysis.mostPopularCategories?.length > 0 ? (
                                        <PieChart width={400} height={400}>
                                            <Pie
                                                data={ProductsAnalysis.mostPopularCategories.map(category => ({
                                                    name: category.category,
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
                                            <Pie
                                                data={ProductsAnalysis.mostPopularCategories.map(category => ({
                                                    name: category.category,
                                                    value: category.totalProducts,
                                                    percentage: (category.totalProducts / ProductsAnalysis.totalProducts) * 100
                                                }))}
                                                dataKey="percentage"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={120}
                                                fill="#ffca28"
                                                label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                                            />
                                            <Legend
                                                payload={[
                                                    { value: 'High Total Products', type: 'square', color: '#ffc658' },
                                                    { value: 'Lower Total Products', type: 'square', color: '#ffca28' }
                                                ]}
                                            />
                                            <Tooltip formatter={(value, name) => `${name}: ${value} products`} />
                                        </PieChart>
                                    ) : (
                                        <p>No data available for Most Popular Categories.</p>
                                    )}
                                </div>

                                {/* Most Used Tags */}
                                <div className="chart-container">
                                    <h3>Top 5 Most Used Tags</h3>
                                    {ProductsAnalysis.mostUsedTags?.length > 0 ? (
                                        <BarChart
                                            width={600}
                                            height={300}
                                            data={ProductsAnalysis.mostUsedTags.map(tag => ({
                                                name: tag.tag,
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
                                    ) : (
                                        <p>No data available for Most Used Tags.</p>
                                    )}
                                </div>

                                {/* Top Vendors by Sales */}
                                <div className="chart-container">
                                    <h3>Top 5 Vendors by Sales</h3>
                                    {ProductsAnalysis.topVendorsBySales?.length > 0 ? (
                                        <BarChart
                                            width={600}
                                            height={300}
                                            data={ProductsAnalysis.topVendorsBySales.map(vendor => ({
                                                name: vendor._id.username,
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
                                    ) : (
                                        <p>No data available for Top Vendors by Sales.</p>
                                    )}
                                </div>

                                {/* Top Vendors by Products */}
                                <div className="chart-container">
                                    <h3>Top 5 Vendors by Products</h3>
                                    {ProductsAnalysis.topVendorsByProducts?.length > 0 ? (
                                        <BarChart
                                            width={600}
                                            height={300}
                                            data={ProductsAnalysis.topVendorsByProducts.map(vendor => ({
                                                name: vendor._id.username,
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
                                    ) : (
                                        <p>No data available for Top Vendors by Products.</p>
                                    )}
                                </div>

                                {/* Top Spending Customers */}
                                <div className="chart-container">
                                    <h3>Top 5 Spending Customers</h3>
                                    {ProductsAnalysis.topSpendingCustomers?.length > 0 ? (
                                        <BarChart
                                            width={600}
                                            height={300}
                                            data={ProductsAnalysis.topSpendingCustomers.map(customer => ({
                                                name: customer._id.username,
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
                                    ) : (
                                        <p>No data available for Top Spending Customers.</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {selectedMenu?.label === 'Orders' && (
                    <div className="orders-section">
                        <h2>Manage Orders</h2>
                        <p>Admin can view and manage all orders placed by customers, update statuses, and track shipping.</p>
                    </div>
                )}

                {selectedMenu?.label === 'Stock Library' && (
                    <div className="stock-library-section">
                        <h2>Manage Stock Library</h2>
                        <p>Here you can manage and update the stock library, add new items, or remove outdated content.</p>
                    </div>
                )}

                {selectedMenu?.label === 'Sales' && (
                    <div className="sales-section">
                        <h2>View Sales</h2>
                        <p>Here you can view the sales data, analyze performance, and track revenue.</p>
                    </div>
                )}

                {selectedMenu?.label === 'Incomes' && (
                    <div className="incomes-section">
                        <h2>View Incomes</h2>
                        <p>Vendors can check their income reports from the last month or any custom period.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Dashboard;
