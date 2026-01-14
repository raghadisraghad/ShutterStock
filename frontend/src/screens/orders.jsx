import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useGetOrdersByClientQuery } from '../slices/ordersApiSlice';
import FormContainer from '../components/FormContainer';
import './myProducts.css';

const Orders = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: orders, isLoading, error, refetch } = useGetOrdersByClientQuery(userInfo._id);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!hasFetched) {
      refetch();
      setHasFetched(true);
    }
  }, [refetch, hasFetched]);

  const completedOrders = orders?.filter((order) => order.status === 'completed');

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  const getFileUrl = (filePath, vendor) => {
    return `${import.meta.env.VITE_API_BASE_URL}api/pictures/product-images/${vendor}/${filePath.split('/').pop()}`;
  };

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li>
            <Link to="/" className="breadcrumb-item">Home</Link>
          </li>
          <li className="breadcrumb-separator"> &gt; </li>
          <li>
            <Link to="/orders" className="breadcrumb-item">My Orders</Link>
          </li>
          <li className="breadcrumb-separator"> &gt; </li>
        </ol>
      </nav>

      <h1 className="page-header">Completed Orders</h1>

      <div className="profile-section">
        <FormContainer>
          {isLoading ? (
            <p>Loading orders...</p>
          ) : error ? (
            <p>Error loading orders.</p>
          ) : Array.isArray(completedOrders) && completedOrders.length > 0 ? (
            <div className="orders-grid">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Order Number</th>
                    <th>Title</th>
                    {userInfo.role !== '1' && <th>Client</th>}
                    <th>Product</th>
                    <th>Total</th>
                    <th>Date Created</th>
                    <th>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {completedOrders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td>
                        {order.product.length > 0 && order.product[0].title}
                        {order.video.length > 0 && order.video[0].title}
                        {order.audio.length > 0 && order.audio[0].title}
                      </td>
                      {userInfo.role !== '1' && <td>{order.client.username}</td>}
                      <td>
                        {order.product.length > 0 && (
                          <img
                            src={getFileUrl(order.product[0].picture, order.product[0].vendor)}
                            alt={order.product[0]?.title}
                            className="image-thumbnail"
                            onContextMenu={(e) => e.preventDefault()}
                          />
                        )}
                        {order.video.length > 0 && (
                          <img
                            src={getFileUrl(order.video[0].picture, order.video[0].vendor)}
                            alt={order.video[0]?.title}
                            className="image-thumbnail"
                            onContextMenu={(e) => e.preventDefault()}
                          />
                        )}
                        {order.audio.length > 0 && (
                          <img
                            src={getFileUrl(order.audio[0].picture, order.audio[0].vendor)}
                            alt={order.audio[0]?.title}
                            className="image-thumbnail"
                            onContextMenu={(e) => e.preventDefault()}
                          />
                        )}
                      </td>
                      <td>{order.total} DH</td>
                      <td>{new Date(order.dateCreated).toLocaleDateString()}</td>
                      <td>
                        {order.product.length > 0 && (
                          <button
                            onClick={() => {
                              const pictureFile = order.product[0].picture?.split(/[\\/]/).pop();
                              const extension = pictureFile?.split('.').pop();
                              const fileName = `${order.product[0].title}.${extension}`;
                              handleDownload(
                                getFileUrl(order.product[0].picture, 'product', order.product[0].vendor),
                                fileName
                              );
                            }}
                            className="btn-download"
                          >
                            Download Image
                          </button>
                        )}
                        {order.video.length > 0 && (
                          <button
                            onClick={() => {
                              const videoFile = order.video[0].video?.split(/[\\/]/).pop();
                              const extension = videoFile?.split('.').pop();
                              const fileName = `${order.video[0].title}.${extension}`;
                              handleDownload(
                                `${import.meta.env.VITE_API_BASE_URL}api/pictures/product-videos/${order.video[0].vendor}/${videoFile}`,
                                fileName
                              );
                            }}
                            className="btn-download"
                          >
                            Download Video
                          </button>
                        )}
                        {order.audio.length > 0 && (
                          <button
                            onClick={() => {
                              const audioFile = order.audio[0].audio?.split(/[\\/]/).pop();
                              const extension = audioFile?.split('.').pop();
                              const fileName = `${order.audio[0].title}.${extension}`;
                              handleDownload(
                                `${import.meta.env.VITE_API_BASE_URL}api/pictures/product-audios/${order.audio[0].vendor}/${audioFile}`,
                                fileName
                              );
                            }}
                            className="download-btn"
                          >
                            <i className="fa fa-download"></i> Download Image
                            </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No completed orders available</p>
          )}
        </FormContainer>
      </div>
    </>
  );
};

export default Orders;
