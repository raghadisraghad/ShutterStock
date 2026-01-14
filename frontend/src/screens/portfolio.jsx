import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Form, Card, Modal } from 'react-bootstrap';
import { FaPencilAlt, FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube, FaGlobe } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { useGetServicesByVendorQuery, useUpdateServiceMutation } from '../slices/serviceApiSlice';
import { useGetWorksByVendorQuery, useAddWorkMutation, useDeleteWorkMutation } from '../slices/workApiSlice';
import { useUploadServiceMutation, useUploadWorkMutation } from '../slices/imageApiSlice';

const Portfolio = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [updateService, { isLoading: updateLoading }] = useUpdateServiceMutation();
  const { data: services, isLoading: serviceLoading, refetch } = useGetServicesByVendorQuery(userInfo._id);
  const service = Array.isArray(services) ? services[0] : services;

  const { data: works, isLoading: worksLoading, refetch: refetchWork } = useGetWorksByVendorQuery(userInfo._id);
  const [addWork] = useAddWorkMutation();
  const [uploadWork, { isLoading: updateWorkLoading }] = useUploadWorkMutation();
  const [deleteWork, { isLoading: deleteWorkAccount }] = useDeleteWorkMutation();

  const [uploadService] = useUploadServiceMutation();

  const [editable, setEditable] = useState(false);
  const [title, setTitle] = useState(service?.title || '');
  const [description, setDescription] = useState(service?.description || '');
  const [local, setLocal] = useState(service?.local || '');
  const [background, setBackground] = useState(service?.background || '');
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isVendor, setIsVendor] = useState(false);


  const cities = [
    'Agadir', 'Al Hoceima', 'Azrou', 'Beni Mellal', 'Berkane', 'Casablanca', 'Chefchaouen', 'El Jadida',
    'Fes', 'Guelmim', 'Ifrane', 'Kenitra', 'Khemisset', 'Marrakech', 'Meknes', 'Nador', 'Oujda',
    'Rabat', 'Sale', 'Tanger', 'Tetouan', 'Taza', 'Taroudant', 'Essaouira', 'Safi', 'Settat',
    'Khouribga', 'El Kelaa des Sraghna', 'Marrakech', 'Tétouan', 'Tiznit', 'Ouarzazate', 'Errachidia',
    'Midelt', 'Benslimane', 'Azilal', 'Tinghir', 'Al Hoceima', 'Sidi Kacem', 'Sidi Ifni',
    'Boujdour', 'Oued Zem', 'Imintanoute', 'Safi', 'Laayoune', 'Tarfaya', 'Taroudant', 'Nador'
  ];

  const [showWorkModal, setShowWorkModal] = useState(false);
  const [titleWork, setTitleWork] = useState('');
  const [descriptionWork, setDescriptionWork] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [city2, setCity2] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const [newCollab, setNewCollaborators] = useState('');
  const [pictures, setPictures] = useState([]);

  const handleAddCollaborators = () => {
    if (newCollab.trim() !== '') {
      setCollaborators([...collaborators, newCollab]);
      setNewCollaborators('');
    }
  };

  const handleRemoveCollaborators = (index) => {
    setCollaborators(collaborators.filter((_, i) => i !== index));
  };

  const handleFileChangeWork = (e) => {
    const files = Array.from(e.target.files);
    setPictures([...pictures, ...files]);
  };

  const handleRemovePicture = (index) => {
    setPictures(pictures.filter((_, i) => i !== index));
  };

  const toggleEdit = () => setEditable(!editable);

  const handleFileChange = (e) => {
    setBackgroundFile(e.target.files[0]);
  };

  const handleUpdate = async () => {
    try {
      let imageUrl = backgroundFile;
      if (backgroundFile instanceof File) {
        const formData = new FormData();
        formData.append('background', backgroundFile);

        const uploadResponse = await uploadService({ id: userInfo._id, formData }).unwrap();
        imageUrl = uploadResponse.imageUrl;
      }

      const serviceData = {
        title,
        description,
        local,
        background: imageUrl,
        vendor: userInfo._id,
        city: city2,
        works,
      };
      const response = await updateService({ id: service._id, serviceData }).unwrap();

      if (response.error) {
        throw new Error('Failed to update service');
      }

      toast.success('Service Updated successfully!', { autoClose: 1000 });
      setShowModal(false);
      refetch();
    } catch (error) {
      toast.error(error || err);
    }
  };

  const removeWork = async (workId) => {
    try {
      const confirm = window.confirm('Are you sure you want to delete your Work?');
      if (!confirm) {
        return;
      }
      const response = await deleteWork({ id: workId }).unwrap();

      if (response.error) {
        toast.error(response.error);
      }

      toast.success('Work Removes successfully!', { autoClose: 1000 });
      refetchWork();
    } catch (error) {
      toast.error(error || err);
    }
  };

  const handleAddWork = async () => {
    try {
      let imageUrls = [];

      if (pictures.length > 0) {
        try {
          const formData = new FormData();
          for (const picture of pictures) {
            formData.append('work', picture);
          }
          const uploadResponse = await uploadWork({ id: userInfo._id, formData }).unwrap();
          imageUrls = uploadResponse.workUrls;
        } catch (error) {
          console.error("Error uploading picture:", error);
          toast.error('There was an issue uploading the pictures. Please try again later.');
          return;
        }
      }
      const WorkData = {
        title: titleWork,
        description: descriptionWork,
        picture: imageUrls,
        startDate: start,
        endDate: end,
        city,
        price: parseFloat(price),
        vendor: userInfo._id,
        collaborators,
      };
      console.log(WorkData);
      const response = await addWork({ id: service._id, WorkData }).unwrap();

      if (response.error) {
        throw new Error('Failed to update service');
      }

      toast.success('Service Updated successfully!', { autoClose: 1000 });
      setShowWorkModal(false);
      setTitleWork('');
      setDescriptionWork('');
      setPrice('');
      setCollaborators([]);
      setPictures([]);
      setNewCollaborators('');
      setStart('');
      setEnd('');
      setCity('');
      refetchWork();
    } catch (error) {
      console.error("Error saving work:", error);
      toast.error('Title already in use');
    }
  };

  useEffect(() => {
    if (service) {
      setTitle(service.title);
      setDescription(service.description);
      setLocal(service.local);
      setCity2(service.city);
      setBackground(service.background);
    }
  }, [service]);

  useEffect(() => {
    if (service && userInfo && service.vendor) {
      setIsVendor(userInfo._id === service?.vendor?._id);
    }
  }, [service, userInfo]);

  if (serviceLoading || worksLoading || updateLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ height: '300px', position: 'relative' }}>
        <img
          src={
            background
              ? `${import.meta.env.VITE_API_BASE_URL}api/pictures/service-image/${service.vendor._id}/${background.split('/').pop()}`
              : 'https://via.placeholder.com/1500'
          }
          alt="Service Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />

        {isVendor && (
          <FaPencilAlt
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              cursor: 'pointer',
              fontSize: '20px',
              color: 'black',
            }}
            onClick={() => setShowModal(true)}
          />
        )}

        <div
          style={{
            position: 'absolute',
            top: '180px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            border: '5px solid white',
            overflow: 'hidden',
          }}
        >
          <img
            src={
              service.vendor?.avatar
                ? `${import.meta.env.VITE_API_BASE_URL}api/pictures/avatar/${service.vendor._id}/${service.vendor.avatar.split('/').pop()}`
                : 'https://via.placeholder.com/150'
            }
            alt="Vendor Avatar"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2>Vendor : {userInfo?.firstName} {userInfo?.lastName}</h2>
        <p>Email: {userInfo?.email}</p>
        <p>Telephone: {userInfo?.tel}</p>
        <p>Address: {city2},{local}</p>

        <div style={{ marginTop: '10px' }}>
          {userInfo?.instagram && <a href={userInfo.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram size={30} style={{ margin: '0 10px' }} /></a>}
          {userInfo?.linkedin && <a href={userInfo.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin size={30} style={{ margin: '0 10px' }} /></a>}
          {userInfo?.facebook && <a href={userInfo.facebook} target="_blank" rel="noopener noreferrer"><FaFacebook size={30} style={{ margin: '0 10px' }} /></a>}
          {userInfo?.x && <a href={userInfo.x} target="_blank" rel="noopener noreferrer"><FaTwitter size={30} style={{ margin: '0 10px' }} /></a>}
          {userInfo?.youtube && <a href={userInfo.youtube} target="_blank" rel="noopener noreferrer"><FaYoutube size={30} style={{ margin: '0 10px' }} /></a>}
          {userInfo?.website && <a href={userInfo.website} target="_blank" rel="noopener noreferrer"><FaGlobe size={30} style={{ margin: '0 10px' }} /></a>}
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4>Materials Used:</h4>
          <ul>
            {userInfo?.materials && userInfo.materials.length > 0 ? (
              userInfo.materials.map((material, index) => (
                <li key={index}>{material}</li>
              ))
            ) : (
              <></>
            )}
          </ul>
          <h3>Service Title: {title}</h3>
          <h3>Service Description: {description}</h3>
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-center" style={{ padding: '40px 0' }}>
        {isVendor && <Button onClick={() => setShowWorkModal(true)}>Add Work</Button>}
        {works?.map((work) => (
          <>
            <Button onClick={() => removeWork(work._id)}>X</Button>
            <Card
              key={work._id}
              style={{ width: '300px', margin: '10px', cursor: 'pointer' }}
              onClick={() => navigate(`/work/${work._id}`)}
            >
              <Card.Img
                variant="top"
                src={work.picture && work.picture.length > 0
                  ? `${import.meta.env.VITE_API_BASE_URL}api/pictures/service-work-image/${work.vendor._id}/${work.picture[0].split('/').pop()}`
                  : 'https://via.placeholder.com/300'}
                alt={work.title}
              />
              <Card.Body>
                <Card.Title>{work.title}</Card.Title>
                <Card.Text>{work.description}</Card.Text>
              </Card.Body>
            </Card>
          </>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={!editable}
              />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!editable}
              />
            </Form.Group>
            <Form.Group controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                as="select"
                value={city2}
                onChange={(e) => setCity2(e.target.value)}
                disabled={!editable}
                required
              >
                <option value="">Select a city</option>
                {cities.map((cityName2, index) => (
                  <option key={index} value={cityName2}>
                    {cityName2}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>


            <Form.Group controlId="formLocal">
              <Form.Label>Local</Form.Label>
              <Form.Control
                type="text"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                disabled={!editable}
              />
            </Form.Group>

            <Form.Group controlId="formFile">
              <Form.Label>Upload Background Image</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} disabled={!editable} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {editable ? (
            <>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdate}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={toggleEdit}>
              Edit
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal show={showWorkModal} onHide={() => setShowWorkModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Work</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={titleWork}
                onChange={(e) => setTitleWork(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={descriptionWork}
                onChange={(e) => setDescriptionWork(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="month"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="month"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId='collaborators'>
              <Form.Label>Collaborators</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type='text'
                  placeholder="Enter a collaborator"
                  value={newCollab}
                  onChange={(e) => setNewCollaborators(e.target.value)}
                />
                <Button variant="outline-primary" onClick={handleAddCollaborators} className="ms-2">Add</Button>
              </div>
              <div className="collaborators">
                <ul>
                  {collaborators.map((collaborator, index) => (
                    <li key={index}>
                      {collaborator} <span onClick={() => handleRemoveCollaborators(index)}>X</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Form.Group>
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
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Upload Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleFileChangeWork}
              />
              <div className="mt-3">
                {pictures.length > 0 && (
                  <div>
                    <h5>Uploaded Pictures</h5>
                    <ul>
                      {pictures.map((file, index) => (
                        <>
                          <img src={URL.createObjectURL(file)} alt="Uploaded" className="thumbnail" />
                          <li key={index}>
                            {file.name} <span onClick={() => handleRemovePicture(index)}>X</span>
                          </li>
                        </>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowWorkModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddWork}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Portfolio;
