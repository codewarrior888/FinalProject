from rest_framework import permissions

class IsGuest(permissions.BasePermission):
    """
    Permission for Guest users to only access limited Equipment information.
    """
    def has_permission(self, request, view):
        return request.user.is_anonymous or request.user.role == 'gt'

class IsClient(permissions.BasePermission):
    """
    Permission for Client users to:
    - Read Equipment and Claim information
    - Read and edit (add or delete) Maintenance information
    """
    def has_permission(self, request, view):
        if request.user.role == 'cl':
            if view.basename == 'equipment' or view.basename == 'claim':
                return request.method in permissions.SAFE_METHODS  # Only read access
            elif view.basename == 'maintenance':
                return True  # Read and write access
        return False

class IsServiceCompany(permissions.BasePermission):
    """
    Permission for Service Company users to:
    - Read Equipment information
    - Read and edit (add or delete) Maintenance and Claim information
    """
    def has_permission(self, request, view):
        if request.user.role == 'sc':
            if view.basename == 'equipment':
                return request.method in permissions.SAFE_METHODS  # Only read access
            elif view.basename in ['maintenance', 'claim']:
                return True  # Read and write access
        return False

class IsManager(permissions.BasePermission):
    """
    Permission for Manager users and superuser (admin) to read and edit all information.
    """
    def has_permission(self, request, view):
        return request.user.is_superuser or request.user.role == 'mn'