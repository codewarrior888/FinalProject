import django_filters
from .models import Equipment, Maintenance, Claim
from django_filters import rest_framework as filters

class EquipmentFilter(django_filters.FilterSet):
    equipment_model = filters.CharFilter(field_name='equipment_model', lookup_expr='exact')
    engine_model = filters.CharFilter(field_name='engine_model', lookup_expr='exact')
    transmission_model = filters.CharFilter(field_name='transmission_model', lookup_expr='exact')
    drive_axle_model = filters.CharFilter(field_name='drive_axle_model', lookup_expr='exact')
    steer_axle_model = filters.CharFilter(field_name='steer_axle_model', lookup_expr='exact')

    class Meta:
        model = Equipment
        fields = ['equipment_model', 'engine_model', 'transmission_model', 'drive_axle_model', 'steer_axle_model']

class MaintenanceFilter(filters.FilterSet):
    equipment_serial = filters.CharFilter(field_name='equipment_serial', lookup_expr='exact')
    maintenance_type = filters.CharFilter(field_name='maintenance_type', lookup_expr='exact')
    service_company = filters.CharFilter(field_name='service_company', lookup_expr='exact')

    class Meta:
        model = Maintenance
        fields = ['maintenance_type', 'service_company', 'equipment__equipment_serial']

class ClaimFilter(filters.FilterSet):
    failure_node = filters.CharFilter(field_name='failure_node', lookup_expr='exact')
    repair_method = filters.CharFilter(field_name='repair_method', lookup_expr='exact')
    service_company = filters.CharFilter(field_name='service_company', lookup_expr='exact')

    class Meta:
        model = Claim
        fields = ['failure_node', 'repair_method', 'service_company']