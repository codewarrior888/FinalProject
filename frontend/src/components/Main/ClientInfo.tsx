// import React, { useState } from "react";
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// import { useAuth } from "../../../hook/useAuth";
// import Common from "./Common/Common.jsx";
// import Maintenance from "./Maintenance/Maintenance.jsx";
// import Claim from "./Claim/Claim.jsx";
// import "./ClientInfo.css";

// const ClientInfo = ({ tabIndex, setTabIndex }) => {
//   const { token } = useAuth();
//   const [user, setUser] = useState(token.user);

//   const roles = {
//     c: "Клиент",
//     m: "Менеджер",
//     s: "Сервисная компания",
//   };

//   return (
//     <div className="client-info">
//       <h1>
//         {user.company_name ? user.company_name : `${user.first_name} ${user.last_name}`} \ {roles[user.role]}
//       </h1>
//       <div className="client-info__container">
//         <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
//           <TabList>
//             <Tab>Общая информация</Tab>
//             <Tab>ТО</Tab>
//             <Tab>Рекламации</Tab>
//           </TabList>

//           <TabPanel>
//             <h3>Информация о комплектации и технических характеристиках Вашей техники</h3>
//             <Common />
//           </TabPanel>
//           <TabPanel>
//             <h3>Информация о проведенных ТО Вашей техники</h3>
//             <Maintenance />
//           </TabPanel>
//           <TabPanel>
//             <h3>Информация о рекламациях Вашей техники</h3>
//             <Claim />
//           </TabPanel>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default ClientInfo;
