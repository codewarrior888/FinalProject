from rest_framework import permissions

class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser or request.user.role == 'mn'

class IsServiceCompany(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'sc'

class IsClient(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'cl'