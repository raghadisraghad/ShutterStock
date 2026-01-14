import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Nav, Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query/react';

import { useAddVideoMutation, useArchiveVideoMutation, useDeleteVideoMutation, useGetVideosByVendorQuery, useUpdateVideoMutation } from '../slices/videoApiSlice';
import { useGetCategoriesQuery } from '../slices/categoriesApiSlice';
import { useGetTagsByCategoryQuery } from '../slices/tagApiSlice';
import { useUploadProductImageMutation, useUploadProductVideoMutation } from '../slices/imageApiSlice';
import FormContainer from '../components/FormContainer';
import { FaTrashAlt, FaEdit, FaArchive, FaPlusCircle } from 'react-icons/fa';
import { MdRemoveCircleOutline } from 'react-icons/md'; // For the remove tag button
import { BsFillImageFill } from 'react-icons/bs'; // For the image upload button
import './myProducts.css';



const myVideos = () => {

  const cities = [
    'Agadir', 'Al Hoceima', 'Azrou', 'Beni Mellal', 'Berkane', 'Casablanca', 'Chefchaouen', 'El Jadida',
    'Fes', 'Guelmim', 'Ifrane', 'Kenitra', 'Khemisset', 'Marrakech', 'Meknes', 'Nador', 'Oujda',
    'Rabat', 'Sale', 'Tanger', 'Tetouan', 'Taza', 'Taroudant', 'Essaouira', 'Safi', 'Settat',
    'Khouribga', 'El Kelaa des Sraghna', 'Marrakech', 'Tétouan', 'Tiznit', 'Ouarzazate', 'Errachidia',
    'Midelt', 'Benslimane', 'Azilal', 'Tinghir', 'Al Hoceima', 'Sidi Kacem', 'Sidi Ifni',
    'Boujdour', 'Oued Zem', 'Imintanoute', 'Safi', 'Laayoune', 'Tarfaya', 'Taroudant', 'Nador'
  ];

  const [activeSection, setActiveSection] = useState('product');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [city, setCity] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const [addProduct, { isLoading }] = useAddVideoMutation();
  const [updateProduct, { isLoading: updateLoading }] = useUpdateVideoMutation();
  const [deleteProduct, { isLoading: deleteLoading }] = useDeleteVideoMutation();
  const [archiveProduct, { isLoading: archiveLoading }] = useArchiveVideoMutation();
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const [uploadProductImages] = useUploadProductImageMutation();
  const [uploadProductVideo] = useUploadProductVideoMutation();
  const { data: products, isLoading: productsLoading, error: productError, refetch: refreshProducts } = useGetVideosByVendorQuery(userInfo._id);
  const { data: tagsData, isLoading: tagsLoading } = useGetTagsByCategoryQuery(category ? { category } : skipToken);
  const [showPopup, setShowPopup] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (category) {
      setTagsList(tagsData);
    }
  }, [category, tagsData]);

  const handleUpdate = (model) => {
    setEditProduct(model);
    setTitle(model.title);
    setDescription(model.description);
    setCity(model.city);
    setPrice(model.price);
    setCategory(model.category._id);
    setTags(model.tags);
    setCity(model.city);
    setImage(model.Image);
    setVideo(model.video);
  };

  const cancelHandle = () => {
    setEditProduct('');
    setTitle('');
    setDescription('');
    setPrice('');
    setCategory('');
    setTags([]);
    setImage('');
    setCity('');
    setVideo('');
    setShowPopup(false);
  }

  if (categoriesLoading) {
    return <div>Loading categories...</div>;
  }

  const handleAddTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleDelete = async (id) => {
    try {
      const isConfirmed = window.confirm('Are you sure you want to delete this Video?');

      if (!isConfirmed) return;
      await deleteProduct({ id }).unwrap();
      toast.success('Video Deleted successfully!', { autoClose: 1000, });
      refreshProducts();
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'An error occurred', { autoClose: 1000, });
    }
  }

  const handleArchive = async (id) => {
    try {
      const isConfirmed = window.confirm('Are you sure you want to archive this Video?');

      if (!isConfirmed) return;
      await archiveProduct({ id }).unwrap();
      toast.success('Video Archived successfully!', { autoClose: 1000, });
      refreshProducts();
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'An error occurred', { autoClose: 1000, });
    }
  }

  const handleUpdateProduct = async (productId, e) => {
    e.preventDefault();

    try {
      const data = {
        title,
        description,
        price: parseFloat(price),
        city,
        category,
        tags: tags.map((tag) => tag._id),
        picture: "",
        video,
      };

      await updateProduct({ id: productId, ...data }).unwrap();
      toast.success('Video updated successfully!', { autoClose: 1000, });
      setEditProduct(null);
      setShowPopup(null);
      refreshProducts();
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'An error occurred', { autoClose: 1000, });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (isLoadingUpdate) return;

    setIsLoadingUpdate(true);

    try {
      toast.success('Please wait while we upload the video!');
      let videoUrl = video;
      let imageUrl = image;

      if (image instanceof File) {
        const imageFormData = new FormData();
        imageFormData.append('picture', image);
        const uploadResponse = await uploadProductImages({ id: userInfo._id, formData: imageFormData }).unwrap();
        imageUrl = uploadResponse.imageUrl;
      } else {
        toast.error(err?.data?.message || err.error || 'An error occurred', { autoClose: 1000, });
        return
      }

      if (video instanceof File) {
        try {
          const videoFormData = new FormData();
          videoFormData.append('video', video);
          const videoResponse = await uploadProductVideo({ id: userInfo._id, formData: videoFormData }).unwrap();
          videoUrl = videoResponse.videoUrl;
          toast.success('Please wait while we upload the video!');
        } catch (err) {
          toast.error(err?.data?.message || err.error || 'An error occurred', { autoClose: 1000, });
          return;
        }
      }

      const VideoData = {
        title,
        description,
        price: parseFloat(price),
        picture: imageUrl,
        video: videoUrl,
        city,
        vendor: userInfo._id,
        tags: tags.map((tag) => tag._id),
        category,
      };
      await addProduct({ VideoData }).unwrap();
      toast.success('Image Added successfully!', { autoClose: 1000, });
      refreshProducts();
      setActiveSection('product');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'An error occurred', { autoClose: 1000, });
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  return (
    <>
      <div className="profile-section">
        <h1 className="page-header">
          {activeSection === 'addProduct' ? 'Add Video' : 'My Videos'}
        </h1>
        <div className="profile-container"></div>

        {activeSection === 'product' && (
          <>
            <div className={`overlay-background ${showPopup ? 'active' : ''}`} onClick={() => setShowPopup(false)}></div>
            <div className={`popup-container ${showPopup ? 'active' : ''}`}>
              {editProduct ? (
                <Form onSubmit={(e) => { if (editProduct) handleUpdateProduct(editProduct._id, e); }}>
                  <button className="btn-close-popup" onClick={() => { cancelHandle(); setShowPopup(false); }}>
                    <i className="fas fa-times-circle"></i>
                  </button>
                  <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                  </Form.Group>
                  <Form.Group controlId="price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="number" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                  </Form.Group>
                  <Form.Group controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Control as="select" value={category} onChange={(e) => { setCategory(e.target.value); setTags([]); }} required >
                      <option value="">Select a category</option>
                      {!categoriesLoading && categories?.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="tags">
                    <Form.Label>Tags</Form.Label>
                    <div className="tag-input-container">
                      {tagsLoading ? (
                        <p>Loading tags...</p>
                      ) : (
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-primary">
                            {'Select a Tag'}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {tagsList?.filter(tag => !tags.includes(tag)).map((tag) => (
                              <Dropdown.Item key={tag._id} onClick={() => handleAddTag(tag)}>
                                {tag.name}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                    <div className="tags-list">
                      {tags.map((tag) => (
                        <div className='tag-item' key={tag._id}>
                          <div className="tag-chip">
                            #{tag.name} <button className="tag-remove-btn" onClick={() => handleRemoveTag(tag)}><i className="fas fa-times-circle"></i></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Form.Group>
                  <Button type="submit" variant="primary" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update'}
                  </Button>
                </Form>
              ) : (
                <p>No item selected for editing</p>
              )}
            </div>
          </>
        )}

        <div className="form-content">
          <div className="custom-form-container">
            <div className="profileHeader">
              {activeSection === 'addProduct' && (
                <Form onSubmit={handleAddProduct}>
                  <button className="btn-close-popup" onClick={() => { setActiveSection('product'); cancelHandle(); setShowPopup(false); }}>
                    <i className="fas fa-times-circle"></i>
                  </button>

                  <Row className="mt-4">
                    <Col sm={6}>
                      <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col sm={6}>
                      <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col sm={6}>
                      <Form.Group controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Control as="select" value={category} onChange={(e) => { setCategory(e.target.value) }} required >
                          <option value="">Select a category</option>
                          {!categoriesLoading && categories?.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>

                    <Col sm={6}>
                      <Form.Group controlId="tags" className="tag-input-container">
                        <Form.Label>Tags</Form.Label>
                        <div>
                          {tagsLoading ? (
                            <p>Loading tags...</p>
                          ) : (
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-primary">
                                {'Select a Tag'}
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {tagsList?.filter(tag => !tags.includes(tag)).map((tag) => (
                                  <Dropdown.Item key={tag._id} onClick={() => handleAddTag(tag)}>
                                    {tag.name}
                                  </Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          )}
                        </div>
                        <div className="tags-list">
                          {tags.map((tag) => (
                            <div className='tag-item' key={tag._id}>
                              <div className="tag-chip">
                                #{tag.name} <button className="tag-remove-btn" onClick={() => handleRemoveTag(tag)}><i className="fas fa-times-circle"></i></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col sm={6}>
                      <Form.Group controlId="video">
                        <Form.Label>Video</Form.Label>
                        <Form.Control type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} required />
                      </Form.Group>

                      <div className="video-preview">
                        {video ? (
                          <div>
                            <video controls width="250">
                              <source src={URL.createObjectURL(video)} type={video.type} />
                              Your browser does not support the video tag.
                            </video>
                            <Button variant="danger" size="sm" onClick={() => setVideo(null)}>
                              <i className="fas fa-trash"></i> Remove
                            </Button>
                          </div>
                        ) : (
                          <p>No video uploaded yet.</p>
                        )}
                      </div>
                    </Col>
                    <Col sm={6}>

                      <Form.Group controlId="image" className="form-group">
                        <Form.Label>Video Cover</Form.Label>
                        <Form.Control type="file" onChange={handleImageUpload} required />
                        <div className="image-preview">
                          {image ? (
                            <div className="image-item">
                              <img src={URL.createObjectURL(image)} alt="Uploaded" className="image-thumbnail" />
                              <button onClick={() => setImage(null)} className="btn-remove-image"><FaTrashAlt /></button>
                            </div>
                          ) : (
                            <p>No image uploaded yet.</p>
                          )}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col sm={6}>
                      <Form.Group controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col sm={6}>
                      <Form.Group controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control as="select" value={city} onChange={(e) => setCity(e.target.value)} required>
                          <option value="">Select a city</option>
                          {cities.map((cityName, index) => (
                            <option key={index} value={cityName}>
                              {cityName}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className='center'>
                    <Button type="submit" variant="primary" disabled={isLoading}>
                      {isLoadingUpdate ? 'Adding...' : 'Add Video'}
                    </Button>
                  </div>
                </Form>
              )}

              {activeSection === 'product' && (
                <div className="list">
                  <button
                    onClick={() => { setActiveSection('addProduct'); cancelHandle(); }}
                    className="btn-add-product"
                  >
                    <FaPlusCircle />
                  </button>
                  {isLoading ? (
                    <p>Loading products...</p>
                  ) : productError ? (
                    <p>Error loading products.</p>
                  ) : products && products.length > 0 ? (
                    <table className="product-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Video</th>
                          <th>Description</th>
                          <th>Price(DH)</th>
                          <th>Region</th>
                          <th>Category</th>
                          <th>Tags</th>
                          <th>Status</th>
                          <th>Created Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product._id}>
                            <td>{product.title}</td>
                            <td>
                              <img src={`${import.meta.env.VITE_API_BASE_URL}api/pictures/product-images/${userInfo._id}/${product.picture.split('/').pop()}`} alt={product.title} className="product-thumbnail" />
                            </td>
                            <td>
                              <i className="fas fa-video"></i>
                            </td>
                            <td>{product.description}</td>
                            <td>{product.price}</td>
                            <td>
                              <Link to={`/images/${product.city}/region`} className="region-link">{product.city}</Link>
                            </td>
                            <td>
                              <Link to={`/images/${product.category.name}/category`} className="category-link">{product.category?.name}</Link>
                            </td>
                            <td>
                              <div className="tags-list">
                                {product.tags.map(tag => (
                                  <Link key={tag._id} to={`/images/${tag.name}/tag`} className="tag-link">
                                    #{tag.name}
                                  </Link>
                                ))}
                              </div>
                            </td>
                            <td>{product.archive ? 'Archived' : 'Active'}</td>
                            <td>{new Date(product.dateCreated).toLocaleDateString()}</td>
                            <td>
                              <button onClick={() => handleDelete(product._id)} className="btn-delete"><FaTrashAlt /></button>
                              <button onClick={() => { setShowPopup(true); handleUpdate(product); }} className="btn-update"><FaEdit /></button>
                              <button onClick={() => handleArchive(product._id)} className="btn-archive">
                                <FaArchive style={{ color: product.archive ? 'green' : 'inherit' }} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>Add Your First Video..</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default myVideos;
