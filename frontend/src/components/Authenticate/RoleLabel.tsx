import { useAuth } from "./useAuth";
import '../../styles/RoleLabel.scss';

const RoleLabel = () => {
  const { userInfo, isAuthenticated } = useAuth();
  const roleLabels = {
    cl: "Клиент",
    sc: "Сервисная компания",
    mn: "Менеджер",
    gt: "Гость",
  };

  return (
    <>
      <h2 className="role-label">
        {isAuthenticated
          ? `${roleLabels[userInfo?.role]}: ${userInfo?.company_name
              ? `${userInfo?.company_name}`
              : `${userInfo?.first_name} ${userInfo?.last_name}` ||
            "Неизвестный пользователь"}`
          : `Добро пожаловать, ${roleLabels.gt}!`}
      </h2>
    </>
  );
};

export default RoleLabel;

