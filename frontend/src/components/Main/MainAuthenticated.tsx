import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useAuth } from "../Authenticate/useAuth";
import "../../styles/MainAuthenticated.scss";
import Equipment from "../Equipment/Equipment";

const MainAuthenticated = () => {
  const { userInfo } = useAuth();

  const roleLabels = {
    cl: "Клиент",
    sc: "Сервисная компания",
    mn: "Менеджер",
  };

  return (
    <div className="client-info">
      <div className="client-info__container">
        <h1>
        Аккаунт: {userInfo?.company_name? `${userInfo?.company_name}` : `${userInfo?.first_name} ${userInfo?.last_name}` || "Неизвестный пользователь"} | {roleLabels[userInfo?.role]}
        </h1>
        <Tabs>
          <TabList>
            <Tab>Общая информация</Tab>
            <Tab>ТО</Tab>
            <Tab>Рекламации</Tab>
          </TabList>

          <TabPanel>
            <h3>Информация о комплектации и технических характеристиках Вашей техники</h3>
            <Equipment />
          </TabPanel>
          <TabPanel>
            <h3>Информация о проведенных ТО Вашей техники</h3>
            {/* <Maintenance /> */}
          </TabPanel>
          <TabPanel>
            <h3>Информация о рекламациях Вашей техники</h3>
            {/* <Claim /> */}
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default MainAuthenticated;
