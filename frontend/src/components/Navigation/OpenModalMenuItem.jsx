import React from 'react';
import { useModal } from '../../context/Modal';


function OpenModalMenuItem({
  modalComponent, // component to render inside the modal
  itemIcon,
  itemText, // text of the menu item that opens the modal
  onItemClick, // optional: callback function that will be called once the menu item that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onItemClick === "function") onItemClick();
  };

  return (
    <li onClick={onClick} style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
      {itemIcon && itemIcon} {itemText}
    </li>
  );
}

export default OpenModalMenuItem;
