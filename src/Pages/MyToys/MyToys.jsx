/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../AuthContext/AuthContext";
import { Rating } from "primereact/rating";
import { FaRegEdit } from "react-icons/fa";
import {
  Button,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";

const MyToys = () => {
  const [products, setProducts] = useState([]);
  const { user, loading, setLoading, success, error } = useContext(userContext);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/mytoys?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, [user, setLoading]);

  const imageBodyTemplate = (product) => {
    return (
      <img
        src={product.picture}
        alt=""
        className="w-[6rem] shadow-2 border-round rounded-lg"
      />
    );
  };

  const categoryBodyTemplate = (product) => {
    return <h4>{product.categoryID}</h4>;
  };

  const priceBodyTemplate = (product) => {
    return <h4>${product.price}</h4>;
  };

  const ratingBodyTemplate = (product) => {
    return (
      <Rating
        className="text-yellow-400 flex gap-1"
        value={product.ratings}
        readOnly
        cancel={false}
      />
    );
  };

  const editBodyTemplate = (product) => {
    const [findProduct, setFindProduct] = useState({});
    const [id, setId] = useState("");
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [value, setValue] = useState(null);

    const { isOpen, onOpen, onClose } = useDisclosure();

    // edit data Load
    const handleEditData = (id) => {
      setId(id);
      fetch(`http://localhost:5000/product-id?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFindProduct(data);
        });
    };

    const handleAddNewToy = (e) => {
      setLoading(true);
      e.preventDefault();
      const form = e.target;
      const name = form.name.value;
      const price = form.price.value;
      const picture = form.photo.value;
      const categoryID = form.category.value;
      const userName = user.displayName;
      const email = user.email;
      const ratings = value;
      const description = form.description.value;

      const newToy = {
        name,
        price,
        picture,
        categoryID,
        userName,
        email,
        ratings,
        description,
      };

      fetch(`http://localhost:5000/product-id?id=${id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(newToy),
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data.modifiedCount) {
            const filterProducts = products.filter((p) => p._id !== id);
            setProducts([...filterProducts, newToy]);
            success("SuccessFull Change");
            onClose();
          } else {
            error("Places Change Value");
          }
          console.log(data);
        });
    };
    return (
      <>
        <button
          className="!text-gray-700 !bg-transparent !text-base !font-medium font-['Inter'] leading-normal !rounded-md"
          onClick={() => {
            onOpen();
            handleEditData(product._id);
          }}
        >
          <FaRegEdit className="!text-2xl" />
        </button>

        <Modal
          size={"4xl"}
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          isCentered
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <form onSubmit={handleAddNewToy}>
              <ModalHeader>Add New Toy</ModalHeader>
              <ModalCloseButton className="!text-red-600 !text-xl !p-3" />
              <ModalBody pb={6}>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Row 1 */}
                  <InputGroup>
                    <label
                      className="bg-gray-300 text-center px-3 flex items-center font-medium text-gray-600 !py-0 text-md rounded-tl-md rounded-bl-md"
                      htmlFor="name"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      className="!text-lg"
                      name="name"
                      type="text"
                      placeholder="Toy Name"
                      defaultValue={findProduct.name}
                      required
                    />
                  </InputGroup>
                  <InputGroup>
                    <label
                      className="bg-gray-300 text-center px-3 flex items-center font-medium text-gray-600 !py-0 text-md rounded-tl-md rounded-bl-md"
                      htmlFor="Price"
                    >
                      Price
                    </label>
                    <Input
                      id="Price"
                      className="!text-lg"
                      type="number"
                      name="price"
                      placeholder="$"
                      defaultValue={findProduct.price}
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <label
                      className="bg-gray-300 text-center px-3 flex items-center font-medium text-gray-600 !py-0 text-md rounded-tl-md rounded-bl-md"
                      htmlFor="Photo"
                    >
                      Photo
                    </label>
                    <Input
                      id="Photo"
                      className="!text-lg"
                      type="url"
                      name="photo"
                      placeholder="Photo URL"
                      defaultValue={findProduct.picture}
                      required
                    />
                  </InputGroup>

                  <Select
                    name="category"
                    size="md"
                    placeholder="Select Category"
                    defaultValue={findProduct.categoryID}
                    required
                  >
                    <option value="cars">Cars</option>
                    <option value="airplanes">Air Planes</option>
                    <option value="trucks">Trucks</option>
                    <option value="bikes">Bikes</option>
                  </Select>

                  <div className="flex gap-3 md:col-span-2">
                    <label
                      className="bg-gray-300 text-center px-3 flex items-center font-medium text-gray-600 !py-2 text-md rounded-tl-md rounded-bl-md"
                      htmlFor="rating"
                    >
                      Rating
                    </label>
                    <Rating
                      className="!flex gap-2"
                      value={value}
                      cancel={false}
                      onChange={(e) => setValue(e.value)}
                      pt={{
                        onIcon: { className: "text-orange-400 w-6 h-6" },
                        offIcon: {
                          className: "w-6 h-6",
                        },
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Textarea
                      name="description"
                      required
                      defaultValue={findProduct.description}
                      placeholder="Toy Description ..."
                    />
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <button
                  disabled={value ? false : true}
                  className={`bg-pink-600 text-white text-lg font-medium font-['Inter'] leading-normal rounded-md px-4 lg:px-6 py-2 mr-6 ${
                    value ? "" : "cursor-not-allowed opacity-50"
                  }`}
                  type="submit"
                >
                  Save
                </button>
                <Button type="button" onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </>
    );
  };
  const deleteBodyTemplate = (product) => {
    return (
      <>
        <button className="bg-pink-600 text-white text-base font-medium font-['Inter'] leading-normal rounded-md px-3 lg:px-5 py-2">
          Delete
        </button>
      </>
    );
  };

  return (
    <div className="container mx-auto px-5">
      {loading && (
        <div className="text-center mt-4">
          <Spinner color="red.500" />
        </div>
      )}
      <div className="py-10">
        <DataTable value={products} tableStyle={{ minWidth: "60rem" }}>
          <Column field="name" header="Name"></Column>
          <Column header="Image" body={imageBodyTemplate}></Column>
          <Column
            field="price"
            header="Price"
            body={priceBodyTemplate}
          ></Column>
          <Column
            field="category"
            header="Category"
            body={categoryBodyTemplate}
          ></Column>
          <Column
            field="rating"
            header="Reviews"
            body={ratingBodyTemplate}
          ></Column>
          <Column field="edit" header="Edit" body={editBodyTemplate}></Column>
          <Column
            field="delete"
            header="Delete"
            body={deleteBodyTemplate}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default MyToys;
