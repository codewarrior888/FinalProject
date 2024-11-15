from rest_framework import serializers
from .models import Reference, Equipment, Maintenance, Claim
from accounts.models import User


class ReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reference
        fields = [ 'id', 'category', 'name', 'description']

class EquipmentSerializer(serializers.ModelSerializer):
    equipment_model = serializers.PrimaryKeyRelatedField(queryset=Reference.objects.filter(category=Reference.EQUIPMENT))
    equipment_model_name = serializers.CharField(source='equipment_model.name', read_only=True)
    equipment_model_description = serializers.CharField(source='equipment_model.description', read_only=True)
    engine_model = serializers.PrimaryKeyRelatedField(queryset=Reference.objects.filter(category=Reference.ENGINE))
    engine_model_name = serializers.CharField(source='engine_model.name', read_only=True)
    engine_model_description = serializers.CharField(source='engine_model.description', read_only=True)
    transmission_model = serializers.PrimaryKeyRelatedField(queryset=Reference.objects.filter(category=Reference.TRANSMISSION))
    transmission_model_name = serializers.CharField(source='transmission_model.name', read_only=True)
    transmission_model_description = serializers.CharField(source='transmission_model.description', read_only=True)
    drive_axle_model = serializers.PrimaryKeyRelatedField(queryset=Reference.objects.filter(category=Reference.DRIVE_AXLE))
    drive_axle_model_name = serializers.CharField(source='drive_axle_model.name', read_only=True)
    drive_axle_model_description = serializers.CharField(source='drive_axle_model.description', read_only=True)
    steer_axle_model = serializers.PrimaryKeyRelatedField(queryset=Reference.objects.filter(category=Reference.STEER_AXLE))
    steer_axle_model_name = serializers.CharField(source='steer_axle_model.name', read_only=True)
    steer_axle_model_description = serializers.CharField(source='steer_axle_model.description', read_only=True)
    client = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role=User.CLIENT))
    client_name = serializers.CharField(source='client.company_name', read_only=True)
    service_company = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role=User.SERVICE_COMPANY))
    service_company_name = serializers.CharField(source='service_company.company_name', read_only=True)
    model_options_preview = serializers.SerializerMethodField()
    class Meta:
        model = Equipment
        fields = [
            'id','equipment_model','equipment_model_name', 'equipment_model_description', 'equipment_serial',
            'engine_model','engine_model_name', 'engine_model_description', 'engine_serial',
            'transmission_model','transmission_model_name', 'transmission_model_description', 'transmission_serial',
            'drive_axle_model','drive_axle_model_name', 'drive_axle_model_description', 'drive_axle_serial',
            'steer_axle_model','steer_axle_model_name', 'steer_axle_model_description', 'steer_axle_serial',
            'contract', 'shipment_date', 'consignee', 'delivery_address', 'model_options',
            'model_options_preview', 'client', 'client_name', 'service_company', 'service_company_name'
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
    equipment_serial = serializers.CharField(source='equipment.equipment_serial', read_only=True)
    maintenance_type = serializers.PrimaryKeyRelatedField(queryset=Reference.objects.filter(category=Reference.MAINTENANCE_TYPE))
    maintenance_type_name = serializers.CharField(source='maintenance_type.name', read_only=True)
    maintenance_company = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role=User.SERVICE_COMPANY))
    maintenance_company_name = serializers.CharField(source='maintenance_company.company_name', read_only=True)
    service_company = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role=User.SERVICE_COMPANY))
    service_company_name = serializers.CharField(source='service_company.company_name', read_only=True)


    class Meta:
        model = Maintenance
        fields = [
            'id', 'equipment', 'equipment_serial', 'maintenance_type', 'maintenance_type_name',
             'maintenance_date', 'engine_hours', 'order_number', 'order_date', 'maintenance_company',
             'maintenance_company_name', 'service_company', 'service_company_name'
        ]

class ClaimSerializer(serializers.ModelSerializer):
    # equipment_model_name = serializers.CharField(source='equipment.equipment_model.name', read_only=True)
    equipment_serial = serializers.CharField(source='equipment.equipment_serial', read_only=True)
    service_company = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role=User.SERVICE_COMPANY))
    service_company_name = serializers.CharField(source='service_company.company_name', read_only=True)
    failure_node = serializers.PrimaryKeyRelatedField(queryset=Reference.objects.filter(category=Reference.FAILURE_NODE))
    failure_node_name = serializers.CharField(source='failure_node.name', read_only=True)
    repair_method = serializers.PrimaryKeyRelatedField(queryset=Reference.objects.filter(category=Reference.REPAIR_METHOD))
    repair_method_name = serializers.CharField(source='repair_method.name', read_only=True)

    class Meta:
        model = Claim
        fields = [
            'id', 'equipment', 'equipment_serial', 'failure_date', 'engine_hours', 'failure_node', 'failure_node_name', 
            'failure_description', 'repair_method', 'repair_method_name', 'spare_parts', 'repair_date', 'downtime', 'service_company', 'service_company_name'
        ]