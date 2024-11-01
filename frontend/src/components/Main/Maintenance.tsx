// import React, { useState, useEffect } from "react";
// import axios from "axios";

// import { API_URL } from "../../../../Shared/api.jsx";
// import { useAuth } from "../../../../hook/useAuth.jsx";
// import FilterPanel from "../../FilterPanel/FilterPanel.jsx";
// import MaintenanceDetails from "./Details/MaintenanceDetails.jsx";
// import "./Maintenance.css";

// const Maintenance = () => {
//   const { token } = useAuth();
//   const [data, setData] = useState([]);
//   const [isEmpty, setIsEmpty] = useState(false);
//   const [detailMe, setDetailMe] = useState();

//   const [filter, setFilter] = useState({
//     ser: "",
//     man: "",
//     s: "",
//   });

//   const fetchData = async () => {
//     try {
//       const query = Object.entries(filter)
//         .map((x) => (x[1] ? x.join("=") : ""))
//         .reduce((acc, cur) => (cur ? `${acc}${acc ? "&" : ""}${cur}` : acc));

//       const response = await axios.get(`${API_URL}maintenances/${query ? "?" + query : ""}`, {
//         headers: {
//           Authorization: `Bearer ${token.access}`,
//         },
//       });
//       setData(response.data);
//       setIsEmpty(response.data.length === 0);
//     } catch (error) {
//       console.error("Error fetching maintenances data:", error);
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
//               <th style={{ width: "150px" }}>вид ТО</th>
//               <th style={{ width: "100px" }}>дата проведения ТО</th>
//               <th style={{ width: "80px" }}>наработка, м/час</th>
//               <th style={{ width: "150px" }}>№ заказ-наряда</th>
//               <th style={{ width: "100px" }}>дата заказ-наряда</th>
//               <th style={{ width: "250px" }}>сервисная компания</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item) => (
//               <tr id={"maintenance-" + item.id} key={item.id} onClick={handlerSelect}>
//                 <td>{item.machine_serial}</td>
//                 <td>{item.maintenance_type_name}</td>
//                 <td className="text-right">{item.maintenance_date}</td>
//                 <td className="text-right">{item.engine_hours}</td>
//                 <td>{item.order_number}</td>
//                 <td className="text-right">{item.order_date}</td>
//                 <td>{item.service_company_name ?? "самостоятельно"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {isEmpty && <h3>Данных о машине с таким заводским номером нет в системе.</h3>}
//       {detailMe && <MaintenanceDetails id={detailMe} setId={setDetailMe} />}
//     </>
//   );
// };

// export default Maintenance;
