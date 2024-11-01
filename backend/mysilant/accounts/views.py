from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from drf_spectacular.utils import OpenApiExample, extend_schema
from rest_framework.views import APIView
from rest_framework import status, mixins, viewsets
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.permissions import IsManager
from django_filters import rest_framework as django_filters

from .models import User
from .serializers import UserSerializer, UserLoginSerializer
from .filters import UserFilter


@extend_schema(
    tags=['Authentication'],
    summary="User login",
    methods=("POST",),
    description="Authenticate user and issue JWT tokens",
    request=UserLoginSerializer,
    responses=UserSerializer,
    examples=[
        OpenApiExample(
            "Example 1",
            value={"username": "user", "password": "password"},
            request_only=True,
            response_only=False,
        ),
    ],
)
class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            password = serializer.validated_data.get('password')
            
            user = authenticate(username=username, password=password)
            if user is None:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            
            # Generate only an access token for the user
            access_token = AccessToken.for_user(user)

            # Serialize the user
            user_data = UserSerializer(user).data
            
            return Response({
                'access': str(access_token),
                'message': 'Logged in successfully',
                'user': user_data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=['Authentication'],
    summary="User logout",
    methods=("POST",),
    description="Log out user",
    examples=[
        OpenApiExample(
            "Example 1",
            value={},  # No request body needed
            request_only=True,
            response_only=False,
        ),
    ],
)
class LogoutAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logout(request)
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)


class UserViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = (django_filters.DjangoFilterBackend,)
    filterset_class = UserFilter
    permission_classes = [IsManager]