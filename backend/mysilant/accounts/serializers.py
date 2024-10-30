from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'company_name', 'first_name', 'last_name', 'role']


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        if not data.get('username') or not data.get('password'):
            raise serializers.ValidationError("Both username and password are required.")
        return data
    class Meta:
        model = User
        fields = ['username', 'password']


class UserLogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    
    def validate(self, data):
        return data


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        return token