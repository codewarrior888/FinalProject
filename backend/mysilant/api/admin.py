from django.contrib import admin
from .models import (Reference, Equipment, Maintenance, Claim)

admin.site.register(Reference)
admin.site.register(Equipment)
admin.site.register(Maintenance)
admin.site.register(Claim)
