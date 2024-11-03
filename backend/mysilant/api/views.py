from rest_framework import viewsets, filters
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Equipment, Maintenance, Claim
from .serializers import EquipmentSerializer, MaintenanceSerializer, ClaimSerializer, LimitedEquipmentSerializer
from .permissions import IsManager, IsServiceCompany, IsClient, IsGuest
from .filters import EquipmentFilter, MaintenanceFilter, ClaimFilter

class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all().order_by('shipment_date')
    serializer_class = EquipmentSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = EquipmentFilter
    # ordering_fields = ['shipment_date']

    # @action(detail=False, methods=['get'], permission_classes=[IsGuest], url_path='public')
    # def public(self, request):
    #     limited_queryset = Equipment.objects.all().order_by('equipment_model')
    #     serializer = LimitedEquipmentSerializer(limited_queryset, many=True)
    #     return Response(serializer.data)

    # def get_permissions(self):
    #     if not self.request.user.is_authenticated:
    #         # Ensure only public endpoint is accessible by guests
    #         if self.action == 'public':
    #             return [IsGuest()]
    #         # Otherwise, restrict access completely
    #         return [IsAuthenticated()]
    #     # Set permissions based on authenticated user role
    #     if self.request.user.role == 'mn' or self.request.user.is_superuser:
    #         return [IsManager()]
    #     elif self.request.user.role == 'cl':
    #         return [IsClient()]
    #     elif self.request.user.role == 'sc':
    #         return [IsServiceCompany()]
    #     return [IsAuthenticated()]  # Default permission for authenticated users
    
    def get_permissions(self):
        # Public access for unauthenticated users
        if self.action == 'public':
            return [IsGuest()]
        # Role-based permissions for authenticated users
        user = self.request.user
        if user.is_authenticated:
            if user.role == 'mn' or user.is_superuser:
                return [IsManager()]
            elif user.role == 'cl':
                return [IsClient()]
            elif user.role == 'sc':
                return [IsServiceCompany()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['get'], permission_classes=[AllowAny], url_path='public')
    def public(self, request):
        queryset = Equipment.objects.all().order_by('equipment_model')
        serializer = LimitedEquipmentSerializer(queryset, many=True)
        return Response(serializer.data)


class MaintenanceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Maintenance.objects.all().order_by('maintenance_date') #сортировка по умолчанию по дате ТО
    serializer_class = MaintenanceSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = MaintenanceFilter
    # ordering_fields = ['maintenance_date']

    def get_permissions(self):
        if self.request.user.is_authenticated:
            if self.request.user.role == 'mn' or self.request.user.is_superuser:
                return [IsManager()]
            elif self.request.user.role == 'cl':
                return [IsClient()]
            elif self.request.user.role == 'sc':
                return [IsServiceCompany()]
        return [IsGuest()]  # Guest access for unauthenticated users

class ClaimViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Claim.objects.all().order_by('failure_date') #сортировка по умолчанию по дате отказа
    serializer_class = ClaimSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = ClaimFilter
    # ordering_fields = ['failure_date']

    def get_permissions(self):
        if self.request.user.is_authenticated:
            if self.request.user.role == 'mn' or self.request.user.is_superuser:
                return [IsManager()]
            elif self.request.user.role == 'cl':
                return [IsClient()]
            elif self.request.user.role == 'sc':
                return [IsServiceCompany()]
        return [IsGuest()]  # Guest access for unauthenticated users