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

class EquipmentPublicView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        equipment = Equipment.objects.all()
        serializer = LimitedEquipmentSerializer(equipment, many=True)
        return Response(serializer.data)

class EquipmentViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Equipment.objects.all().order_by('shipment_date') #сортировка по умолчанию по дате отгрузки
    serializer_class = EquipmentSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = EquipmentFilter
    ordering_fields = ['shipment_date']

    @action(detail=False, methods=['get'], permission_classes=[IsGuest], url_path='public')
    def public(self, request):
        # Filter to return only the limited information for unauthenticated users
        limited_queryset = Equipment.objects.values(
            'equipment_model', 'equipment_serial', 'engine_model', 
            'engine_serial', 'transmission_model', 'transmission_serial',
            'drive_axle_model', 'drive_axle_serial', 'steer_axle_model', 
            'steer_axle_serial'
        )
        return Response(limited_queryset)

    def get_permissions(self):
        if self.request.user.is_authenticated:
            if self.request.user.role == 'mn' or self.request.user.is_superuser:
                return [IsManager()]
            elif self.request.user.role == 'cl':
                return [IsClient()]
            elif self.request.user.role == 'sc':
                return [IsServiceCompany()]
        return [IsGuest()]  # Guest access for unauthenticated users


class MaintenanceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Maintenance.objects.all().order_by('maintenance_date') #сортировка по умолчанию по дате ТО
    serializer_class = MaintenanceSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = MaintenanceFilter
    ordering_fields = ['maintenance_date']

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
    ordering_fields = ['failure_date']

    def get_permissions(self):
        if self.request.user.is_authenticated:
            if self.request.user.role == 'mn' or self.request.user.is_superuser:
                return [IsManager()]
            elif self.request.user.role == 'cl':
                return [IsClient()]
            elif self.request.user.role == 'sc':
                return [IsServiceCompany()]
        return [IsGuest()]  # Guest access for unauthenticated users