import React, { useState } from 'react';
import { DeleteFilled, EditOutlined, MenuOutlined } from '@ant-design/icons';
import { Dropdown, message, Space } from 'antd';
import { Modal, Button, ButtonToolbar, Placeholder } from 'rsuite'; // Import rsuite components

const Apper = () => {
  // State to control visibility of the Edit and Delete modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);  // New state for Delete modal
  const [rows, setRows] = useState(0);  // Declare the rows state for the Edit modal

  // Handle when Edit icon is clicked to open the modal
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  // Handle when Delete icon is clicked to show confirmation modal
  const handleDeleteClick = () => {
    setShowDeleteModal(true);  // Show delete confirmation modal
  };

  // Event handler for the dropdown menu item click
  const handleMenuClick = (e) => {
    if (e.key === '1') {
      handleEditClick(); // Open the Edit modal when "Edit" is clicked
    } else if (e.key === '2') {
      handleDeleteClick(); // Show the Delete modal when "Delete" is clicked
    }
  };

  // Close the Edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  // Close the Delete modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // Handle modal content load for Edit modal
  const handleEntered = () => {
    setTimeout(() => setRows(80), 2000); // Simulate content load for the Edit modal
  };

  // Dropdown menu items
  const menuItems = [
    {
      label: 'Edit',
      key: '1',
      icon: <EditOutlined />,
    },
    {
      label: 'Delete',
      key: '2',
      icon: <DeleteFilled />,
    },
  ];

  // Menu properties with event handler
  const menuProps = {
    items: menuItems,
    onClick: handleMenuClick,
  };

  return (
    <div>
      <Space wrap>
        {/* Dropdown Menu Icon */}
        <Dropdown
          menu={menuProps}
          trigger={['click']}
          className="outline-none"
        >
          <MenuOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
        </Dropdown>
      </Space>

      {/* Render Edit modal if showEditModal is true */}
      {showEditModal && (
        <Modal
          open={showEditModal}
          onClose={handleCloseEditModal}
          onEntered={handleEntered}
          onExited={() => setRows(0)}  // Reset rows state when modal exits
        >
          <Modal.Header>
            <Modal.Title>Edit Modal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Placeholder.Paragraph rows={rows} />  {/* Display the number of rows */}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleCloseEditModal} appearance="primary">
              Ok
            </Button>
            <Button onClick={handleCloseEditModal} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Render Delete modal if showDeleteModal is true */}
      {showDeleteModal && (
        <Modal open={showDeleteModal} onClose={handleCloseDeleteModal}>
          <Modal.Header>
            <Modal.Title>Delete Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Placeholder.Paragraph>
              Are you sure you want to delete this item?
            </Placeholder.Paragraph>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleCloseDeleteModal} appearance="subtle">
              Cancel
            </Button>
            <Button onClick={handleCloseDeleteModal} appearance="danger">
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Apper;
