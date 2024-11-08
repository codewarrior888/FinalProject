from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReferenceViewSet, EquipmentViewSet, MaintenanceViewSet, ClaimViewSet

router = DefaultRouter()
router.register(r'equipment', EquipmentViewSet, basename='equipment')
router.register(r'maintenance', MaintenanceViewSet, basename='maintenance')
router.register(r'claims', ClaimViewSet, basename='claims')
router.register(r'references', ReferenceViewSet, basename='reference')

urlpatterns = [
    path('', include(router.urls)),
]