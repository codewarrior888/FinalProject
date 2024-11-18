import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Equipment from "../TableTabs/Equipment";
import Maintenance from "../TableTabs/Maintenance";
import Claim from "../TableTabs/Claim";
import RoleLabel from "../Authenticate/RoleLabel";
import "../../styles/MainAuthenticated.scss";

const MainAuthenticated = () => {
  return (
    <div className="main-authenticated">
      <div className="main-authenticated__container">
        <Tabs>
          <div className="tabs-container">
            <TabList>
              <Tab>Общая информация</Tab>
              <Tab>ТО</Tab>
              <Tab>Рекламации</Tab>
            </TabList>

            <div className="tab-content">
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
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MainAuthenticated;
