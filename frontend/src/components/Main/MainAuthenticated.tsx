import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useAuth } from "../Authenticate/useAuth";
import "../../styles/MainAuthenticated.scss";
import Equipment from "../TableTabs/Equipment";
import Maintenance from "../TableTabs/Maintenance";
import Claim from "../TableTabs/Claim";
import RoleLabel from "../Authenticate/RoleLabel";

const MainAuthenticated = () => {
  return (
    <div className="main-authenticated">
      <div className="main-authenticated__container">
        <Tabs>
          <TabList>
            <Tab>Общая информация</Tab>
            <Tab>ТО</Tab>
            <Tab>Рекламации</Tab>
          </TabList>

          <TabPanel>
            <RoleLabel />
            <Equipment />
          </TabPanel>

          <TabPanel>
            <RoleLabel />
            <Maintenance />
          </TabPanel>
          <TabPanel>
            <RoleLabel />
            <Claim />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default MainAuthenticated;
