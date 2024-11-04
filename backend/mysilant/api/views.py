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
    permission_classes = [IsAuthenticated | IsGuest | IsClient | IsServiceCompany | IsManager]
    queryset = Equipment.objects.all().order_by('shipment_date')
    serializer_class = EquipmentSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = EquipmentFilter
    lookup_field = 'equipment_serial'

    # Ensure that 'equipment_serial' is used in all lookup-based actions
    def get_object(self):
        lookup_value = self.kwargs[self.lookup_field]
        return Equipment.objects.get(equipment_serial=lookup_value)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny], url_path='public')
    def public(self, request):
        queryset = Equipment.objects.all().order_by('equipment_model')
        serializer = LimitedEquipmentSerializer(queryset, many=True)
        return Response(serializer.data)


class MaintenanceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated | IsClient | IsServiceCompany | IsManager]
    queryset = Maintenance.objects.all().order_by('maintenance_date') #сортировка по умолчанию по дате ТО
    serializer_class = MaintenanceSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = MaintenanceFilter
    # ordering_fields = ['maintenance_date']

class ClaimViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated | IsClient | IsServiceCompany | IsManager]
    queryset = Claim.objects.all().order_by('failure_date') #сортировка по умолчанию по дате отказа
    serializer_class = ClaimSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = ClaimFilter
    # ordering_fields = ['failure_date']
