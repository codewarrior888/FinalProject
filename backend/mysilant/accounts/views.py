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


class LoginAPIView(APIView):
    """
    API для входа пользователя с генерацией JWT токенов.
    """
    permission_classes = [AllowAny]

    @extend_schema(
        tags=['Аутентификация'],
        summary="Вход пользователя",
        methods=("POST",),
        description="Аутентификация пользователя и выдача токенов JWT.",
        request=UserLoginSerializer,
        responses={
            200: UserSerializer,
            401: {"description": "Неверные учетные данные"},
            400: {"description": "Ошибка валидации данных"},
        },
        examples=[
            OpenApiExample(
                "Пример запроса",
                value={"username": "user", "password": "password"},
                request_only=True,
                response_only=False,
            ),
        ],
    )

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            password = serializer.validated_data.get('password')
            
            user = authenticate(username=username, password=password)
            if user is None:
                return Response({'error': 'Неверные учетные данные'}, status=status.HTTP_401_UNAUTHORIZED)
            
            # Generate only an access token for the user
            access_token = AccessToken.for_user(user)

            # Serialize the user
            user_data = UserSerializer(user).data
            
            return Response({
                'access': str(access_token),
                'message': 'Вы успешно вошли в систему',
                'user': user_data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    request=None,
    responses={
        200: {
            "type": "object",
            "properties": {
                "message": {"type": "string", "example": "Вы успешно вышли из системы"},
            },
        }
    },
)
class LogoutAPIView(APIView):
    """
    API для выхода пользователя с аннулированием токенов.
    """
    permission_classes = [AllowAny]

    @extend_schema(
        tags=['Аутентификация'],
        summary="Выход пользователя",
        methods=("POST",),
        description="Выход пользователя",
        examples=[
            OpenApiExample(
                "Пример запроса",
                value={},  # Тело запроса не нужно
                request_only=True,
                response_only=False,
            ),
        ],
    )

    def post(self, request):
        logout(request)
        return Response({'message': 'Вы успешно вышли из системы'}, status=status.HTTP_200_OK)


class UserViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    API для управления пользователями (доступно только для менеджеров).
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = (django_filters.DjangoFilterBackend,)
    filterset_class = UserFilter
    permission_classes = [IsManager]