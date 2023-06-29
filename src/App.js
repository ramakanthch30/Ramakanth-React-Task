import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import React, { useState, useEffect } from "react";
import  ExportToExcel  from "./ExportToExcel";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';


const App = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [resetData, setResetData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedItem,setSelectedItem] = useState(null);

  const handleClose = () => {
    setSelectedItem(null);
    setShow(false);
  }


  const fileName = "myfile";
  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setTimeout(() => {
          setData(res.products);
          setResetData(res.products);
        }, 1000);
      });
  }, []);
  useEffect(() => {
    
  }, []);
  const onSearch = (event) => {
    setSearch(event.target.value);
    if (!event.target.value) {
      setData(resetData);
    }
    let newData = resetData.filter((item) =>
      item.title.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setData(newData);
  };
  const sort = (val) => {
    let newData = [...resetData];
    newData = newData.sort((a, b) => {
      if (["price","discount","rating","stock"].includes(val)) return a[val] - b[val];
      const nameA = a[val].toUpperCase();
      const nameB = b[val].toUpperCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
    setData(newData);
  };
  const toggleChange = (event, item) => {
    event.stopPropagation();
    let newSelectedRows = [...selectedRows];
    let newSelectedRowIds = [...selectedRowIds];
    newSelectedRows.push(item);
    newSelectedRowIds.push(item.id);
    setSelectedRows(newSelectedRows);
    setSelectedRowIds(newSelectedRowIds);
  };
  const onRowClick = (e, item) => {
    e.preventDefault();
    setSelectedItem(item);
    setShow(true);
    console.log(item);
  }
  return (
    <div className="App">
      <h1>List of Products</h1>
      <div>
        <label><b> Search By Title: </b></label>
        <input onChange={onSearch} value={search} />
      </div> <br />
      <ExportToExcel apiData={selectedRows} fileName={fileName} />
      <hr />

      <Modal show={show && selectedItem} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem && selectedItem.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card >
      <Card.Img variant="top" src={selectedItem && selectedItem.thumbnail} />
      <Card.Body>
        <Card.Title>About</Card.Title>
        <Card.Text>
        {selectedItem && selectedItem.description}
        </Card.Text>
        <Button variant="primary">
        <Alert.Link target='_blank' rel="noreferrer" href={selectedItem && selectedItem.thumbnail} download="logo">Download Image</Alert.Link>
          </Button>
        
      </Card.Body>
    </Card>
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <table >
        <thead >
          <tr>
            <th>Select ID</th>
            <th>
              Title |{" "}
              <span onClick={() => sort("title")} style={{ cursor: "pointer" }}>
                sort
              </span>
            </th>
            <th>
              Brand |{" "}
              <span onClick={() => sort("brand")} style={{ cursor: "pointer" }}>
                sort
              </span>
            </th>
            <th>
              Image
            </th>
            <th>
              Price |{" "}
              <span onClick={() => sort("price")} style={{ cursor: "pointer" }}>
                sort
              </span>
            </th>
            <th>
              Discount |{" "}
              <span onClick={() => sort("discount")} style={{ cursor: "pointer" }}>
                sort
              </span>
            </th>
            <th>
              Rating |{" "}
              <span onClick={() => sort("rating")} style={{ cursor: "pointer" }}>
                sort
              </span>
            </th>
            <th>
              Stock |{" "}
              <span onClick={() => sort("stock")} style={{ cursor: "pointer" }}>
                sort
              </span>
            </th>
            <th>
              Category
            </th>
            <th>
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length ? (
            data.map((item) => (
              <tr key={item.id} onClick={(e)=>onRowClick(e,item)}>
                <td>
                  <input
                    type="checkbox"
                    defaultChecked={selectedRowIds.includes(item.id)}
                    onClick={(e) => toggleChange(e, item)}
                  />{item.id}
                </td>
                <td>{item.title}</td>
                <td>{item.brand}</td>
                <td>
                   <img src={item?.images[0]} widht="50px" height="50px" alt='thumbmail of item'/>
                </td>
                <td>{item.price}</td>
                <td>{item.discountPercentage}</td>
                <td>{item.rating}</td>
                <td>{item.stock}</td>
                <td>{item.category}</td>
                <td>{item.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                {search ? "No Data" : "loading..."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default App;
