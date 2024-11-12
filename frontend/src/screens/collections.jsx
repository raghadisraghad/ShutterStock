import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { useAddProductMutation, useGetProductsQuery, useGetServicesQuery } from '../slices/productApiSlice';
import { useGetCategoriesQuery } from '../slices/categoriesApiSlice';
import { useUploadProductImageMutation } from '../slices/imageApiSlice';

const Collections = () => {
  const [activeSection, setActiveSection] = useState('collections');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('product');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [imageList, setImageList] = useState([]);

  const [addProduct, { isLoading }] = useAddProductMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const [uploadProductImages] = useUploadProductImageMutation();
  const { data: products, isLoading: productsLoading, error: productError } = useGetProductsQuery();
  const { data: services, isLoading: servicesLoading, error: serviceError } = useGetServicesQuery();
  const navigate = useNavigate();

  if (categoriesLoading) {
    return <div>Loading categories...</div>;
  }

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const uploadedImages = Array.from(files).map(file => URL.createObjectURL(file));

      setImageList((prevImages) => [...prevImages, ...uploadedImages]);
    }
  };

  const removeImage = (imageUrl) => {
    setImageList(imageList.filter((img) => img !== imageUrl));
  };

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    let list = [];
    if (imageList) {
      imageList.forEach(async (file) => {
        if (file instanceof File) {
          const formData = new FormData();
          formData.append('avatar', avatar);
          formData.append('userId', userInfo._id);
          const uploadResponse = await uploadProductImages(formData).unwrap();
          list.push(uploadResponse.imageUrl);
        }
      });
    }

    const productData = {
      title,
      description,
      type,
      price: Number(price),
      Image: list,
      vendor: userInfo._id,
      tags,
      category,
    };

    try {
      await addProduct(productData);
      navigate('/collections');
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  return (
    <>
      <Button onClick={() => navigate('/profile')} className="button-custom">Back</Button>
      <h1>Collections</h1>
      <div className="profile-container">
        <div className="sidebar">
          <h5>Settings</h5>
          <Nav className="flex-column">
            <Nav.Link onClick={() => setActiveSection('addProduct')} active={activeSection === 'addProduct'}>
              Add Product/Service
            </Nav.Link>
            <Nav.Link onClick={() => setActiveSection('product')} active={activeSection === 'product'}>
              List Products
            </Nav.Link>
            <Nav.Link onClick={() => setActiveSection('service')} active={activeSection === 'service'}>
              List Services
            </Nav.Link>
          </Nav>
        </div>

        <div className="form-content">
          <div className="custom-form-container">
            <FormContainer>
              <div className="profileHeader">
                {activeSection === 'addProduct' && (
                  <Form onSubmit={handleAddProduct}>
                    <Form.Group controlId="title">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="description">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="type">
                      <Form.Label>Type</Form.Label>
                      <Form.Control as="select" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="product">Product</option>
                        <option value="service">Service</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="price">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </Form.Group>

                    {/* Category Selection */}
                    <Form.Group controlId="category">
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

                    {/* Tags Input */}
                    <Form.Group controlId="tags">
                      <Form.Label>Tags</Form.Label>
                      <div className="tag-input-container">
                        <Form.Control
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                          placeholder="Enter tag and press enter"
                        />
                        <Button
                          type="button"
                          variant="outline-primary"
                          onClick={handleAddTag}
                          disabled={!tagInput}
                        >
                          Add Tag
                        </Button>
                      </div>
                      {/* Display added tags */}
                      <div className="tags-list">
                        {tags.map((tag, index) => (
                          <span key={index} className="tag-item">
                            #{tag} <Button variant="link" onClick={() => handleRemoveTag(tag)}>X</Button>
                          </span>
                        ))}
                      </div>
                    </Form.Group>

                    {/* Image Upload */}
                    <Form.Group controlId="image">
                      <Form.Label>Images</Form.Label>
                      <Form.Control
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </Form.Group>

                    <div className="image-gallery">
                      {imageList.length > 0 ? (
                        <Row>
                          {imageList.map((imgUrl, index) => (
                            <Col key={index} xs={6} sm={4} md={3}>
                              <div className="image-item">
                                <img src={imgUrl} alt={`uploaded-${index}`} className="thumbnail" />
                                <Button variant="danger" size="sm" onClick={() => removeImage(imgUrl)}>
                                  X
                                </Button>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      ) : (
                        <p>No images uploaded yet.</p>
                      )}
                    </div>


                    <Button type="submit" variant="primary" disabled={isLoading}>
                      {isLoading ? 'Adding...' : 'Add Product/Service'}
                    </Button>
                  </Form>
                )}

                {activeSection === 'product' && (
                  <>
                    <div className="list">
                      {isLoading ? (
                        <p>Loading products...</p>
                      ) : productError ? (
                        <p>Error loading products.</p>
                      ) : products && products.length > 0 ? (
                        products.map((product) => (
                          <div key={product._id} className="item">
                            <h3>{product.title}</h3>
                            <p>{product.description}</p>
                            <p>Type : {product.type}</p>
                            <p>Gallery:</p>
                            <ul>
                              {product.Image && product.Image.map((image, index) => ( <li key={index}><img src="image" alt="image" /></li> ))}
                            </ul>
                            <p>Tags:</p>
                            <ul>
                              {product.tag && product.tag.map((tag, index) => ( <li key={index}>{tag}</li> ))}
                            </ul>
                            <p>Category : {product.category.name}</p>
                            <p>Created the : {product.dateCreated}</p>
                            <p>Price: {product.price} DH</p>
                          </div>
                        ))
                      ) : (
                        <p>No products available</p>
                      )}
                    </div>
                  </>
                )}

                {activeSection === 'service' && (
                  <>
                    <div className="list">
                      {isLoading ? (
                        <p>Loading services...</p>
                      ) : serviceError ? (
                        <p>Error loading services.</p>
                      ) : services && services.length > 0 ? (
                        services.map((service) => (
                          <div key={service._id} className="item">
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                            <p>Type : {service.type}</p>
                            <p>Gallery:</p>
                            <ul>
                              {service.Image && service.Image.map((image, index) => ( <li key={index}><img src="image" alt="image" /></li> ))}
                            </ul>
                            <p>Tags:</p>
                            <ul>
                              {service.tag && service.tag.map((tag, index) => ( <li key={index}>{tag}</li> ))}
                            </ul>
                            <p>Category : {service.category.name}</p>
                            <p>Created the : {service.dateCreated}</p>
                            <p>Price: {service.price} DH</p>
                          </div>
                        ))
                      ) : (
                        <p>No services available</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </FormContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Collections;
