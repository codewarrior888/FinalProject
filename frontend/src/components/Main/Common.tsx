// import React, { useState, useEffect } from "react";
// import axios from "axios";

// import { API_URL } from "../../../../Shared/api.jsx";
// import { useAuth } from "../../../../hook/useAuth.jsx";
// import FilterPanel from "../../FilterPanel/FilterPanel.jsx";
// import Cell from "../../../../Shared/Cell/Cell.jsx";
// import CommonDetails from "./Details/CommonDetails.jsx";
// import DialogCRUD from "../../DialogCRUD/DialogCRUD.jsx";
// import "./Common.css";

// const Common = () => {
//   const { token } = useAuth();
//   const [data, setData] = useState([]);
//   const [isEmpty, setIsEmpty] = useState(false);
//   const [user, setUser] = useState(token.user);
//   const [detailMe, setDetailMe] = useState();

//   const [filter, setFilter] = useState({
//     serial: "",
//     tec: "",
//     eng: "",
//     trm: "",
//     lda: "",
//     sta: "",
//   });

//   const [CRUDme, setCRUDme] = useState();

//   const fetchData = async () => {
//     try {
//       const query = Object.entries(filter)
//         .map((x) => (x[1] ? x.join("=") : ""))
//         .reduce((acc, cur) => (cur ? `${acc}${acc ? "&" : ""}${cur}` : acc));

//       const response = await axios.get(`${API_URL}machines/${query ? "?" + query : ""}`, {
//         headers: {
//           Authorization: `Bearer ${token.access}`,
//         },
//       });
//       setData(response.data);
//       setIsEmpty(response.data.length === 0);
//     } catch (error) {
//       console.error("Error fetching machines data:", error);
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

//   const handlerCRUD = (e) => {
//     e.stopPropagation();
//     setCRUDme({
//       table: "machines",
//       action: e.target.getAttribute("id"),
//     });
//   };

//   return (
//     <>
//       <FilterPanel filter={filter} setFilter={setFilter} />
//       <div className="client-info__table-container">
//         <table className="client-info__table">
//           <thead>
//             <tr>
//               {token.user.role === "m" ? (
//                 <th style={{ width: "36px", padding: "0px" }}>
//                   <img id={"C"} className="CRUD" src={"./images/C.png"} alt="C" onClick={handlerCRUD} />
//                 </th>
//               ) : null}
//               <th style={{ width: "120px" }}></th>
//               <th style={{ width: "150px" }}>техника</th>
//               <th style={{ width: "150px" }}>двигатель</th>
//               <th style={{ width: "150px" }}>трансмиссия</th>
//               <th style={{ width: "150px" }}>ведущий мост</th>
//               <th style={{ width: "150px" }}>управляемый мост</th>
//               <th style={{ width: "150px" }}>договор поставки</th>
//               <th style={{ width: "150px" }}>дата отгрузки</th>
//               <th style={{ width: "150px" }}>грузополучатель</th>
//               <th style={{ width: "150px" }}>адрес поставки</th>
//               <th style={{ width: "300px" }}>комплектация</th>
//               {["m", "s"].indexOf(user.role) != -1 ? <th style={{ width: "150px" }}>клиент</th> : null}
//               {["m", "c"].indexOf(user.role) != -1 ? <th style={{ width: "200px" }}>сервисная компания</th> : null}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((machine) => (
//               <tr id={"machine-" + machine.id} key={machine.id} onClick={handlerSelect}>
//                 {token.user.role === "m" ? (
//                   <th style={{ padding: "0px" }}>
//                     <img id={"U-" + machine.id} className="CRUD" src={"./images/U.png"} alt="U" onClick={handlerCRUD} />
//                     <img id={"D-" + machine.id} className="CRUD" src={"./images/D.png"} alt="D" onClick={handlerCRUD} />
//                   </th>
//                 ) : null}
//                 <th>
//                   <Cell model="модель" serial="серийный №" />
//                 </th>
//                 <td>
//                   <Cell model={machine.model_name} serial={machine.serial} />
//                 </td>
//                 <td>
//                   <Cell model={machine.engine_model_name} serial={machine.engine_serial} />
//                 </td>
//                 <td>
//                   <Cell model={machine.transmission_model_name} serial={machine.transmission_serial} />
//                 </td>
//                 <td>
//                   <Cell model={machine.leading_axle_model_name} serial={machine.leading_axle_serial} />
//                 </td>
//                 <td>
//                   <Cell model={machine.steerable_axle_model_name} serial={machine.steerable_axle_serial} />
//                 </td>
//                 <td>{machine.supply_contract}</td>
//                 <td>{machine.shipment_date}</td>
//                 <td className="capacity">{machine.consumer}</td>
//                 <td className="capacity">{machine.delivery_address}</td>
//                 <td className={"capacity display-linebreak"}>
//                   <div>{machine.equipment}</div>
//                 </td>
//                 {["m", "s"].indexOf(user.role) != -1 ? <td className="capacity">{machine.client_name}</td> : null}
//                 {["m", "c"].indexOf(user.role) != -1 ? <td className="capacity">{machine.service_company_name}</td> : null}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {isEmpty && <h3>Данных о машине с таким заводским номером нет в системе.</h3>}
//       {detailMe && <CommonDetails id={detailMe} setId={setDetailMe} />}
//       {CRUDme && <DialogCRUD param={CRUDme} setParam={setCRUDme} />}
//     </>
//   );
// };

// export default Common;
