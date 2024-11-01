from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EquipmentViewSet, EquipmentPublicView, MaintenanceViewSet, ClaimViewSet

router = DefaultRouter()
router.register(r'equipment', EquipmentViewSet, basename='equipment')
router.register(r'maintenance', MaintenanceViewSet)
router.register(r'claims', ClaimViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('equipment/public/', EquipmentPublicView.as_view(), name='equipment-public'),
]