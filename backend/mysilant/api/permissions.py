from rest_framework import permissions

class IsGuest(permissions.BasePermission):
    """
    Ограниченный доступ для неавторизованных пользователей
    """
    def has_permission(self, request, view):
        return (
            request.user.is_anonymous or request.user.role == 'gt' # Ограниченный доступ (только чтение страница гостя)
        ) and view.basename == 'equipment' and request.method in permissions.SAFE_METHODS

class IsClient(permissions.BasePermission):
    """
    Доступ только для клиентов
    - Просмотр информации о Технике и Рекламациях
    - Просмотр и редактирование ТО
    """
    def has_permission(self, request, view):
        if request.user.role == 'cl':
            if view.basename in ['equipment', 'claims']:
                return request.method in permissions.SAFE_METHODS  # Ограниченный доступ (только чтение)
            elif view.basename == 'maintenance':
                return True  # Полный доступ (чтение и запись)
        return False

class IsServiceCompany(permissions.BasePermission):
    """
    Доступ только для сервисных компаний
    - Просмотр информации о Технике
    - Просмотр и редактирование ТО и Рекламаций
    """
    def has_permission(self, request, view):
        if request.user.role == 'sc':
            if view.basename == 'equipment':
                return request.method in permissions.SAFE_METHODS  # Ограниченный доступ (только чтение)
            elif view.basename in ['maintenance', 'claims']:
                return True  # Полный доступ (чтение и запись)
        return False

class IsManager(permissions.BasePermission):
    """
    Доступ для менеджеров и суперпользователя
    - Просмотр и редактирование любой информации в Технике, ТО и Рекламациях
    """
    def has_permission(self, request, view):
        return request.user.is_superuser or request.user.role == 'mn' # Полный доступ
    