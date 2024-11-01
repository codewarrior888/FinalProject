// import React, { useState, useEffect } from "react";
// import axios from "axios";

// import { API_URL } from "../../api.jsx";
// import { useAuth } from "../../../../hook/useAuth.jsx";
// import FilterPanel from "../../FilterPanel/FilterPanel.jsx";
// import ClaimDetails from "./Details/ClaimDetails.jsx";
// import "./Claim.css";

// const Claim = () => {
//   const { token } = useAuth();
//   const [data, setData] = useState([]);
//   const [isEmpty, setIsEmpty] = useState(false);
//   const [detailMe, setDetailMe] = useState();

//   const [filter, setFilter] = useState({
//     mfn: "",
//     rec: "",
//   });

//   const fetchData = async () => {
//     try {
//       const query = Object.entries(filter)
//         .map((x) => (x[1] ? x.join("=") : ""))
//         .reduce((acc, cur) => (cur ? `${acc}${acc ? "&" : ""}${cur}` : acc));

//       const response = await axios.get(`${API_URL}claims/${query ? "?" + query : ""}`, {
//         headers: {
//           Authorization: `Bearer ${token.access}`,
//         },
//       });
//       setData(response.data);
//       setIsEmpty(response.data.length === 0);
//     } catch (error) {
//       console.error("Error fetching claims data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [filter]);

//   const handlerSelect = (e) => {
//     let element = e.target;
//     while (element && element.tagName != "TR") {
//       element = element.parentElement;
//     }
//     setDetailMe(element.id.split("-")[1]);
//   };

//   return (
//     <>
//       <FilterPanel filter={filter} setFilter={setFilter} />
//       <div className="client-info__table-container">
//         <table className="client-info__table">
//           <thead>
//             <tr>
//               <th style={{ width: "100px" }}>серийный №</th>
//               <th style={{ width: "100px" }}>дата отказа</th>
//               <th style={{ width: "90px" }}>наработка, м/час</th>
//               <th style={{ width: "150px" }}>узел отказа</th>
//               <th style={{ width: "250px" }}>описание отказа</th>
//               <th style={{ width: "150px" }}>способ восстановления</th>
//               <th style={{ width: "150px" }}>используемые запасные части</th>
//               <th style={{ width: "100px" }}>дата восстано- вления</th>
//               <th style={{ width: "80px" }}>время простоя</th>
//               <th style={{ width: "250px" }}>сервисная компания</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item) => (
//               <tr id={"claim-" + item.id} key={item.id} onClick={handlerSelect}>
//                 <td>{item.machine_serial}</td>
//                 <td className="text-right">{item.failure_date}</td>
//                 <td className="text-right">{item.engine_hours}</td>
//                 <td>{item.malfunction_node_name}</td>
//                 <td>{item.failure_description}</td>
//                 <td>{item.recovery_method_name}</td>
//                 <td className={"capacity display-linebreak"}>{item.spare_parts}</td>
//                 <td className="text-right">{item.restoration_date}</td>
//                 <td className="text-right">{item.downtime}</td>
//                 <td>{item.service_company_name ?? "самостоятельно"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {isEmpty && <h3>Данных о машине с таким заводским номером нет в системе.</h3>}
//       {detailMe && <ClaimDetails id={detailMe} setId={setDetailMe} />}
//     </>
//   );
// };

// export default Claim;
