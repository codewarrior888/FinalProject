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
    client_name = serializers.CharField(source='client.company_name', read_only=True)
    service_company_name = serializers.CharField(source='service_company.company_name', read_only=True)
    model_options_preview = serializers.SerializerMethodField()
    class Meta:
        model = Equipment
        fields = [
            'equipment_model_name', 'equipment_model_description', 'equipment_serial',
            'engine_model_name', 'engine_model_description', 'engine_serial',
            'transmission_model_name', 'transmission_model_description', 'transmission_serial',
            'drive_axle_model_name', 'drive_axle_model_description', 'drive_axle_serial',
            'steer_axle_model_name', 'steer_axle_model_description', 'steer_axle_serial',
            'contract', 'shipment_date', 'consignee', 'delivery_address', 'model_options',
            'model_options_preview', 'client_name', 'service_company_name'
        ]
    
    def get_model_options_preview(self, obj):
        if obj.model_options and len(obj.model_options) > 25:
            return f'{obj.model_options[:25]}...'
        return obj.model_options


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
    equipment_model_name = serializers.CharField(source='equipment.equipment_model.name', read_only=True)
    equipment_serial = serializers.CharField(source='equipment.equipment_serial', read_only=True)  # Add this if you need the serial
    maintenance_type_name = serializers.CharField(source='maintenance_type.name', read_only=True)
    service_company_name = serializers.CharField(source='service_company.company_name', read_only=True)

    class Meta:
        model = Maintenance
        fields = [
            'id', 'equipment_model_name', 'equipment_serial', 'maintenance_type', 
            'maintenance_type_name', 'maintenance_date', 'engine_hours', 'order_number', 
            'order_date', 'service_company', 'service_company_name'
        ]

class ClaimSerializer(serializers.ModelSerializer):
    equipment_model_name = serializers.CharField(source='equipment.equipment_model.name', read_only=True)
    equipment_serial = serializers.CharField(source='equipment.equipment_serial', read_only=True)
    service_company_name = serializers.CharField(source='service_company.company_name', read_only=True)
    failure_node_name = serializers.CharField(source='failure_node.name', read_only=True)
    repair_method_name = serializers.CharField(source='repair_method.name', read_only=True)

    class Meta:
        model = Claim
        fields = [
            'id','equipment_model_name', 'equipment_serial', 'failure_date', 'engine_hours', 'failure_node_name', 'failure_description', 
            'repair_method_name', 'spare_parts', 'repair_date', 'downtime', 'service_company_name'
        ]