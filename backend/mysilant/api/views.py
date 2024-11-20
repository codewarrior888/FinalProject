from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import OpenApiParameter, OpenApiTypes, extend_schema_view, extend_schema
from .models import Reference, Equipment, Maintenance, Claim
from .serializers import ReferenceSerializer, EquipmentSerializer, MaintenanceSerializer, ClaimSerializer, LimitedEquipmentSerializer
from .permissions import IsManager, IsServiceCompany, IsClient, IsGuest
from .filters import EquipmentFilter, MaintenanceFilter, ClaimFilter

from django.core.exceptions import ValidationError


@extend_schema(tags=['Справочники'])
@extend_schema_view(
    list=extend_schema(
        summary='Список справочников',
        parameters=[
            OpenApiParameter(name='category', location=OpenApiParameter.QUERY, type=OpenApiTypes.STR, description='Категория справочника', enum=[choice[0] for choice in Reference.TYPE_CHOICES]),
        ]
    ),
    retrieve=extend_schema(
        summary='Детальная информация о справочнике',
    )
)
class ReferenceViewSet(viewsets.ModelViewSet):
    queryset = Reference.objects.all()
    serializer_class = ReferenceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        category = self.request.query_params.get('category', None)

        if category and category not in Reference.TYPE_CHOICES:
            raise ValidationError("Invalid category value.")
        if category:
            return self.queryset.filter(category=category)
        return self.queryset
    

@extend_schema(tags=['Техника'])
@extend_schema_view(
    list=extend_schema(
        summary='Список техники',
        parameters=[
            OpenApiParameter(name='equipment_serial', location=OpenApiParameter.QUERY, type=OpenApiTypes.STR, description='Заводской номер'),
            OpenApiParameter(name='equipment_model', location=OpenApiParameter.QUERY, type=OpenApiTypes.STR, description='Модель техники'),
        ]
    ),
    retrieve=extend_schema(
        summary='Детальная информация о технике',
    )
)
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

    @action(detail=False, methods=['get'], permission_classes=[AllowAny], url_path='public')
    @extend_schema(summary='Публичный список техники')
    def public(self, request):
        queryset = Equipment.objects.all().order_by('equipment_model')
        serializer = LimitedEquipmentSerializer(queryset, many=True)
        return Response(serializer.data)


@extend_schema(tags=['Техобслуживание'])
@extend_schema_view(
    list=extend_schema(
        summary='Список ТО',
        parameters=[
            OpenApiParameter(name='equipment_serial', location=OpenApiParameter.QUERY, type=OpenApiTypes.STR, description='Зав. номер техники'),
            OpenApiParameter(name='maintenance_type', location=OpenApiParameter.QUERY, type=OpenApiTypes.INT, description='Тип ТО'),
        ]
    ),
    retrieve=extend_schema(
        summary='Детальная информация о ТО',
    )
)
class MaintenanceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated | IsClient | IsServiceCompany | IsManager]
    queryset = Maintenance.objects.all().order_by('maintenance_date') #сортировка по умолчанию по дате ТО
    serializer_class = MaintenanceSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = MaintenanceFilter


@extend_schema(tags=['Рекламации'])
@extend_schema_view(
    list=extend_schema(
        summary='Список рекламаций',
        parameters=[
            OpenApiParameter(name='equipment_serial', location=OpenApiParameter.QUERY, type=OpenApiTypes.STR, description='Зав. номер техники'),
            OpenApiParameter(name='failure_node', location=OpenApiParameter.QUERY, type=OpenApiTypes.INT, description='Узел отказа'),
            OpenApiParameter(name='repair_method', location=OpenApiParameter.QUERY, type=OpenApiTypes.INT, description='Способ восстановления'),
        ]
    ),
    retrieve=extend_schema(
        summary='Детальная информация о рекламации',
    )
)
class ClaimViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated | IsClient | IsServiceCompany | IsManager]
    queryset = Claim.objects.all().order_by('failure_date') #сортировка по умолчанию по дате отказа
    serializer_class = ClaimSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = ClaimFilter
