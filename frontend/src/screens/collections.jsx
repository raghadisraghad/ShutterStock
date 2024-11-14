import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Row, Col, Nav, Dropdown } from 'react-bootstrap';
import { redirect, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation, useGetProductsByVendorQuery, useGetServicesByVendorQuery } from '../slices/productApiSlice';
import { useGetCategoriesQuery } from '../slices/categoriesApiSlice';
import { useGetTagsByCategoryQuery } from '../slices/tagApiSlice';
import { useUploadProductImageMutation } from '../slices/imageApiSlice';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';

const Collections = () => {
  const [activeSection, setActiveSection] = useState('collections');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('product');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  const [addProduct, { isLoading }] = useAddProductMutation();
  const [updateProduct, { isLoading: updateLoading }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: deleteLoading }] = useDeleteProductMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const [uploadProductImages] = useUploadProductImageMutation();
  const { data: products, isLoading: productsLoading, error: productError } = useGetProductsByVendorQuery(userInfo._id);
  const { data: services, isLoading: servicesLoading, error: serviceError } = useGetServicesByVendorQuery(userInfo._id);
  const { data: tagsData, isLoading: tagsLoading } = useGetTagsByCategoryQuery(category ? { category } : skipToken);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (category) {
      setTagsList(tagsData);
    }
  }, [category, tagsData]);

  const handleUpdate = (model) => {
    console.log("tags", model.tags);
    setEditProduct(model);
    setTitle(model.title);
    setDescription(model.description);
    setPrice(model.price);
    setCategory(model.category._id);
    setTags(model.tags);
    setImageList(model.Image);
  };

  const cancelHandle = () => {
    setEditProduct('');
    setTitle('');
    setDescription('');
    setPrice('');
    setCategory('');
    setTags([]);
    setImageList('');
  }

  if (categoriesLoading) {
    return <div>Loading categories...</div>;
  }

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const uploadedImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImageList(prevImages => {
        const newImageList = [...prevImages, ...uploadedImages];
        console.log("imageList", imageList);
        return newImageList;
      });
    }
  };

  const removeImage = (imageUrl) => {
    setImageList(imageList.filter((img) => img !== imageUrl));
  };

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
      const isConfirmed = window.confirm('Are you sure you want to delete this product?');

      if (!isConfirmed) return;
      console.log(id);
      await deleteProduct({ id }).unwrap();
      toast.success('Product Deleted successfully!', { autoClose: 1000, });
      window.location.reload();
      navigate('/collections');
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
        category,
        tags: tags.map((tag) => tag._id),
        Image: imageList,
      };

      await updateProduct({ id: productId, ...data }).unwrap();
      toast.success('Product updated successfully!', { autoClose: 1000, });
      setEditProduct(null);
      navigate('/collections');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'An error occurred', { autoClose: 1000, });
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      let list = [];
      // if (imageList && imageList.length > 0) {
      //   const formData = new FormData();
      //   imageList.forEach((file) => {
      //     console.log("File being uploaded:", file);
      //     if (file instanceof File) {
      //       formData.append('pictures', file);
      //     }
      //   });

      //   try {
      //     const uploadResponse = await uploadProductImages({ id: userInfo._id, formData }).unwrap();
      //     list.push(...uploadResponse.imageUrls);
      //   } catch (err) {
      //     console.error("Error uploading images:", err);
      //   }
      // }

      const productData = {
        title,
        description,
        type,
        price: parseFloat(price),
        Image: list.length > 0 ? list : [],
        vendor: userInfo._id,
        tags: tags.map((tag) => tag._id),
        category,
      };

      await addProduct({ productData }).unwrap();
      toast.success('Product Added successfully!', { autoClose: 1000, });
      navigate('/collections');
      window.location.reload();
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'An error occurred', { autoClose: 1000, });
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
            <Nav.Link onClick={() => { setActiveSection('addProduct'); cancelHandle(); }} active={activeSection === 'addProduct'}>
              Add Product/Service
            </Nav.Link>
            <Nav.Link onClick={() => { setActiveSection('product'); cancelHandle(); }} active={activeSection === 'product'}>
              List Products
            </Nav.Link>
            <Nav.Link onClick={() => { setActiveSection('service'); cancelHandle(); }} active={activeSection === 'service'}>
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
                      <div className="d-flex">
                        <Form.Check type="radio" id="product" label="Product" name="type" checked={type === 'product'} onChange={() => setType('product')} />
                        <Form.Check type="radio" id="service" label="Service" name="type" checked={type === 'service'} onChange={() => setType('service')} />
                      </div>
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
                        onChange={(e) => { setCategory(e.target.value) }}
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
                        {tagsLoading ? (
                          <p>Loading tags...</p>
                        ) : (
                          <Dropdown>
                            <Dropdown.Toggle variant="outline-primary">
                              {'Select a Tag'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {tagsList?.filter(tag => !tags.includes(tag)).map((tag, index) => (
                                <Dropdown.Item key={tag._id} onClick={() => handleAddTag(tag)}>
                                  {tag.name}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                      </div>
                      {/* Display added tags */}
                      <div className="tags-list">
                        {tags.map((tag, index) => (
                          <span key={tag._id} className="tag-item">
                            #{tag.name} <Button variant="link" onClick={() => handleRemoveTag(tag)}>X</Button>
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
                    {editProduct && (
                      <Form onSubmit={(e) => handleUpdateProduct(editProduct._id, e)}>

                        <button onClick={() => cancelHandle()}>Cancel</button>

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

                        <Form.Group controlId="category">
                          <Form.Label>Category</Form.Label>
                          <Form.Control
                            as="select"
                            value={category}
                            onChange={(e) => { setCategory(e.target.value); setTags([]); }}
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
                              <span key={tag._id} className="tag-item">
                                #{tag.name} <Button variant="link" onClick={() => handleRemoveTag(tag)}>X</Button>
                              </span>
                            ))}
                          </div>
                        </Form.Group>

                        <Button type="submit" variant="primary" disabled={isLoading}>
                          {isLoading ? 'Updating...' : 'Update Product'}
                        </Button>
                      </Form>
                    )}

                    <div className="list">
                      {isLoading ? (
                        <p>Loading products...</p>
                      ) : productError ? (
                        <p>Error loading products.</p>
                      ) : products && products.length > 0 ? (
                        products.map((product) => (
                          <div key={product._id} className="item">
                            <div className="actions">
                              <button onClick={() => handleDelete(product._id)}>Delete</button>
                              <button onClick={() => handleUpdate(product)}>Update</button>
                            </div>
                            <h3>{product.title}</h3>
                            <p>Description : {product.description}</p>
                            <p>Type : {product.type}</p>
                            <p>Gallery:</p>
                            <ul>
                              {product.Image && product.Image.map((image, index) => (<li key={index}><img src="image" alt="image" /></li>))}
                            </ul>
                            <p>Tags:</p>
                            <ul>
                              {product.tags && product.tags.map((tag, index) => (<li key={index}>#{tag.name}</li>))}
                            </ul>
                            <p>Category : {product.category.name}</p>
                            <p>Created the :  {new Date(product.dateCreated).toLocaleDateString()}</p>
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
                    {editProduct && (
                      <Form onSubmit={(e) => handleUpdateProduct(editProduct._id, e)}>

                        <button onClick={() => cancelHandle()}>Cancel</button>

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

                        <Form.Group controlId="category">
                          <Form.Label>Category</Form.Label>
                          <Form.Control
                            as="select"
                            value={category}
                            onChange={(e) => { setCategory(e.target.value); setTags([]); }}
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
                              <span key={tag._id} className="tag-item">
                                #{tag.name} <Button variant="link" onClick={() => handleRemoveTag(tag)}>X</Button>
                              </span>
                            ))}
                          </div>
                        </Form.Group>

                        <Button type="submit" variant="primary" disabled={isLoading}>
                          {isLoading ? 'Updating...' : 'Update Product'}
                        </Button>
                      </Form>
                    )}

                    <div className="list">
                      {isLoading ? (
                        <p>Loading services...</p>
                      ) : serviceError ? (
                        <p>Error loading services.</p>
                      ) : services && services.length > 0 ? (
                        services.map((service) => (
                          <div key={service._id} className="item">
                            <div className="actions">
                              <button onClick={() => handleDelete(service._id)}>Delete</button>
                              <button onClick={() => handleUpdate(service)}>Update</button>
                            </div>
                            <h3>{service.title}</h3>
                            <p>Description : {service.description}</p>
                            <p>Type : {service.type}</p>
                            <p>Gallery:</p>
                            <ul>
                              {service.Image && service.Image.map((image, index) => (<li key={index}><img src="image" alt="image" /></li>))}
                            </ul>
                            <p>Tags:</p>
                            <ul>
                              {service.tags && service.tags.map((tag, index) => (<li key={index}>#{tag.name}</li>))}
                            </ul>
                            <p>Category : {service.category.name}</p>
                            <p>Created the :  {new Date(service.dateCreated).toLocaleDateString()}</p>
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
