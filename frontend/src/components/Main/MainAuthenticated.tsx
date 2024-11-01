import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useAuth } from "../Authenticate/useAuth";
import "../../styles/MainAuthenticated.scss";

const Main = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="client-info">
      <div className="client-info__container">
        <Tabs>
          <TabList>
            <Tab>Общая информация</Tab>
            <Tab>ТО</Tab>
            <Tab>Рекламации</Tab>
          </TabList>

          <TabPanel>
            <h3>Информация о комплектации и технических характеристиках Вашей техники</h3>
            {/* <Common /> */}
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

export default Main;
