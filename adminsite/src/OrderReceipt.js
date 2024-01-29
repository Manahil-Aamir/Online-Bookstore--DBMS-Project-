import React, { useEffect, useState } from 'react';
import Axios from "axios";


function OrderReceipt(props) {
  const [filteredInformationList, setFilteredInformationList] = useState([]);
  
  console.log(props.ordId);
  console.log('here');
  console.log(props.informationList);

  

  useEffect(() => {
    filterData();
  }, [props.ordId, props.informationList]);

  const filterData = () => {
    const filteredData = props.informationList.filter((val) => val[0] === props.ordId);
    setFilteredInformationList(filteredData);
  };
  
  
  const displayAll=()=>{
   return (
    <div className="container">
   <div ><table className="table-container">
    <thead>
      <tr>
        <th>BOOK ID</th>
        <th>TITLE</th>
        <th>QUANTITY</th>
        <th>UNIT PRICE</th>
        <th>TOTAL</th>
      </tr>
    </thead>
    <tbody>
            {filteredInformationList.map((val, key) => (
              <tr className="employee" key={key}>
                <td>{val[1]}</td>
                <td>{val[5]}</td>
                <td>{val[3]}</td>
                <td>{val[2]}</td>
                <td>{val[4]}</td>
              </tr>
            ))}
          </tbody>
          </table>
      {filteredInformationList.length > 0 && (
        <div className="total-bubble">
          total: {filteredInformationList[0][6]}
        </div>
      )}
    </div>
    </div>
  );
};
    
 return (
    <div>
      {displayAll()}

    </div>
  );
}

export default OrderReceipt;
