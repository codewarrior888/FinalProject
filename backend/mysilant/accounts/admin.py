from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'role', 'company_name', 'first_name', 'last_name', 'is_active',]
    
    # Add user
    add_fieldsets = (
        *UserAdmin.add_fieldsets,
        (
            None,
            {
                'fields': ('role', 'company_name',)
            }
        )
    )
    
    # Edit user
    fieldsets = (
        *UserAdmin.fieldsets,
        (
            None,
            {
                'fields': ('role', 'company_name',)
            }
        )
    )
