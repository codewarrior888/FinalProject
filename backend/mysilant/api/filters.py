from django_filters import rest_framework as filters
from .models import Equipment, Maintenance, Claim

class EquipmentFilter(filters.FilterSet):
    class Meta:
        model = Equipment
        fields = ['equipment_model', 'engine_model', 'transmission_model', 'drive_axle_model', 'steer_axle_model']

class MaintenanceFilter(filters.FilterSet):
    class Meta:
        model = Maintenance
        fields = ['maintenance_type', 'service_company', 'equipment__equipment_serial']

class ClaimFilter(filters.FilterSet):
    class Meta:
        model = Claim
        fields = ['failure_node', 'repair_method', 'service_company']