import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Row, Col, Nav, Dropdown } from 'react-bootstrap';
import { redirect, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation, useArchiveProductMutation, useGetProductsByVendorQuery } from '../slices/productApiSlice';
import { useGetCategoriesQuery } from '../slices/categoriesApiSlice';
import { useGetTagsByCategoryQuery } from '../slices/tagApiSlice';
import { useUploadProductImageMutation } from '../slices/imageApiSlice';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';

const myProducts = () => {
  const [activeSection, setActiveSection] = useState('product');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [image, setImage] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const [addProduct, { isLoading }] = useAddProductMutation();
  const [updateProduct, { isLoading: updateLoading }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: deleteLoading }] = useDeleteProductMutation();
  const [archiveProduct, { isLoading: archiveLoading }] = useArchiveProductMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const [uploadProductImages] = useUploadProductImageMutation();
  const { data: products, isLoading: productsLoading, error: productError, refetch: refreshProducts } = useGetProductsByVendorQuery(userInfo._id);
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
    setPrice(model.price);
    setCategory(model.category._id);
    setTags(model.tags);
    setImage(model.Image);
  };

  const cancelHandle = () => {
    setEditProduct('');
    setTitle('');
    setDescription('');
    setPrice('');
    setCategory('');
    setTags([]);
    setImage('');
    setShowPopup(false);
  }

  if (categoriesLoading) {
    return <div>Loading categories...</div>;
  }

  const removeImage = (imageUrl) => {
    setImage(image.filter((img) => img !== imageUrl));
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
      await deleteProduct({ id }).unwrap();
      toast.success('Product Deleted successfully!', { autoClose: 1000, });
      refreshProducts();
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'An error occurred', { autoClose: 1000, });
    }
  }

  const handleArchive = async (id) => {
    try {
      const isConfirmed = window.confirm('Are you sure you want to archive this product?');

      if (!isConfirmed) return;
      await archiveProduct({ id }).unwrap();
      toast.success('Product Archived successfully!', { autoClose: 1000, });
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
        category,
        tags: tags.map((tag) => tag._id),
        picture: image,
      };

      await updateProduct({ id: productId, ...data }).unwrap();
      toast.success('Product updated successfully!', { autoClose: 1000, });
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

    try {
      let imageUrl = image;
      if (image instanceof File) {
        const imageFormData = new FormData();
        imageFormData.append('picture', image);
        imageFormData.append('userId', userInfo._id);
        const uploadResponse = await uploadProductImages({ id: userInfo._id, formData: imageFormData }).unwrap();
        imageUrl = uploadResponse.imageUrl;
      }else{
        toast.error(err?.data?.message || err.error || 'An error occurred', { autoClose: 1000, });
        return
      }

      const productData = {
        title,
        description,
        type: 'product',
        price: parseFloat(price),
        picture: imageUrl,
        vendor: userInfo._id,
        tags: tags.map((tag) => tag._id),
        category,
      };

      await addProduct({ productData }).unwrap();
      toast.success('Product Added successfully!', { autoClose: 1000, });
      refreshProducts();
      setActiveSection('product');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'An error occurred', { autoClose: 1000, });
    }
  };

  return (
    <>
      <h1>myProducts</h1>
      <div className="profile-container">
        {(activeSection === 'product') && (
          <>
            <div className={`overlay ${showPopup ? 'active' : ''}`} onClick={() => setShowPopup(false)}></div>
            <div className={`update-profile-popup ${showPopup ? 'active' : ''}`}>
              {editProduct ? (
                <Form onSubmit={(e) => { if (editProduct) handleUpdateProduct(editProduct._id, e); }}>
                  <button onClick={() => { cancelHandle(); setShowPopup(false); }}>Cancel</button>
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
                        <div className='span'>
                          <div key={tag._id} className="tag-item">
                            #{tag.name} <Button variant="link" onClick={() => handleRemoveTag(tag)}>X</Button>
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
            <FormContainer>
              <div className="profileHeader">
                {activeSection === 'addProduct' && (
                  <Form onSubmit={handleAddProduct}>
                    <h1>Create a Product</h1>

                    <Row className="mt-4">
                      <Col ms={5}>
                        <Form.Group controlId="title">
                          <Form.Label>Title</Form.Label>
                          <Form.Control type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </Form.Group>
                      </Col>

                      <Col ms={5}>
                        <Form.Group controlId="description">
                          <Form.Label>Description</Form.Label>
                          <Form.Control as="textarea" rows={3} placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col ms={5}>
                        <Form.Group controlId="category">
                          <Form.Label>Category</Form.Label>
                          <Form.Control as="select" value={category} onChange={(e) => { setCategory(e.target.value) }} required >
                            <option value="">Select a category</option>
                            {!categoriesLoading && categories?.map((cat) => (
                              <option key={cat._id} value={cat._id}> {cat.name} </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Col>

                      <Col ms={5}>
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
                                  {tagsList?.filter(tag => !tags.includes(tag)).map((tag, index) => (
                                    <Dropdown.Item key={tag._id} onClick={() => handleAddTag(tag)}>
                                      {tag.name}
                                    </Dropdown.Item>
                                  ))}
                                </Dropdown.Menu>
                              </Dropdown>
                            )}
                          </div>
                          <div className="tags-list">
                            {tags.map((tag, index) => (
                              <div className='span'>
                                <div key={tag._id} className="tag-item">
                                  #{tag.name} <Button variant="link" onClick={() => handleRemoveTag(tag)}>X</Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col ms={5}>
                        <Form.Group controlId="image">
                          <Form.Label>Image</Form.Label>
                          <Form.Control type="file" onChange={handleImageUpload} required />
                        </Form.Group>

                        <div className="image-gallery">
                          {image ? (
                            <div className="image-item">
                              <img src={URL.createObjectURL(image)} alt="Uploaded" className="thumbnail" />
                              <Button variant="danger" size="sm" onClick={() => setImage(null)}>
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <p>No image uploaded yet.</p>
                          )}
                        </div>

                      </Col>

                      <Col ms={5}>
                        <Form.Group controlId="price">
                          <Form.Label>Price</Form.Label>
                          <Form.Control type="number" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className='center'>
                      <Button type="submit" variant="primary" disabled={isLoading}>
                        {isLoading ? 'Adding...' : 'Add Product'}
                      </Button>
                    </div>
                  </Form>
                )}

                {activeSection === 'product' && (
                  <div className="list">
                    <Button onClick={() => { setActiveSection('addProduct'); cancelHandle(); }} variant="primary">Add Product</Button>
                    {isLoading ? (
                      <p>Loading products...</p>
                    ) : productError ? (
                      <p>Error loading products.</p>
                    ) : products && products.length > 0 ? (
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Picture</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Created Date</th>
                            <th>Tags</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr key={product._id}>
                              <td>{product.title}</td>
                              <td> <img src={`http://localhost:5000/api/pictures/product-images/${userInfo._id}/${product.picture.split(/[\\/]/).pop()}`} alt={product.title}/></td>
                              <td>{product.description}</td>
                              <td>{product.price} DH</td>
                              <td>{product.category.name}</td>
                              <td>{new Date(product.dateCreated).toLocaleDateString()}</td>
                              <td>
                                {product.tags && product.tags.map((tag, index) => (<span key={index}>#{tag.name} </span>))}
                              </td>
                              <td>{product.archive ? 'Archived' : 'Active'}</td>
                              <td>
                                <button onClick={() => handleDelete(product._id)}>Delete</button>
                                <button onClick={() => { setShowPopup(true); handleUpdate(product); }}>Update</button>
                                <button onClick={() => handleArchive(product._id) }>Archive</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No products available</p>
                    )}
                  </div>
                )}
              </div>
            </FormContainer>
          </div>
        </div>
      </div>
    </>

  );
};

export default myProducts;
