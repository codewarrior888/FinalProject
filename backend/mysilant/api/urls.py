from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EquipmentViewSet, MaintenanceViewSet, ClaimViewSet

router = DefaultRouter()
router.register(r'equipment', EquipmentViewSet)
router.register(r'maintenance', MaintenanceViewSet)
router.register(r'claims', ClaimViewSet)

urlpatterns = [
    path('', include(router.urls)),
]