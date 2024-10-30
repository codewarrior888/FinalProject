from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import User


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('username', 'role', 'company_name', 'first_name', 'last_name', 'is_active',)
        

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ('username', 'role', 'company_name', 'first_name', 'last_name', 'is_active',)