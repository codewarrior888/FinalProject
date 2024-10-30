from rest_framework import serializers
from .models import Reference, Equipment, Maintenance, Claim


class ReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reference
        fields = [ 'id', 'category', 'name', 'description']

class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = [
            'id', 'equipment_model', 'equipment_serial', 'engine_model', 'engine_serial',
            'transmission_model', 'transmission_serial', 'drive_axle_model', 'drive_axle_serial',
            'steer_axle_model', 'steer_axle_serial', 'contract', 'shipment_date',
            'consignee', 'delivery_address', 'model_options', 'client', 'service_company'
        ]

class MaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maintenance
        fields = [
            'id', 'equipment', 'maintenance_type', 'maintenance_date', 'engine_hours', 
            'order_number', 'order_date', 'service_company'
        ]

class ClaimSerializer(serializers.ModelSerializer):
    class Meta:
        model = Claim
        fields = [
            'id', 'equipment', 'failure_date', 'engine_hours', 'failure_node', 'failure_description', 
            'repair_method', 'spare_parts', 'repair_date', 'downtime', 'service_company'
        ]