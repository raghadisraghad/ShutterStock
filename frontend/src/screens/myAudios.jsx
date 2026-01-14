import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col, Nav, Dropdown } from 'react-bootstrap';
import { skipToken } from '@reduxjs/toolkit/query/react';

import { useAddAudioMutation, useArchiveAudioMutation, useDeleteAudioMutation, useGetAudiosByVendorQuery } from '../slices/audioApiSlice';
import { useGetCategoriesQuery } from '../slices/categoriesApiSlice';
import { useGetTagsByCategoryQuery } from '../slices/tagApiSlice';
import { useUploadProductImageMutation, useUploadProductAudioMutation } from '../slices/imageApiSlice';
import './myProducts.css';
import { FaTrashAlt, FaEdit, FaArchive, FaPlusCircle } from 'react-icons/fa';
import { MdRemoveCircleOutline } from 'react-icons/md'; // For the remove tag button
import { BsFillImageFill } from 'react-icons/bs'; // For the image upload button


const myAudios = () => {

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
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [city, setCity] = useState(null);

  const [addProduct, { isLoading }] = useAddAudioMutation();
  const [deleteProduct, { isLoading: deleteLoading }] = useDeleteAudioMutation();
  const [archiveProduct, { isLoading: archiveLoading }] = useArchiveAudioMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const [uploadProductImages] = useUploadProductImageMutation();
  const [uploadProductAudio] = useUploadProductAudioMutation();
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const { data: products, isLoading: productsLoading, error: productError, refetch: refreshProducts } = useGetAudiosByVendorQuery(userInfo._id);
  const { data: tagsData, isLoading: tagsLoading } = useGetTagsByCategoryQuery(category ? { category } : skipToken);

  useEffect(() => {
    if (category) {
      setTagsList(tagsData);
    }
  }, [category, tagsData]);

  const cancelHandle = () => {
    setTitle('');
    setPrice('');
    setCategory('');
    setTags([]);
    setImage('');
    setCity('');
    setAudio('');
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
      const isConfirmed = window.confirm('Are you sure you want to delete this Audio?');

      if (!isConfirmed) return;
      await deleteProduct({ id }).unwrap();
      toast.success('Audio Deleted successfully!', { autoClose: 1000, });
      refreshProducts();
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'An error occurred', { autoClose: 1000, });
    }
  }

  const handleArchive = async (id) => {
    try {
      const isConfirmed = window.confirm('Are you sure you want to archive this Audio?');

      if (!isConfirmed) return;
      await archiveProduct({ id }).unwrap();
      toast.success('Audio Archived successfully!', { autoClose: 1000, });
      refreshProducts();
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'An error occurred', { autoClose: 1000, });
    }
  }

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
      let imageUrl = image;
      let audioUrl = audio;
      if (image instanceof File) {
        try {
          const imageFormData = new FormData();
          imageFormData.append('picture', image);
          const uploadResponse = await uploadProductImages({ id: userInfo._id, formData: imageFormData }).unwrap();
          imageUrl = uploadResponse.imageUrl;
          toast.success('Please wait while we upload the audio!');
        } catch (err) {
          toast.error(err?.data?.message || err.error || 'An error occurred', { autoClose: 1000, });
          return; // Stop further execution without displaying error
        }
      }

      if (audio instanceof File) {
        const AudioFormData = new FormData();
        AudioFormData.append('audio', audio);
        const AudioResponse = await uploadProductAudio({ id: userInfo._id, formData: AudioFormData }).unwrap();
        audioUrl = AudioResponse.audioUrl;
      } else {
        toast.error(err?.data?.message || err.error || 'An error occurred', { autoClose: 1000, });
        return
      }

      const AudioData = {
        title,
        price: parseFloat(price),
        picture: imageUrl,
        audio: audioUrl,
        city,
        vendor: userInfo._id,
        tags: tags.map((tag) => tag._id),
        category,
      };
      console.log("audioData", AudioData);
      await addProduct({ AudioData }).unwrap();
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
      <h1 className="page-header">
        {activeSection === 'addProduct' ? 'Add Audio' : 'My Audios'}
      </h1>

      <div className="profile-section">
        <div className="form-content-wrapper">
          <div className="form-container">
            <div className="form-header">
              {activeSection === 'addProduct' && (
                <Form onSubmit={handleAddProduct}>
                  <button className="btn-close-popup" onClick={() => { setActiveSection('product'); cancelHandle(); setShowPopup(false); }}>
                    <i className="fas fa-times-circle"></i>
                  </button>

                  <Row className="form-row">
                    <Col className="col-6">
                      <Form.Group controlId="title" className="form-group">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="form-row">
                    <Col className="col-6">
                      <Form.Group controlId="category" className="form-group">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                          as="select"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          required
                        >
                          <option value="">Select a category</option>
                          {!categoriesLoading &&
                            categories?.map((cat) => (
                              <option key={cat._id} value={cat._id}>
                                {cat.name}
                              </option>
                            ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>

                    <Col className="col-6">
                      <Form.Group controlId="tags" className="form-group">
                        <Form.Label>Tags</Form.Label>
                        <div className="tag-selector">
                          {tagsLoading ? (
                            <p>Loading tags...</p>
                          ) : (
                            <Dropdown className="tag-dropdown">
                              <Dropdown.Toggle variant="outline-primary">
                                Select a Tag
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {tagsList?.filter((tag) => !tags.includes(tag)).map((tag) => (
                                  <Dropdown.Item key={tag._id} onClick={() => handleAddTag(tag)}>
                                    {tag.name}
                                  </Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          )}
                        </div>
                        <div className="selected-tags">
                          {tags.map((tag) => (
                            <div key={tag._id} className="tag-chip">
                              #{tag.name}{' '}
                              <button onClick={() => handleRemoveTag(tag)} className="tag-remove-btn">
                                X
                              </button>
                            </div>
                          ))}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="form-row">
                    <Col className="col-6">
                      <Form.Group controlId="image" className="form-group">
                        <Form.Label>Image Cover</Form.Label>
                        <Form.Control type="file" onChange={handleImageUpload} required />
                      </Form.Group>

                      <div className="image-gallery">
                        {image ? (
                          <div className="image-item">
                            <img
                              src={URL.createObjectURL(image)}
                              alt="Uploaded"
                              className="thumbnail"
                            />
                            <Button variant="danger" size="sm" onClick={() => setImage(null)}>
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <p>No image uploaded yet.</p>
                        )}
                      </div>
                    </Col>

                    <Col className="col-6">
                      <Form.Group controlId="audio" className="form-group">
                        <Form.Label>Audio</Form.Label>
                        <Form.Control
                          type="file"
                          accept="audio/*"
                          onChange={(e) => setAudio(e.target.files[0])}
                          required
                        />
                      </Form.Group>

                      <div className="audio-preview">
                        {audio ? (
                          <div className="audio-item">
                            <audio controls>
                              <source src={URL.createObjectURL(audio)} type={audio.type} />
                              Your browser does not support the audio tag.
                            </audio>
                            <Button variant="danger" size="sm" onClick={() => setAudio(null)}>
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <p>No Audio uploaded yet.</p>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <Row className="form-row">
                    <Col className="col-6">
                      <Form.Group controlId="price" className="form-group">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col className="col-6">
                      <Form.Group controlId="city" className="form-group">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          as="select"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                        >
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

                  <div className="form-action-buttons">
                    <Button type="submit" variant="primary" disabled={isLoading}>
                      {isLoading ? 'Adding...' : 'Add Audio'}
                    </Button>
                  </div>
                </Form>
              )}

              {activeSection === 'product' && (
                <div className="product-list">
                  <button
                    onClick={() => {
                      setActiveSection('addProduct');
                      cancelHandle();
                    }}
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
                          <th>Audio</th>
                          <th>Price</th>
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
                            <td>
                              {product.title}
                              <img
                                src={`${import.meta.env.VITE_API_BASE_URL}api/pictures/product-images/${userInfo._id}/${product.picture?.split(/[\\/]/).pop() || ''}`}
                                alt={product.title}
                                className="product-thumbnail"
                              />
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <audio controls>
                                  <source
                                    src={`${import.meta.env.VITE_API_BASE_URL}api/pictures/product-audios/${userInfo._id}/${product.audio?.split('/').pop()}`}
                                    type="audio/mp3"
                                  />
                                  <source
                                    src={`${import.meta.env.VITE_API_BASE_URL}api/pictures/product-audios/${userInfo._id}/${product.audio?.split('/').pop()}`}
                                    type="audio/ogg"
                                  />
                                  <source
                                    src={`${import.meta.env.VITE_API_BASE_URL}api/pictures/product-audios/${userInfo._id}/${product.audio?.split('/').pop()}`}
                                    type="audio/mp4"
                                  />
                                  <source
                                    src={`${import.meta.env.VITE_API_BASE_URL}api/pictures/product-audios/${userInfo._id}/${product.audio?.split('/').pop()}`}
                                    type="audio/mpeg"
                                  />
                                </audio>
                              </div>
                            </td>
                            <td>{product.price} DH</td>
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
                              <button onClick={() => handleDelete(product._id)} className="btn-delete">
                                <FaTrashAlt />
                              </button>
                              <button onClick={() => handleArchive(product._id)} className="btn-archive">
                                <FaArchive style={{ color: product.archive ? 'green' : 'inherit' }} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>Add Your First Audio..</p>
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

export default myAudios;
