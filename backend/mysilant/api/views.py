from rest_framework import viewsets, filters
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Reference, Equipment, Maintenance, Claim
from .serializers import ReferenceSerializer, EquipmentSerializer, MaintenanceSerializer, ClaimSerializer, LimitedEquipmentSerializer
from .permissions import IsManager, IsServiceCompany, IsClient, IsGuest
from .filters import EquipmentFilter, MaintenanceFilter, ClaimFilter

from django.core.exceptions import ValidationError
import logging

logger = logging.getLogger(__name__)


class ReferenceViewSet(viewsets.ModelViewSet):
    queryset = Reference.objects.all()
    serializer_class = ReferenceSerializer
    permission_classes = [IsAuthenticated]  # You can adjust permissions as needed

    def get_queryset(self):
        category = self.request.query_params.get('category', None)

        if category and category not in Reference.TYPE_CHOICES:
            raise ValidationError("Invalid category value.")
        if category:
            return self.queryset.filter(category=category)
        return self.queryset
    

class EquipmentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated | IsGuest | IsClient | IsServiceCompany | IsManager]
    queryset = Equipment.objects.all().order_by('shipment_date')
    serializer_class = EquipmentSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = EquipmentFilter
    lookup_field = 'equipment_serial'

    def get_object(self):
        lookup_value = self.kwargs[self.lookup_field]
        return Equipment.objects.get(equipment_serial=lookup_value)

    # def update(self, request, *args, **kwargs):
    #     partial = kwargs.pop('partial', False)
    #     instance = self.get_object()
    #     serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
    #     # Add logging to inspect validated data
    #     if serializer.is_valid():
    #         logger.debug(f"Validated data for update: {serializer.validated_data}")
    #         self.perform_update(serializer)
    #         return Response(serializer.data)
    #     else:
    #         logger.error(f"Validation errors: {serializer.errors}")
    #         return Response(serializer.errors, status=400)

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


class ClaimViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated | IsClient | IsServiceCompany | IsManager]
    queryset = Claim.objects.all().order_by('failure_date') #сортировка по умолчанию по дате отказа
    serializer_class = ClaimSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = ClaimFilter
