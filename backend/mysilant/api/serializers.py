from rest_framework import serializers
from .models import Reference, Equipment, Maintenance, Claim


class ReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reference
        fields = [ 'id', 'category', 'name', 'description']

class EquipmentSerializer(serializers.ModelSerializer):
    equipment_model_name = serializers.CharField(source='equipment_model.name', read_only=True)
    equipment_model_description = serializers.CharField(source='equipment_model.description', read_only=True)
    engine_model_name = serializers.CharField(source='engine_model.name', read_only=True)
    engine_model_description = serializers.CharField(source='engine_model.description', read_only=True)
    transmission_model_name = serializers.CharField(source='transmission_model.name', read_only=True)
    transmission_model_description = serializers.CharField(source='transmission_model.description', read_only=True)
    drive_axle_model_name = serializers.CharField(source='drive_axle_model.name', read_only=True)
    drive_axle_model_description = serializers.CharField(source='drive_axle_model.description', read_only=True)
    steer_axle_model_name = serializers.CharField(source='steer_axle_model.name', read_only=True)
    steer_axle_model_description = serializers.CharField(source='steer_axle_model.description', read_only=True)

    class Meta:
        model = Equipment
        fields = [
            'equipment_model_name', 'equipment_model_description', 'equipment_serial',
            'engine_model_name', 'engine_model_description', 'engine_serial',
            'transmission_model_name', 'transmission_model_description', 'transmission_serial',
            'drive_axle_model_name', 'drive_axle_model_description', 'drive_axle_serial',
            'steer_axle_model_name', 'steer_axle_model_description', 'steer_axle_serial',
            'contract', 'shipment_date', 'consignee', 'delivery_address', 'model_options',
            'client', 'service_company'
        ]


class LimitedEquipmentSerializer(serializers.ModelSerializer):
    equipment_model_name = serializers.CharField(source='equipment_model.name', read_only=True)
    equipment_model_description = serializers.CharField(source='equipment_model.description', read_only=True)
    engine_model_name = serializers.CharField(source='engine_model.name', read_only=True)
    engine_model_description = serializers.CharField(source='engine_model.description', read_only=True)
    transmission_model_name = serializers.CharField(source='transmission_model.name', read_only=True)
    transmission_model_description = serializers.CharField(source='transmission_model.description', read_only=True)
    drive_axle_model_name = serializers.CharField(source='drive_axle_model.name', read_only=True)
    drive_axle_model_description = serializers.CharField(source='drive_axle_model.description', read_only=True)
    steer_axle_model_name = serializers.CharField(source='steer_axle_model.name', read_only=True)
    steer_axle_model_description = serializers.CharField(source='steer_axle_model.description', read_only=True)

    class Meta:
        model = Equipment
        fields = [
            'equipment_model_name', 'equipment_model_description', 'equipment_serial',
            'engine_model_name', 'engine_model_description', 'engine_serial',
            'transmission_model_name', 'transmission_model_description', 'transmission_serial',
            'drive_axle_model_name', 'drive_axle_model_description', 'drive_axle_serial',
            'steer_axle_model_name', 'steer_axle_model_description', 'steer_axle_serial'
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