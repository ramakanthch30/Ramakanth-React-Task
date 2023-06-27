import "./App.css";
import { useState, useEffect } from "react";
import  ExportToExcel  from "./ExportToExcel";

const App = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [resetData, setResetData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
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
  const toggleChange = (item) => {
    let newSelectedRows = [...selectedRows];
    let newSelectedRowIds = [...selectedRowIds];
    newSelectedRows.push(item);
    newSelectedRowIds.push(item.id);
    setSelectedRows(newSelectedRows);
    setSelectedRowIds(newSelectedRowIds);
  };
  return (
    <div className="App">
      <h1>List of Products</h1>
      <div>
        <label><b> Search By Title: </b></label>
        <input onChange={onSearch} value={search} />
      </div> <br />
      <ExportToExcel apiData={selectedRows} fileName={fileName} />
      <hr />
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
              <tr key={item.id}>
                <td>
                  <input
                    type="checkbox"
                    defaultChecked={selectedRowIds.includes(item.id)}
                    onChange={() => toggleChange(item)}
                  />{item.id}
                </td>
                <td>{item.title}</td>
                <td>{item.brand}</td>
                <td>
                   <img src={item?.images[0]} widht="50px" height="50px"/>
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
