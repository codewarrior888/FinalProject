from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Equipment, Maintenance, Claim
from .serializers import EquipmentSerializer, MaintenanceSerializer, ClaimSerializer
from .permissions import IsManager, IsServiceCompany, IsClient
from .filters import EquipmentFilter, MaintenanceFilter, ClaimFilter

class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all().order_by('shipment_date') #сортировка по умолчанию по дате отгрузки
    serializer_class = EquipmentSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = EquipmentFilter
    ordering_fields = ['shipment_date']

class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = Maintenance.objects.all().order_by('maintenance_date') #сортировка по умолчанию по дате ТО
    serializer_class = MaintenanceSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = MaintenanceFilter
    ordering_fields = ['maintenance_date']

    def get_permissions(self):
        if self.request.user.role == 'mn':
            return [IsManager()]
        elif self.request.user.role == 'cl':
            return [IsClient()]
        elif self.request.user.role == 'sc':
            return [IsServiceCompany()]
        return super().get_permissions()

class ClaimViewSet(viewsets.ModelViewSet):
    queryset = Claim.objects.all().order_by('failure_date') #сортировка по умолчанию по дате отказа
    serializer_class = ClaimSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = ClaimFilter
    ordering_fields = ['failure_date']

    def get_permissions(self):
        if self.request.user.role == 'mn':
            return [IsManager()]
        elif self.request.user.role == 'sc':
            return [IsServiceCompany()]
        return super().get_permissions()